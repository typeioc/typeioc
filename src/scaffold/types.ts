import { IContainerBuilder } from '../build'
import { IDecorator } from '../decorators'
import { IInterceptor } from '../interceptors'

/**
 * Represents functionality exposed be the library
 * @public
 */
export interface IEntryPoint {
    /**
     * Creates an instance of IContainerBuilder interface
     * @returns An instance of IContainerBuilder
     */
    createBuilder(): IContainerBuilder,

    /**
     * Creates an instance of IDecorator interface
     * @returns An instance of IDecorator
     */
    createDecorator(): IDecorator

    /**
     * Creates an instance of IInterceptor interface
     * @returns An instance of IInterceptor
     */
    createInterceptor(): IInterceptor
}
