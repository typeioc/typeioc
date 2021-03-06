import { IContainer } from '../../build'
import { ScopeType } from '../../common'
import { Omit } from '../../utils'

export type RegistrationType = 1 | 2 | 3

export const registrationType = Object.freeze({
    factory: 1 as RegistrationType,
    factoryType: 2 as RegistrationType,
    factoryValue: 3 as RegistrationType
})

/**
 * Represents factory method registration interface.
 * Receives an instance of a container {@link IContainer} and
 * an array of optional parameters provided during resolution
 * @public
 */
export type Factory<T> = (c: IContainer, ...args: any[]) => T

/**
 * Represents dynamic dependency interface
 * @public
 */
export interface IDynamicDependency {
    /**
     * Specifies service value, registration to be substituted for
     */
    service: {}

    /**
     * Specifies factory interface {@link Factory} to be used as substitution for factory
     * registrations
     */
    factory?: Factory<{}>

    /**
     * Specifies factory type to be used as substitution for factory type
     * registrations
     */
    factoryType?: {}

    /**
     * Specifies factory value to be used as substitution for factory value
     * registrations
     */
    factoryValue?: {}

    /**
     * Specifies a name to be used as substitution for named registrations
     */
    named?: string

    /**
     * Specifies an instance of initializer {@link Initializer} to be used
     * during substitution initialization
     */
    initializer?: Initializer<{}>

    /**
     * Specifies the necessity of the registration presence prior substitution.
     * If required is true and no registration found, throws {@link ResolutionError}
     * during resolution
     */
    required?: boolean
}

/**
 * Specifies an instance of the initialization action to be used during resolution instantiation.
 * Receives an instance of a container {@link IContainer} and an instance of the resolved service
 * @public
 */
export type Initializer<T> = (c: IContainer, item: T) => T

/**
 * Specifies an instance of the dispose action to be used during resolution disposal
 * Receives an instance of the resolution
 * @public
 */
export type Disposer<T> = (item: T) => void

/**
 * Represents an entry step within registration fluent cascading API sequence
 * @public
 */
export interface IRegisterWithAs<T> {
    /**
     * Specifies initialization action during service instantiation
     * @param action - an instance of {@link Initializer} interface
     * @returns - an instance of {@link RegisterWithInitializeBy} interface
     */
    initializeBy<K extends T>(action: Initializer<K>): RegisterWithInitializeBy<K>

    /**
     * Specifies lazy registration. Resolution of services is differed until results
     * are needed by other services/computations
     * @returns - an instance of {@link RegisterWithLazy} interface
     */
    lazy(): RegisterWithLazy<T>

    /**
     * Specifies named registration. Registration can be resolved only using the name
     * provided
     * @param name - a value that should be used during service resolution
     * @returns - an instance of {@link RegisterWithName} interface
     */
    named(name: string): RegisterWithName<T>

    /**
     * Specifies disposer action during resolution disposal.
     * @param action - disposer action to be called during resolution
     * disposal process ({@link Disposer})
     * @returns - an instance of {@link RegisterWithLazy} interface
     */
    dispose<K extends T>(action: Disposer<K>): RegisterWithLazy<K>

    /**
     * Specifies resolution instance scope. Scope determines how resolved service
     * instances behave in between resolutions
     * @param scope - the value of the scope {@link ScopeType}
     * @returns - void
     */
    within(scope: ScopeType): void

    /**
     * Specifies transient scope resolution. Every resolution of service returns new instance
     * Is similar to scope.none {@link ScopeType} (default behavior)
     * @returns - void
     */
    transient(): void

    /**
     * Specifies singleton scope resolution. Every resolution of service returns same instance
     * Is similar to scope.hierarchy {@link scope}
     * @returns - void
     */
    singleton(): void

    /**
     * Specifies instance per container scope resolution.
     * Every resolution of a service returns the same instance per instance of a container
     * Is similar to scope.container {@link scope}
     * @returns - void
     */
    instancePerContainer(): void
}

/**
 * Specifies named registration interface with no additional steps
 * within fluent cascading API
 * Receives a value to be used named registrations / resolutions
 * @public
 */
export interface IName {
    named(name: string): void
}

/**
 * Represents a step within fluent cascading API registration sequence where `initializeBy` method
 * was omitted
 * @public
 */
export type RegisterWithInitializeBy<T> = Omit<IRegisterWithAs<T>, 'initializeBy'>

/**
 * Represents a step within fluent cascading API registration sequence where `lazy` and
 * `dispose` methods were omitted
 * @public
 */
export type RegisterWithLazy<T> = Omit<RegisterWithInitializeBy<T>, 'lazy' | 'dispose'>

/**
 * Represents a step within fluent cascading API registration sequence where `named` method
 * was omitted
 * @public
 */
export type RegisterWithName<T> = Omit<RegisterWithLazy<T>, 'named'>

/**
 * Represents an entry into service registration fluent cascading API interface
 * @public
 */
export interface IRegistration<T> {
    /**
     * Sets registration to be marked as factory registration
     *
     * @remarks
     * Registration is provided as a factory method
     *
     * @param factory - an instance of {@link Factory} interface
     * @returns - an instance of {@link IRegisterWithAs} interface
     */
    as(factory: Factory<T>): IRegisterWithAs<T>

    /**
     * Sets registration to be marked as type registration
     *
     * @remarks
     * Registration is provided as a type. An instance of the type is instantiated
     * during resolution. It is intended for construct-able types only. Uses new
     * operator for type construction
     *
     * @param type - type representative to be used for the instance construction
     * @param params - optional array of parameters to be used for the type
     * instance construction
     * @returns - an instance of {@link IRegisterWithAs} interface
     */
    asType(type: T, ...params: any[]): IRegisterWithAs<T>

    /**
     * Sets registration to be marked as self registration
     *
     * @remarks
     * Registration is provided as a type itself (participates both in registration and
     * resolution). It is intended for construct-able types only. Uses new
     * operator for type construction
     *
     * @param params - optional array of parameters to be used for the type
     * @returns - an instance of {@link IRegisterWithAs} interface
     */
    asSelf(...params: any[]): IRegisterWithAs<T>

    /**
     * Sets registration to be marked as value registration
     *
     * @remarks
     * Registration is provided as a value that is returned during resolution
     *
     * @param value - value to be returned during resolution
     * @returns - an instance of {@link IName} interface
     */
    asValue(value: {}): IName
}
