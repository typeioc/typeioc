import { HashTable } from 'hashes'
import { IInternalStorage } from './types'

export class InternalStorage<K, T> implements IInternalStorage<K, T> {

    private _collection  : hashes.IHashTable<K, T>

    constructor() {
        this._collection = new HashTable<K, T>()
    }

    public add(key : K, value : T) : void {
        this._collection.add(key, value, true)
    }

    public tryGet(key : K) : T | undefined {
        return this.contains(key) ? this._collection.get(key).value : undefined
    }

    public register(key: K, defaultValue: () => T) : T {

        if (this.contains(key)) {
            return this._collection.get(key).value
        }

        const entry = defaultValue()
        this.add(key, entry)

        return entry
    }

    public contains (key : K) : boolean {
        return this._collection.contains(key)
    }

    public clear() {
        this._collection.clear()
    }
}
