import * as crypto from 'crypto'

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

export function createDag<T>(
    dialogs: T[],
    getNodes: (dialog: T) => Node[],
): Graph {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Convert each dialog to sequence of nodes connected to children (linked list)
    const dialogsAsNodeLists: Node[][] = dialogs.map(d => getNodes(d))
    const dialogsAsGraphs: Graph[] = dialogsAsNodeLists.map(nodes => convertToGraph(nodes))
    console.log({ dialogsAsGraphs })

    // Build up nodes and edges by adding each sequence
    // If there is a matching node, add edge
    // Otherwse ade node and edge

    return {
        nodes,
        edges,
    }
}

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