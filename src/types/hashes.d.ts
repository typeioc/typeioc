declare module hashes {

    export interface IHashTable<K, T> {
        add(key : K, value : T, override : boolean) : void;
        get(key : K) : { value : T};
        contains(key : K) : boolean;
        clear(): void;
    }

    export class HashTable<K, T> implements IHashTable<K, T> {
        add(key : K, value : T, override : boolean) : void;
        get(key : K) : { value : T};
        contains(key : K) : boolean;
        clear(): void;
    }
}

declare module "hashes" {
    export = hashes;
}
