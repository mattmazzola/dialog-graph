import * as crypto from 'crypto'
import uuid from 'uuid/v4'

export interface Node<T = any> {
    id: string
    // Hash of whatever portion of the data we think is relavent for simple comparisons
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

    // Build up nodes and edges by adding each sequence
    // If there is a matching node, add edge
    // Otherwse ade node and edge
    const initialGraph: Graph = {
        nodes: [],
        edges: []
    }

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
    const edges = nodes.slice(1).map<Edge>((n, i) => {
        const currentNode = n
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

/**
 * Given any data, create hash of data to get unique signaure, then generate unique id.
 * 
 * @param data Node Data
 * @param prefix as
 */
export function getNode<T>(data: T, prefix: string = ''): Node<T> {
    const hash = `${prefix}`// `${prefix}-${sha256(JSON.stringify(data))}`
    const id = uuid()
    return {
        data,
        hash,
        id,
    }
}