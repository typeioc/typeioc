import { ApplicationError } from './application-error'
import { setPrototypeOf } from '../utils'

/**
 * Represents circular dependency error. It is thrown when two or more service
 * resolutions depend on each other directly on indirectly
 * @public
 */
export class CircularDependencyError extends ApplicationError {

    /**
     * @internal
     */
    _serviceName: string

    /**
     * The name of the service that circularly resolves itself
     */
    get serviceName(): string {
        return this._serviceName
    }

    /**
     * Constructor
     * @param serviceName - service name
     * @param data - optional additional information about the error
     * @returns - an instance of CircularDependencyError
     */
    constructor (serviceName: string , data?: {}) {
        super({ message: `Circular dependency for service: ${serviceName}`, data })

        setPrototypeOf(this, CircularDependencyError.prototype)

        this.name = 'Circular Dependency Error'
        this._serviceName = serviceName
    }
}
