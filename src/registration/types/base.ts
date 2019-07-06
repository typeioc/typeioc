import {
    RegistrationType,
    IDynamicDependency,
    Factory,
    Initializer,
    Disposer
} from './common'

import { IContainer } from '../../build'
import { OwnerType, ScopeType } from '../../common'

export interface IRegistrationBase {
    id: string
    service: {}
    factory?: Factory<{}>
    factoryType?: {}
    factoryValue?: {}
    name?: string
    scope?: ScopeType
    owner: OwnerType
    initializer?: Initializer<{}>
    disposer?: Disposer<{}>
    args: {}[]
    params: {}[]
    container?: IContainer
    instance?: {}
    registrationType?: RegistrationType
    isLazy: boolean
    dependenciesValue: IDynamicDependency[]
    cloneFor: (container: IContainer) => IRegistrationBase
    clone: () => IRegistrationBase
    copyDependency: (dependency: IDynamicDependency) => void
    checkRegistrationType:() => void
}
