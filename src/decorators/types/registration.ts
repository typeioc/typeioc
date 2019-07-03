import { ScopeType } from '../../common'
import { IDisposer, IInitializer } from '../../registration'
import { Omit } from '../../utils'

/**
 * Represents an entry into service registration fluent cascading API interface
 * @public
 */
export interface IDecoratorRegistration<T> {
    /**
     * Specifies initialization action during service instantiation
     * @param action - an instance of {@link IInitializer} interface
     * @returns - an instance of {@link WithDecoratorRegisterInitializeBy} interface
     */
    initializeBy(action: IInitializer<T>): WithDecoratorRegisterInitializeBy<T>

    /**
     * Specifies lazy registration. Resolution of services is differed until results
     * are needed by other services/computations
     * @returns - an instance of {@link WithDecoratorRegisterLazy} interface
     */
    lazy(): WithDecoratorRegisterLazy<T>

    /**
     * Specifies disposer action during resolution disposal.
     * @param action - disposer action to be called during resolution
     * disposal process ({@link IDisposer})
     * @returns - an instance of {@link WithDecoratorRegisterLazy} interface
     */
    dispose(action: IDisposer<T>): WithDecoratorRegisterLazy<T>

    /**
     * Specifies named registration. Registration can be resolved only using the name
     * provided
     * @param name - a value that should be used during service resolution
     * If parameter value is `null` or `undefined` {@link ArgumentError} is thrown
     * @returns - an instance of {@link WithDecoratorRegisterName} interface
     */
    named(name: string): WithDecoratorRegisterName<T>

    /**
     * Specifies resolution instance scope. Scope determines how resolved service
     * instances behave in between resolutions
     * @param scope - the value of the scope {@link ScopeType}
     * @returns - an instance of {@link WithDecoratorRegister} interface
     */
    within(scope: ScopeType): WithDecoratorRegister<T>

    /**
     * Specifies transient scope resolution. Every resolution of service returns new instance
     * Is similar to scope.none, scope.none {@link scope} (default behavior)
     * @returns - an instance of {@link WithDecoratorRegister} interface
     */
    transient(): WithDecoratorRegister<T>

    /**
     * Specifies singleton scope resolution. Every resolution of service returns same instance
     * Is similar to scope.hierarchy {@link scope}
     * @returns - an instance on {@link WithDecoratorRegister} interface
     */
    singleton(): WithDecoratorRegister<T>

    /**
     * Specifies instance per container scope resolution.
     * Every resolution of a service returns the same instance per instance of a container
     * Is similar to scope.container {@link scope}
     * @returns - an instance of {@link WithDecoratorRegister} interface
     */
    instancePerContainer(): WithDecoratorRegister<T>

    /**
     * Finalizes service registration
     */
    register(): ClassDecorator
}

/**
 * Represents a step within fluent cascading API registration sequence where
 * registration is finalized
 * @public
 */
export type WithDecoratorRegister<T> = Pick<IDecoratorRegistration<T>, 'register'>

/**
 * Represents a step within fluent cascading API registration sequence where
 * `initializeBy` method was omitted
 * @public
 */
export type WithDecoratorRegisterInitializeBy<T> = Omit<IDecoratorRegistration<T>, 'initializeBy'>

/**
 * Represents a step within fluent cascading API registration sequence where `lazy` and
 * `dispose` methods were omitted
 * @public
 */
export type WithDecoratorRegisterLazy<T> =
    Omit<WithDecoratorRegisterInitializeBy<T>, 'lazy' | 'dispose'>

/**
 * Represents a step within fluent cascading API registration sequence where `named` method
 * was omitted
 * @public
 */
export type WithDecoratorRegisterName<T> = Omit<WithDecoratorRegisterLazy<T>, 'named'>
