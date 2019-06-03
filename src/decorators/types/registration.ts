import { Owner, Scope } from '../../common'
import { IDisposer, IInitializer } from '../../registration'
import { Omit } from '../../utils'

/**
 * @public
 */
export interface IDecoratorRegistration<T> {
    initializeBy(action: IInitializer<T>): WithDecoratorRegisterInitializeBy<T>
    lazy(): WithDecoratorRegisterLazy<T>
    dispose(action: IDisposer<T>): WithDecoratorRegisterLazy<T>
    named(name: string): WithDecoratorRegisterName<T>

    within(scope: Scope): WithDecoratorRegisterScope<T>
    transient(): WithDecoratorRegisterScope<T>
    singleton(): WithDecoratorRegisterScope<T>
    instancePerContainer(): WithDecoratorRegisterScope<T>

    ownedBy(owner: Owner): WithDecoratorRegister<T>
    ownedInternally(): WithDecoratorRegister<T>
    ownedExternally(): WithDecoratorRegister<T>

    register(): ClassDecorator
}

/**
 * @public
 */
export type WithDecoratorRegister<T> = Pick<IDecoratorRegistration<T>, 'register'>

/**
 * @public
 */
export type WithDecoratorRegisterInitializeBy<T> = Omit<IDecoratorRegistration<T>, 'initializeBy'>

/**
 * @public
 */
export type WithDecoratorRegisterLazy<T> =
    Omit<WithDecoratorRegisterInitializeBy<T>, 'lazy' | 'dispose'>

/**
 * @public
 */
export type WithDecoratorRegisterName<T> = Omit<WithDecoratorRegisterLazy<T>, 'named'>

/**
 * @public
 */
export type WithDecoratorRegisterScope<T> = Omit<WithDecoratorRegisterName<T>,
    'within' | 'transient' | 'singleton' | 'instancePerContainer'>
