import {
    RegistrationType,
    IDynamicDependency,
    IFactory,
    IInitializer,
    IDisposer
} from './common'

import { IContainer } from '../../build'
import { Owner, Scope } from '../../common'

export interface IRegistrationBase {
    id: string
    service: {}
    factory?: IFactory<{}>
    factoryType?: {}
    factoryValue?: {}
    name?: string
    scope?: Scope
    owner?: Owner
    initializer?: IInitializer<{}>
    disposer?: IDisposer<{}>
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