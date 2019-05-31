import { IDisposer } from '../../registration'

export type DisposableItem = {
    weakReference: {}
    disposer: IDisposer<{}>
}

export interface IDisposableStorage {
    add(obj: {}, disposer: IDisposer<{}>): void
    disposeItems(): void
}
