export type IInternalStorage<K, T> = {
    add(key : K, value : T) : void
    get(key: K): T
    tryGet(key : K) : T | undefined
    register(key: K, defaultValue: () => T) : T
    contains (key : K) : boolean
    clear(): void
}
