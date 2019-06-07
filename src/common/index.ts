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

export { owner, Owner, OwnerType } from './owner'
export { scope, Scope, ScopeType } from './scope'
export { callInfo, CallInfo, CallInfoType  } from './call-info-type'
