export interface IData {
    nodes: INode[],
    links: ILink[],
}

export interface INode {
    id: string
}

export interface ILink {
    source: string
    target: string
}