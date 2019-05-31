import { IDynamicDependency, IRegistration, IRegistrationBase } from '../../registration'
import { IResolveWith, IApiCache } from './resolution'

/**
 * @public
 */
export interface IContainer {
    cache: any

    resolve<R>(service: {}, ...args: {}[]): R | never
    resolveAsync<R>(service: {}, ...args: {}[]): Promise<R>

    tryResolve<R>(service: {}, ...args: {}[]): R | undefined
    tryResolveAsync<R>(service: {}, ...args: {}[]): Promise<R | undefined>

    resolveNamed<R>(service: {}, name: string, ...args: {}[]): R | never
    resolveNamedAsync<R>(service: {}, name: string, ...args: {}[]): Promise<R>

    tryResolveNamed<R>(service: {}, name: string, ...args: {}[]): R | undefined
    tryResolveNamedAsync<R>(service: {}, name: string, ...args: {}[]): Promise<R | undefined>

    resolveWithDependencies<R>(service: {}, dependencies: IDynamicDependency[]): R | never
    resolveWithDependenciesAsync<R>(service: {}, dependencies: IDynamicDependency[]): Promise<R>

    resolveWith<R>(service: {}): IResolveWith<R> | never

    createChild(): IContainer

    dispose(): void
    disposeAsync(): Promise<void>
}

/**
 * @public
 */
export interface IContainerBuilder {
    register<R>(service: {}): IRegistration<R>
    build(): IContainer
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
