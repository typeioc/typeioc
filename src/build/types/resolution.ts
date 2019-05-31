import { IDynamicDependency } from '../../registration'
import { Omit } from '../../utils'

export interface IApiCache {
    use: boolean
    name?: string
}

/**
 * @public
 */
export interface IResolveWith<T> {
    args(...args: {}[]): WithArgs<T>
    attempt(): WithAttempt<T>
    name(value: string): WithName<T>
    dependencies(dependencies: IDynamicDependency | IDynamicDependency[]): WithName<T>
    cache(name?: string): WithCache<T>
    exec(): T
    execAsync(): Promise<T>
}

/**
 * @public
 */
export type WithArgs<T> = Omit<IResolveWith<T>, 'args'>

/**
 * @public
 */
export type WithAttempt<T> = Omit<WithArgs<T>, 'attempt'>

/**
 * @public
 */
export type WithName<T> = Omit<WithAttempt<T>, 'name'>

/**
 * @public
 */
export type WithCache<T> = Pick<IResolveWith<T>, 'exec' | 'execAsync'>
