import { IContainer, IContainerBuilder, IApiCache } from '../../build'
import { Index } from '../../types'
import { IInternalStorage } from '../../storage'
import { IInitializer, IDisposer, IRegistration } from '../../registration'
import { ScopeType } from '../../common'
import { IDecoratorRegistration } from './registration'
import { IDecoratorResolution } from './resolution'

export type DecoratorResolutionParameterType = 1 | 2 | 3

export const decoratorResolutionParameter = Object.freeze({
    service: 1,
    value: 2,
    functionValue: 3
})

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
    scope?: ScopeType
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
 * Represents a decorator style fluent cascading API services registration /
 * resolution interface
 * @public
 */
export interface IDecorator {
    /**
     * Creates an instance of {@link IContainer} interface
     *
     * @returns - an instance of {@link IContainer} interface
     */
    build(): IContainer

    /**
     * Registers a service using fluent API
     *
     * @param service - an instance of a service.
     * If service is `null` or `undefined` {@link ArgumentError} is thrown
     * @returns - an instance of {@link IDecoratorRegistration} fluent API interface
     */
    provide<R>(service: {}): IDecoratorRegistration<R>

    /**
     * Sets registration to be marked as self registration
     *
     * @remarks
     * Registration is provided as a type itself (participates both in registration and
     * resolution). It is intended for construct-able types only. Uses new
     * operator for type construction
     *
     * @returns - an instance of {@link IDecoratorRegistration} interface
     */
    provideSelf<R>(): IDecoratorRegistration<R>

    /**
     * Specifies entry point into decorator fluent cascading API for
     * service resolution
     * @param service - component registration service
     * @returns - an instance of {@link IDecoratorResolution} interface
     */
    by(service?: {}): IDecoratorResolution

    /**
     * Specifies a value to be used for parameter resolution. It is used as is
     * and no resolution computation is preformed
     * @param value - resolution value
     * @returns - ParameterDecorator instance
     */
    resolveValue(value: {} | Function): ParameterDecorator

    /**
     * Provides non decorator compatible registration interface
     * @param service - component registration service
     * @returns an instance on {@link IRegistration} interface
     */
    register<R>(service: {}): IRegistration<R>

    /**
     * Imports registrations from non decorator container builder
     * @param builder - an instance of {@link IContainerBuilder} interface
     */
    import(builder: IContainerBuilder): void
}
