import { Omit } from '../../utils'

/**
 * @public
 */
export interface IDecoratorResolution {
    args(...value: {}[]): WithDecoratorResolverArgs
    attempt(): WithDecoratorResolverAttempt
    name(value : string): WithDecoratorResolverName
    cache(name?: string): WithDecoratorResolver
    resolve(): ParameterDecorator
}

/**
 * @public
 */
export type WithDecoratorResolver = Pick<IDecoratorResolution, 'resolve'>

/**
 * @public
 */
export type WithDecoratorResolverArgs = Omit<IDecoratorResolution, 'args'>

/**
 * @public
 */
export type WithDecoratorResolverAttempt = Omit<WithDecoratorResolverArgs, 'attempt'>

/**
 * @public
 */
export type WithDecoratorResolverName = Omit<WithDecoratorResolverAttempt, 'name'>
