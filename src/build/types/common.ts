import { IDynamicDependency, IRegistration, IRegistrationBase } from '../../registration'
import { IResolveWith, IApiCache } from './resolution'
import { ICache } from '../../types'

/**
 * Represents container interface
 *
 * @remarks
 * Containers are used to resolve prior registered services
 *
 * @public
 */
export interface IContainer {
    /**
     * Represents a dictionary of cached components/resolved registrations {@link ICache}
     *
     * @remarks
     * If a service is registered with a cache option, its resolution is available
     * through the `cache` property.
     */
    cache: ICache

    /**
     * Resolves a service with optional parameters
     * Throws {@link ResolutionError} if not registration found
     * @param service - service value registered prior resolution.
     * If service is `null` or `undefined` {@link ArgumentError} is thrown
     * @param args - optional arguments for the service instantiation
     * @returns - registered instance of a service
     */
    resolve<R>(service: {}, ...args: {}[]): R | never

    /**
     * Asynchronously resolves a service with optional parameters
     * @param service - service value registered prior resolution
     * @param args - optional arguments for the service instantiation
     * @returns - promise, resolving with a registered instance of a service.
     * If registration not found - rejects the promise with {@link ResolutionError}
     * If `null` or `undefined` service value, rejects the promise with {@link ArgumentError}
     */
    resolveAsync<R>(service: {}, ...args: {}[]): Promise<R>

    /**
     * Attempts to resolve a service with optional parameters.
     * @param service - service value registered prior resolution.
     * If service is `null` or `undefined` {@link ArgumentError} is thrown
     * @param args - optional arguments for the service instantiation
     * @returns - registered instance of a service.
     * If registration not found - returns undefined
     */
    tryResolve<R>(service: {}, ...args: {}[]): R | undefined

    /**
     * Asynchronously attempts to resolve a service with optional parameters.
     * @param service - service value registered prior resolution
     * @param args - optional arguments for the service instantiation
     * @returns - promise, resolving with a registered instance of a service.
     * If registration not found - returns a promise with undefined resolution
     * If `null` or `undefined` service value rejects the promise with {@link ArgumentError}
     */
    tryResolveAsync<R>(service: {}, ...args: {}[]): Promise<R | undefined>

    /**
     * Resolves a service with specific name and optional parameters
     * Throws {@link ResolutionError} if not registration found
     * @param service - service value registered prior resolution.
     * If service is `null` or `undefined` {@link ArgumentError} is thrown
     * @param name - a unique named used to register a service
     * If name is `null` or `undefined` {@link ArgumentError} is thrown
     * @param args - optional arguments for the service instantiation
     * @returns - registered instance of a service
     */
    resolveNamed<R>(service: {}, name: string, ...args: {}[]): R | never

    /**
     * Asynchronously resolves a service with specific name and optional parameters
     * @param service - service value registered prior resolution
     * @param name - a unique named used to register a service
     * @param args - optional arguments for the service instantiation
     * @returns - promise, resolving with a registered instance of a service.
     * If registration not found - rejects the promise with {@link ResolutionError}
     * If `null` or `undefined` service value rejects the promise with {@link ArgumentError}
     * If `null` or `undefined` name value rejects the promise with {@link ArgumentError}
     */
    resolveNamedAsync<R>(service: {}, name: string, ...args: {}[]): Promise<R>

    /**
     * Attempts to resolve a service with specific name and optional parameters
     * @param service - service value registered prior resolution.
     * If service is `null` or `undefined` {@link ArgumentError} is thrown
     * @param name - a unique named used to register a service
     * If name is `null` or `undefined` {@link ArgumentError} is thrown
     * @param args - optional arguments for the service instantiation
     * @returns - registered instance of a service.
     * If registration not found - returns undefined
     */
    tryResolveNamed<R>(service: {}, name: string, ...args: {}[]): R | undefined

    /**
     * Asynchronously attempts to resolve a service with specific name and optional parameters
     * @param service - service value registered prior resolution
     * @param name - a unique named used to register a service
     * @param args- optional arguments for the service instantiation
     * @returns - promise, resolving with a registered instance of a service.
     * If registration not found - returns a promise with undefined resolution
     * If `null` or `undefined` service value rejects the promise with {@link ArgumentError}
     * If `null` or `undefined` name value rejects the promise with {@link ArgumentError}
     */
    tryResolveNamedAsync<R>(service: {}, name: string, ...args: {}[]): Promise<R | undefined>

    /**
     * Resolves a service with dynamic dependencies
     *
     * @remarks
     * A service gets resolved with all the dependencies provided without affecting original
     * registration. All the services resolved with dynamic dependencies get transient
     * (no scope, {@link Scope}, {@link scope}) life cycle assigned regardless of initial
     * life cycle specified
     *
     * Throws {@link ResolutionError} if not registration found
     * @param service - service value registered prior resolution
     * If service is `null` or `undefined` {@link ArgumentError} is thrown
     * @param dependencies - an array of {@link IDynamicDependency} instances
     * @returns - registered instance of a service
     */
    resolveWithDependencies<R>(service: {}, dependencies: IDynamicDependency[]): R | never

    /**
     * Asynchronously resolves a service with dynamic dependencies
     *
     * @remarks
     * A service gets resolved with all the dependencies provided without affecting original
     * registration. All the services resolved with dynamic dependencies get transient
     * (no scope, {@link Scope}, {@link scope}) life cycle assigned regardless of initial
     * life cycle specified
     *
     * @param service - service value registered prior resolution
     * @param dependencies - an array of {@link IDynamicDependency} instances
     * @returns - promise, resolving with a registered instance of a service
     * If registration not found - rejects the promise with {@link ResolutionError}
     * If `null` or `undefined` service value rejects the promise with {@link ArgumentError}
     */
    resolveWithDependenciesAsync<R>(service: {}, dependencies: IDynamicDependency[]): Promise<R>

    /**
     * Resolves a service using fluent cascading interface
     *
     * @param service - service value registered prior resolution
     * If service is `null` or `undefined` {@link ArgumentError} is thrown
     * @returns - an instance of {@link IResolveWith} interface
     */
    resolveWith<R>(service: {}): IResolveWith<R> | never

    /**
     * Creates nested life cycle scoped container
     * @returns - an instance of {@link IContainer} interface
     */
    createChild(): IContainer

    /**
     * Disposes all resolved, internally owned instances registered
     * using {@link IDisposer} interface
     */
    dispose(): void

    /**
     * Asynchronously disposes all resolved, internally owned instances registered
     * using {@link IDisposer} interface
     * @returns - promise
     */
    disposeAsync(): Promise<void>
}

/**
 * Represents container builder interface
 *
 * @remarks
 * Container builders provide functionality for working with containers and registering services
 *
 * @public
 */
export interface IContainerBuilder {
    /**
     * Registers a service using fluent API
     *
     * @param service - an instance of a service.
     * If service is `null` or `undefined` {@link ArgumentError} is thrown
     * @returns - an instance of {@link IRegistration} fluent API interface
     */
    register<R>(service: {}): IRegistration<R>

    /**
     * Creates an instance of {@link IContainer} interface
     *
     * @returns - an instance of {@link IContainer} interface
     */
    build(): IContainer

    /**
     * Copies all registrations from the container builder provided into self
     *
     * @param builder - an instance of {@link IContainerBuilder} interface
     */
    copy(builder: IContainerBuilder): void
}

export type ImportApi<T> = {
    execute(api: IContainerApi<T>): T
}

export interface IContainerApi<T> {
    serviceValue: {}
    nameValue: string | undefined
    cacheValue: IApiCache
    dependenciesValue: IDynamicDependency[]
    isDependenciesResolvable: boolean
    attemptValue: boolean
    throwResolveError: boolean
    argsValue: {}[]
    service(value: {}): IResolveWith<T>
}

export interface IInternalContainer extends IContainer {
    add(registrations: IRegistrationBase[]): void
}

export interface IInvoker {
    invoke<R>(
        registration: IRegistrationBase,
        throwIfNotFound: boolean,
        args?: {}[]): R | (() => R)
}
