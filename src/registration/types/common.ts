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
export type RegisterWithAs<T> = {
    initializeBy(action: IInitializer<T>): RegisterWithInitializeBy<T>
    lazy(): RegisterWithLazy<T>
    named(name: string): RegisterWithName<T>
    dispose(action: IDisposer<T>): RegisterWithLazy<T>

    within(scope: Scope): RegisterWithScope<T>
    transient(): RegisterWithScope<T>
    singleton(): RegisterWithScope<T>
    instancePerContainer(): RegisterWithScope<T>

    ownedBy(owner: Owner): void
    ownedInternally(): void
    ownedExternally(): void
}

/**
 * @public
 */
export type RegisterWithInitializeBy<T> = Omit<RegisterWithAs<T>, 'initializeBy'>

/**
 * @public
 */
export type RegisterWithLazy<T> = Omit<RegisterWithInitializeBy<T>, 'lazy' | 'dispose'>

/**
 * @public
 */
export type RegisterWithName<T> = Omit<RegisterWithLazy<T>, 'named'>

/**
 * @public
 */
export type RegisterWithScope<T> = Pick<RegisterWithAs<T>,
    'ownedBy' | 'ownedInternally' | 'ownedExternally'>

/**
 * @public
 */
export interface IRegistration<T> {
    as(factory: IFactory<T>): RegisterWithAs<T>
    asType(type: T, ...params: {}[]): RegisterWithAs<T>
    asSelf(...params: {}[]): RegisterWithAs<T>
    asValue(value: {}): IName
}
