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
export { IContainerBuilder, IContainer } from './build'
export { Owner, Scope, CallInfo, owner, scope, callInfo } from './common'
export { IDynamicDependency, IFactory } from './registration'
export { IInterceptor, ISubstituteInfo, ICallInfo } from './interceptors'
export { IDecorator } from './decorators'
export {
    ApplicationError,
    ArgumentError,
    CircularDependencyError,
    DecoratorError,
    ProxyError,
    ResolutionError
} from './exceptions'
