import { FactoryTypeStore, FactoryValueStore, FactoryStore } from  './types'
import { registrationType } from '../registration'

export const empty = {

    typeFactoryBucket(): FactoryTypeStore {
        return {
            factory: {
                noName: undefined,
                names: {}
            },
            type: registrationType.factoryType
        }
    },

    valueFactoryBucket(): FactoryValueStore {
        return {
            factory: {
                noName: undefined,
                names: {}
            },
            type: registrationType.factoryValue
        }
    },

    factoryBucket(): FactoryStore {
        return {
            factory: {
                noName: {},
                names: {}
            },
            type: registrationType.factory
        }
    }
}
