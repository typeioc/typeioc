export type Index<T> = {
    [index: number]: T
}

export type IndexedCollection<T> = Index<T> & {
    [name: string]: T
}

export type SetPrototypeOf = {
    setPrototypeOf: Function
}
