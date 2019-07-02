import { InternalStorage } from './internal-storage.js'
import { ResolutionError } from '../exceptions/index.js'
import { IResolutionCache }from './types'

export class ResolutionCache implements IResolutionCache {
    private _storage: InternalStorage<string, any>
    private _instance = {}

    public get instance() {
        return this._instance
    }

    constructor() {
        this._storage = new InternalStorage()
    }

    public resolve<R>(name: string): R | never {
        if (!this._storage.contains(name)) {
            throw new ResolutionError({ message: 'Could not resolve service', data: name })
        }

        return this._storage.get(name)
    }

    public add(name: string, value: any) {
        this._storage.add(name, value)

        Object.defineProperty(this.instance, name, {
            enumerable: true,
            configurable: false,
            get: () => {
                return this._storage.get(name)
            }
        })
    }

    public clear(): void {
        this._storage.clear()
        this._instance = {}
    }
}
