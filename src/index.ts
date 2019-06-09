/**
 * Dependency injection container for TypeScript / JavaScript
 *
 * @packageDocumentation
 */

require('reflect-metadata')
import { IEntryPoint, Scaffold } from './scaffold'

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
    RegisterWithScope } from './registration'
export { IInterceptor, ISubstituteInfo, ICallInfo, IWithSubstituteResult } from './interceptors'
export {
    Owner, OwnerType, owner,
    Scope, ScopeType, scope,
    CallInfo, CallInfoType, callInfo
} from './common'
export { IStringIndex } from './types'
export {
    IDecorator, IDecoratorRegistration, IDecoratorResolution,
    WithDecoratorRegister, WithDecoratorRegisterInitializeBy,
    WithDecoratorRegisterLazy, WithDecoratorRegisterName,
    WithDecoratorRegisterScope, WithDecoratorResolver,
    WithDecoratorResolverArgs, WithDecoratorResolverAttempt,
    WithDecoratorResolverName
} from './decorators'
export {
    ApplicationError,
    ArgumentError,
    CircularDependencyError,
    DecoratorError,
    ProxyError,
    ResolutionError
} from './exceptions'
