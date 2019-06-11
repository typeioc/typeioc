import { ICache } from '../../types'

export interface IResolutionCache extends ICache {
    add(name: string, value: any): void
    clear(): void
}
