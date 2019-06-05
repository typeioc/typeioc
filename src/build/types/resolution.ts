import { IDynamicDependency } from '../../registration'
import { Omit } from '../../utils'

export interface IApiCache {
    use: boolean
    name?: string
}

/**
 * Represents fluent cascading interface for services resolution
 * @public
 */
export interface IResolveWith<T> {
    /**
     * Sets arguments for service instantiation
     * @param args - optional arguments for the service instantiation
     * @returns - an instance of {@link ResolveWithArgs} interface
     */
    args(...args: any[]): ResolveWithArgs<T>

    /**
     * Sets attempted resolution flag indicating non disruptive resolution
     * behavior (no exception is thrown when no registration found)
     * @returns - an instance of {@link ResolveWithAttempt} interface
     */
    attempt(): ResolveWithAttempt<T>

    /**
     * Sets named resolution flag. Service will be resolved given the name provided
     * @param value - the name for the service to be resolved with
     * @returns - an instance of {@link ResolveWithName} interface
     */
    name(value: string): ResolveWithName<T>

    /**
     * Sets dynamic dependencies for service resolution
     * @param dependencies - {@link IDynamicDependency} instance(s)
     * @returns - an instance of {@link ResolveWithName} interface
     */
    dependencies(dependencies: IDynamicDependency | IDynamicDependency[]): ResolveWithName<T>

    /**
     * Sets cached resolution flag. When resolved, resolution will be stored in cache
     * @param name - the name to be used to retrieve resolution form cache
     * @returns - an instance of {@link ResolveWithCache} interface
     */
    cache(name?: string): ResolveWithCache<T>

    /**
     * Executes service resolution
     * @returns - an instance of resolved service
     */
    exec(): T

    /**
     * Asynchronously executes service resolution
     * @returns - promise, resolving with a registered instance of a service
     */
    execAsync(): Promise<T>
}

/**
 * Represents a step within fluent cascading API sequence where `args` method
 * was applied
 * @public
 */
export type ResolveWithArgs<T> = Omit<IResolveWith<T>, 'args'>

/**
 * Represents a step within fluent cascading API sequence where `attempt` method
 * was applied
 * @public
 */
export type ResolveWithAttempt<T> = Omit<ResolveWithArgs<T>, 'attempt'>

/**
 * Represents a step within fluent cascading API sequence where `name` method
 * was applied
 * @public
 */
export type ResolveWithName<T> = Omit<ResolveWithAttempt<T>, 'name'>

/**
 * * Represents final step within fluent cascading API sequence
 * @public
 */
export type ResolveWithCache<T> = Pick<IResolveWith<T>, 'exec' | 'execAsync'>
