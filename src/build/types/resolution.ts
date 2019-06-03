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
    args(...args: {}[]): ResolveWithArgs<T>
    attempt(): ResolveWithAttempt<T>
    name(value: string): ResolveWithName<T>
    dependencies(dependencies: IDynamicDependency | IDynamicDependency[]): ResolveWithName<T>
    cache(name?: string): ResolveWithCache<T>
    exec(): T
    execAsync(): Promise<T>
}

/**
 * @public
 */
export type ResolveWithArgs<T> = Omit<IResolveWith<T>, 'args'>

/**
 * @public
 */
export type ResolveWithAttempt<T> = Omit<ResolveWithArgs<T>, 'attempt'>

/**
 * @public
 */
export type ResolveWithName<T> = Omit<ResolveWithAttempt<T>, 'name'>

/**
 * @public
 */
export type ResolveWithCache<T> = Pick<IResolveWith<T>, 'exec' | 'execAsync'>
