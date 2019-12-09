import * as crypto from 'crypto'
import uuid from 'uuid/v4'

export interface Node<T = any> {
    id: string
    // Hash of data, only supply subset of actual data if you want to make different nodes have common hash
    hash: string
    data: T
}

export interface Edge {
    vertexA: Node
    vertexB: Node
}

export interface Graph {
    nodes: Node[]
    edges: Edge[]
}

export function sha256(s: string) {
    return crypto.createHash('sha256').update(s).digest('hex')
}

/**
 * Create graph from dialogs
 * 
 * @param dialogs Train Dialogs
 * @param getNodes Function to convert dialog to list of nodes
 */
export function createDagFromNodes<T>(
    dialogs: T[],
    getNodes: <R>(dialog: T) => Node<R>[],
    // TODO: Use generic typing to constrain to R from above?
    mergeNodeData: (n1: Node<any>, n2: Node<any>) => Node<any>
): Graph {
    // Convert each dialog to sequence of nodes connected to children (linked list)
    const dialogsAsNodeLists = dialogs.map(d => getNodes(d))
    const dialogsAsGraphs = dialogsAsNodeLists.map(nodes => convertToGraph(nodes))

    const mergedGraph: Graph = {
        nodes: [],
        edges: [],
    }

    if (dialogsAsGraphs.length === 1) {
        mergedGraph.nodes = dialogsAsGraphs[0].nodes
        mergedGraph.edges = dialogsAsGraphs[0].edges
    }
    else if (dialogsAsGraphs.length >= 2) {
        const [firstGraph, ...otherGraphs] = dialogsAsGraphs
        // Consolidate any redundant nodes in first graph
        const nodes: Node[] = []
        firstGraph.nodes.forEach((node, i) => {
            if (i >= 1) {
                // If any node before this node is the same
                const matchingNode = firstGraph.nodes
                    .slice(0, i)
                    .find(n => n.hash === node.hash)

                if (matchingNode) {
                    // Rewrite all edges TO node to matching node
                    firstGraph.edges
                        .filter(e => e.vertexB.id === node.id)
                        .forEach(e => e.vertexB = matchingNode)

                    // Rewrite all edges FROM the current node to come FROM the matching node
                    firstGraph.edges
                        .filter(e => e.vertexA.id === node.id)
                        .forEach(e => e.vertexA = matchingNode)

                    // Merge data from node into matching/existing node
                    mergeNodeData(matchingNode, node)
                }
                else {
                    nodes.push(node)
                }
            }
            else {
                nodes.push(node)
            }
        })

        mergedGraph.nodes = nodes
        mergedGraph.edges = firstGraph.edges

        // Add each graph to existing graph
        for (const dialogGraph of otherGraphs) {
            console.log(`Merging new dialog`)
            // Build up nodes and edges by adding each sequence
            // If there is a matching node, add edge
            for (const node of dialogGraph.nodes) {
                const matchingNode = mergedGraph.nodes.find(n => n.hash === node.hash)

                console.log(`Current Node: `, node.hash, node.data.extractorStep.textVariations.map((tv: any) => tv.text), node, JSON.parse(JSON.stringify(mergedGraph)))
                if (matchingNode) {
                    console.log(`Merge with node: `, matchingNode.hash, matchingNode.data.extractorStep.textVariations.map((tv: any) => tv.text), JSON.parse(JSON.stringify(matchingNode)))
                    // Rewrite all edges TO the current node to the matching node
                    dialogGraph.edges
                        .filter(e => e.vertexB.id === node.id)
                        .forEach(e => e.vertexB = matchingNode)

                    // Rewrite all edges FROM the current node to come FROM the matching node
                    dialogGraph.edges
                        .filter(e => e.vertexA.id === node.id)
                        .forEach(e => e.vertexA = matchingNode)

                    // Remove the matching node from original graph since all edges now use existing graph
                    dialogGraph.nodes = dialogGraph.nodes.filter(n => n.hash !== matchingNode.hash)

                    // Merge data from node into matching/existing node
                    mergeNodeData(matchingNode, node)
                }
            }

            mergedGraph.nodes.push(...dialogGraph.nodes)
            mergedGraph.edges.push(...dialogGraph.edges)
            console.log(`Add nodes and edges from dialog graph to merged graph `, JSON.parse(JSON.stringify(mergedGraph)))
        }
    }

    return mergedGraph
}

/**
 * Nodes in a list imply sequential connections.
 * Create edge for each node pointing to the previous node.
 */
const convertToGraph = (nodes: Node[]): Graph => {
    const edges = nodes
        .slice(1)
        .map<Edge>((n, i) => {
            const currentNode = n
            // Previous because of slice(1) and index on original nodes
            const previousNode = nodes[i]

            return {
                vertexA: previousNode,
                vertexB: currentNode,
            }
        })

    return {
        nodes,
        edges,
    }
}

export const combineGraphs = (graphs: Graph[]): Graph => {
    const initialGraph: Graph = {
        nodes: [],
        edges: [],
    }

    // Build up nodes and edges by adding each sequence
    // If there is a matching node, add edge
    // Otherwise add node and edge
    graphs.forEach(graph => {
        initialGraph.nodes.push(...graph.nodes)
        initialGraph.edges.push(...graph.edges)
    })

    return initialGraph
}

/**
 * Given any data, create hash of data to get unique signature, then generate unique id.
 * 
 * @param data Node Data
 * @param prefix as
 */
export function getNode<T>(data: T, hashData: object): Node<T> {
    const hash = sha256(JSON.stringify(hashData))
    const id = uuid()
    return {
        data,
        hash,
        id,
    }
}