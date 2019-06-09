import { Omit } from '../../utils'

/**
 * Represents fluent cascading interface for services resolution
 * @public
 */
export interface IDecoratorResolution {

    /**
     * Sets arguments for service instantiation
     * @param args - optional arguments for the service instantiation
     * @returns - an instance of {@link WithDecoratorResolverArgs} interface
     */
    args(...value: any[]): WithDecoratorResolverArgs

    /**
     * Sets attempted resolution flag indicating non disruptive resolution
     * behavior (no exception is thrown when no registration found)
     * @returns - an instance of {@link WithDecoratorResolverAttempt} interface
     */
    attempt(): WithDecoratorResolverAttempt

    /**
     * Sets named resolution flag. Service will be resolved given the name provided
     * @param value - the name for the service to be resolved with
     * @returns - an instance of {@link WithDecoratorResolverName} interface
     */
    name(value : string): WithDecoratorResolverName

    /**
     * Sets cached resolution flag. When resolved, resolution will be stored in cache
     * @param name - the name to be used to retrieve resolution form cache
     * @returns - an instance of {@link WithDecoratorResolver} interface
     */
    cache(name?: string): WithDecoratorResolver

    /**
     * Finalizes service resolution specification
     * @returns - an instance of ParameterDecorator
     */
    resolve(): ParameterDecorator
}

/**
 * Represents service resolution fluent API step
 * @public
 */
export type WithDecoratorResolver = Pick<IDecoratorResolution, 'resolve'>

/**
 * Represents service resolution fluent API step where `args` method was omitted
 * @public
 */
export type WithDecoratorResolverArgs = Omit<IDecoratorResolution, 'args'>

/**
 * Represents service resolution fluent API step where `attempt` method was omitted
 * @public
 */
export type WithDecoratorResolverAttempt = Omit<WithDecoratorResolverArgs, 'attempt'>

/**
 * Represents service resolution fluent API step where `name` method was omitted
 * @public
 */
export type WithDecoratorResolverName = Omit<WithDecoratorResolverAttempt, 'name'>
