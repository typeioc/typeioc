import { IContainer, IContainerBuilder, IApiCache } from '../../build'
import { Index } from '../../types'
import { IInternalStorage } from '../../storage'
import { IInitializer, IDisposer, IRegistration } from '../../registration'
import { Owner, Scope } from '../../common'
import { IDecoratorRegistration } from './registration'
import { IDecoratorResolution } from './resolution'

export const enum DecoratorResolutionParameterType {
    Service = 1,
    Value = 2,
    FunctionValue = 3
}

export interface IDecoratorResolutionCollection extends Index<IDecoratorResolutionParams> {}

export interface IDecoratorResolutionParams {
    value?: {}
    service?: {}
    args?: {}[]
    name?: string
    attempt?: boolean
    cache? : IApiCache
    type: DecoratorResolutionParameterType
}

export interface IDecoratorResolutionParamsData
    extends IInternalStorage<{}, IDecoratorResolutionCollection> { }

export interface IDecoratorRegistrationApi<T> {
    service?: {}
    initializedBy?: IInitializer<T>
    isLazy: boolean
    disposedBy?: IDisposer<T>
    name?: string
    scope?: Scope
    owner?: Owner
    provide(service: {}): IDecoratorRegistration<T>
    provideUndefined() : IDecoratorRegistration<T>
}

export interface IDecoratorResolutionApi {
    service?: {}
    args: {}[]
    attempt: boolean
    name?: string
    cache: IApiCache
    by(service?: {}): IDecoratorResolution
}

/**
 * @public
 */
export interface IDecorator {
    build(): IContainer
    provide<R>(service: {}): IDecoratorRegistration<R>
    provideSelf<R>(): IDecoratorRegistration<R>
    by(service?: {}): IDecoratorResolution
    resolveValue(value: {} | Function): ParameterDecorator
    register<R>(service: {}): IRegistration<R>
    import(builder: IContainerBuilder): void
}
