import { Owner, Scope } from '../../common'
import { IDisposer, IInitializer } from '../../registration'
import { Omit } from '../../utils'

export interface IDecoratorRegistration<T> {
    initializeBy(action: IInitializer<T>): WithInitializeBy<T>
    lazy(): WithLazy<T>
    dispose(action: IDisposer<T>): WithLazy<T>
    named(name: string): WithName<T>

    within(scope: Scope): WithScope<T>
    transient(): WithScope<T>
    singleton(): WithScope<T>
    instancePerContainer(): WithScope<T>

    ownedBy(owner: Owner): WithRegister<T>
    ownedInternally(): WithRegister<T>
    ownedExternally(): WithRegister<T>

    register(): ClassDecorator
}

export type WithRegister<T> = Pick<IDecoratorRegistration<T>, 'register'>

export type WithInitializeBy<T> = Omit<IDecoratorRegistration<T>, 'initializeBy'>

export type WithLazy<T> = Omit<WithInitializeBy<T>, 'lazy' | 'dispose'>

export type WithName<T> = Omit<WithLazy<T>, 'named'>

export type WithScope<T> = Omit<WithName<T>,
    'within' | 'transient' | 'singleton' | 'instancePerContainer'>
