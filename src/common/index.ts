import { owner, Owner } from './owner'
import { scope, Scope } from './scope'

export interface IDefaults {
    scope : Scope,
    owner : Owner
}

export const defaults: IDefaults = {
    get scope(): Scope {
        return scope.none
    },

    get owner(): Owner {
        return owner.container
    }
}

export { owner, Owner } from './owner'
export { scope, Scope } from './scope'
export { callInfo, CallInfo  } from './call-info-type'
