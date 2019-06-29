import { IndexedCollection, Index } from  '../../types'
import { IRegistrationBase, RegistrationType } from '../../registration'

export interface FactoryTypeStore {
    factory: {
        noName?: IRegistrationBase,
        names: IndexedCollection<IRegistrationBase>
    },

    type: RegistrationType
}

export interface FactoryValueStore {
    factory: {
        noName?: IRegistrationBase,
        names: IndexedCollection<IRegistrationBase>
    },

    type: RegistrationType
}

export interface FactoryStore {
    factory: {
        noName: Index<IRegistrationBase>,
        names: IndexedCollection<Index<IRegistrationBase>>
    },

    type: RegistrationType
}

export type Store = FactoryStore | FactoryValueStore | FactoryTypeStore

export type AddStrategy = (registration: IRegistrationBase) => void
export type GetStrategy = (registration: IRegistrationBase, storage: Store) =>
    IRegistrationBase | undefined

export interface IRegistrationStorage {
    addEntry(registration: IRegistrationBase): void
    getEntry(registration: IRegistrationBase): IRegistrationBase | undefined
    clear(): void
}
