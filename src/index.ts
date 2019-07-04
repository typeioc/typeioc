/**
 * Dependency injection container for TypeScript / JavaScript
 *
 * @packageDocumentation
 */

import 'reflect-metadata'
import { Scaffold } from './scaffold/index.js'
import { IContainerBuilder } from './build'
import { IDecorator } from './decorators'
import { IInterceptor } from './interceptors'

const scaffold = new Scaffold()

/**
 * Creates an instance on {@link IContainerBuilder} interface
 * @public
 * @returns - an instance on {@link IContainerBuilder} interface
 */
export const builder: () => IContainerBuilder = () => scaffold.createBuilder()

/**
 * Creates an instance on {@link IDecorator} interface
 * @public
 * @returns - an instance on {@link IDecorator} interface
 */
export const decorator: () => IDecorator = () => scaffold.createDecorator()

/**
 * Creates an instance on {@link IInterceptor} interface
 * @public
 * @returns - an instance on {@link IInterceptor} interface
 */
export const interceptor: () => IInterceptor = () => scaffold.createInterceptor()

export {
    IContainerBuilder, IContainer,
    IResolveWith, ResolveWithArgs, ResolveWithAttempt, ResolveWithCache, ResolveWithName
} from './build'
export {
    IRegistration, IDynamicDependency, IFactory, IInitializer, IDisposer, IName,
    IRegisterWithAs, RegisterWithInitializeBy, RegisterWithLazy, RegisterWithName,
} from './registration'
export { IInterceptor, ISubstituteInfo, ICallInfo, IWithSubstituteResult } from './interceptors'
export {
    ScopeType, scope,
    CallInfoType, callInfo
} from './common/index.js'
export { ICache } from './types'
export {
    IDecorator, IDecoratorRegistration, IDecoratorResolution,
    WithDecoratorRegister, WithDecoratorRegisterInitializeBy,
    WithDecoratorRegisterLazy, WithDecoratorRegisterName,
    WithDecoratorResolver, WithDecoratorResolverArgs, WithDecoratorResolverAttempt,
    WithDecoratorResolverName
} from './decorators'
export {
    ApplicationError,
    ArgumentError,
    CircularDependencyError,
    DecoratorError,
    ProxyError,
    ResolutionError
} from './exceptions/index.js'
