import { Disposer } from '../registration'
import { IDisposableStorage, DisposableItem } from './types'

export class DisposableStorage implements IDisposableStorage {
    private _disposables: DisposableItem[] = []

    public add(obj: {}, disposer: Disposer<{}>) {

        const item = this.createDisposableItem(obj, disposer)

        this._disposables.push(item)
    }

    public disposeItems() {

        while (this._disposables.length > 0) {
            const item = this._disposables.pop()!

            const obj = item.weakReference
            item.disposer(obj)
        }
    }

    createDisposableItem(obj: {}, disposer: Disposer<{}>): DisposableItem {
        return {
            weakReference: obj,    // TODO: change this for ES6 weak-map
            disposer
        }
    }
}
