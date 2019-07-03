/**
 * Dependency injection container for TypeScript / JavaScript
 *
 * @packageDocumentation
 */

import 'reflect-metadata'
import { IEntryPoint, Scaffold } from './scaffold/index.js'

const scaffold = new Scaffold()

/**
 * Library main entry point, exposed as default
 * @public
 */
export default <IEntryPoint>{
    createBuilder() {
        return scaffold.createBuilder()
    },

    createDecorator() {
        return scaffold.createDecorator()
    },

    createInterceptor() {
        return scaffold.createInterceptor()
    }
}

export { IEntryPoint } from './scaffold'
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
