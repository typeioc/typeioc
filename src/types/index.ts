export type Index<T> = {
    [index: number]: T
}

/**
 * @public
 */
export type IStringIndex<T> = {
    [name: string]: T
}

export type IndexedCollection<T> = Index<T> & IStringIndex<T>

export type SetPrototypeOf = {
    setPrototypeOf: Function
}
