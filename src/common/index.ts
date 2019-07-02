import { owner, OwnerType } from './owner.js'
import { scope, ScopeType } from './scope.js'

export interface IDefaults {
    scope : ScopeType,
    owner : OwnerType
}

export const defaults: IDefaults = {
    get scope(): ScopeType {
        return scope.none
    },

    get owner(): OwnerType {
        return owner.container
    }
}

export { owner, OwnerType } from './owner'
export { scope, ScopeType } from './scope'
export { callInfo, CallInfoType } from './call-info-type'
