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
    getNodes: (dialog: T) => Node[],
): Graph {
    // Convert each dialog to sequence of nodes connected to children (linked list)
    const dialogsAsNodeLists: Node[][] = dialogs.map(d => getNodes(d))
    const dialogsAsGraphs: Graph[] = dialogsAsNodeLists.map(nodes => convertToGraph(nodes))

    const initialGraph: Graph = {
        nodes: [],
        edges: [],
    }

    // Build up nodes and edges by adding each sequence
    // If there is a matching node, add edge
    // Otherwise add node and edge
    const dialogsGraph = dialogsAsGraphs.reduce<Graph>((graph, dialogGraph) => {
        graph.nodes.push(...dialogGraph.nodes)
        graph.edges.push(...dialogGraph.edges)

        return graph
    }, initialGraph)

    console.log({ dialogsAsGraphs, dialogsGraph })

    return dialogsGraph
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
export function getNode<T>(data: T, prefix: string = ''): Node<T> {
    // const hash = `${prefix}`
    const hash = `${prefix}-${sha256(JSON.stringify(data))}`
    const id = uuid()
    return {
        data,
        hash,
        id,
    }
}