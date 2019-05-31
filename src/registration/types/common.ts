import { IContainer } from '../../build'
import { Scope, Owner } from '../../common'
import { Omit } from '../../utils'

export const enum RegistrationType {
    Factory = 1,
    FactoryType = 2,
    FactoryValue = 3
}

/**
 * @public
 */
export interface IFactory<T> {
    (c: IContainer, ...args: any[]) : T
}

/**
 * @public
 */
export interface IDynamicDependency {
    service: {}
    factory?: IFactory<{}>
    factoryType?: {}
    factoryValue?: {}
    named?: string
    initializer?: IInitializer<{}>
    required?: boolean
}

/**
 * @public
 */
export interface IInitializer<T> {
    (c: IContainer, item: T) : T
}

/**
 * @public
 */
export interface IName {
    named(name: string): void
}

/**
 * @public
 */
export interface IDisposer<T> {
    (item: T): void
}

/**
 * @public
 */
export type WithAs<T> = {
    initializeBy(action: IInitializer<T>): WithInitializeBy<T>
    lazy(): WithLazy<T>
    named(name: string): WithName<T>
    dispose(action: IDisposer<T>): WithLazy<T>

    within(scope: Scope): WithScope<T>
    transient(): WithScope<T>
    singleton(): WithScope<T>
    instancePerContainer(): WithScope<T>

    ownedBy(owner: Owner): void
    ownedInternally(): void
    ownedExternally(): void
}

/**
 * @public
 */
export type WithInitializeBy<T> = Omit<WithAs<T>, 'initializeBy'>

/**
 * @public
 */
export type WithLazy<T> = Omit<WithInitializeBy<T>, 'lazy' | 'dispose'>

/**
 * @public
 */
export type WithName<T> = Omit<WithLazy<T>, 'named'>

/**
 * @public
 */
export type WithScope<T> = Pick<WithAs<T>,
    'ownedBy' | 'ownedInternally' | 'ownedExternally'>

/**
 * @public
 */
export interface IRegistration<T> {
    as(factory: IFactory<T>): WithAs<T>
    asType(type: T, ...params: {}[]): WithAs<T>
    asSelf(...params: {}[]): WithAs<T>
    asValue(value: {}): IName
}
