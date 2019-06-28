import { owner, OwnerType } from './owner'
import { scope, Scope } from './scope'

export interface IDefaults {
    scope : Scope,
    owner : OwnerType
}

export const defaults: IDefaults = {
    get scope(): Scope {
        return scope.none
    },

    get owner(): OwnerType {
        return owner.container
    }
}

export { owner, OwnerType } from './owner'
export { scope, Scope, ScopeType } from './scope'
export { callInfo, CallInfo, CallInfoType  } from './call-info-type'
