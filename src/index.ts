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
export { IContainerBuilder, IContainer, IResolveWith } from './build'
export {
    IRegistration, IDynamicDependency, IFactory, IInitializer, IDisposer, IName,
    RegisterWithAs, RegisterWithInitializeBy, RegisterWithLazy, RegisterWithName,
    RegisterWithScope  } from './registration'
export { IInterceptor, ISubstituteInfo, ICallInfo, IWithSubstituteResult } from './interceptors'
export { Owner, OwnerType, Scope, ScopeType, owner, scope, CallInfo, callInfo } from './common'
export { IStringIndex } from './types'
export {
    IDecorator, IDecoratorRegistration,
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
