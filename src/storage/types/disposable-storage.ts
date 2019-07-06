import { Disposer } from '../../registration'

export type DisposableItem = {
    weakReference: {}
    disposer: Disposer<{}>
}

export interface IDisposableStorage {
    add(obj: {}, disposer: Disposer<{}>): void
    disposeItems(): void
}
