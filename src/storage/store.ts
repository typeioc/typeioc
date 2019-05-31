import { FactoryTypeStore, FactoryValueStore, FactoryStore } from  './types'
import { RegistrationType } from '../registration'

export const empty = {

    typeFactoryBucket(): FactoryTypeStore {
        return {
            factory: {
                noName: undefined,
                names: {}
            },
            type: RegistrationType.FactoryType
        }
    },

    valueFactoryBucket(): FactoryValueStore {
        return {
            factory: {
                noName: undefined,
                names: {}
            },
            type: RegistrationType.FactoryValue
        }
    },

    factoryBucket(): FactoryStore {
        return {
            factory: {
                noName: {},
                names: {}
            },
            type: RegistrationType.Factory
        }
    }
}
