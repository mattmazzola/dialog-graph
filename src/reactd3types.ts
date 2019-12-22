export interface IData<T> {
    nodes: INode<T>[],
    links: ILink[],
}

export type INode<T> = {
    id: string
    hash: string
    data: T
}

export interface ILink {
    source: string
    target: string
}