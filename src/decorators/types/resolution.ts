import { Omit } from '../../utils'

export interface IDecoratorResolution {
    args(...value: {}[]): WithArgs
    attempt(): WithAttempt
    name(value : string): WithName
    cache(name?: string): WithResolver
    resolve(): ParameterDecorator
}

export type WithResolver = Pick<IDecoratorResolution, 'resolve'>

export type WithArgs = Omit<IDecoratorResolution, 'args'>

export type WithAttempt = Omit<WithArgs, 'attempt'>

export type WithName = Omit<WithAttempt, 'name'>
