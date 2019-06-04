import { ApplicationError } from './application-error'
import { setPrototypeOf } from '../utils'

/**
 * @public
 */
export class CircularDependencyError extends ApplicationError {

    /**
     * @internal
     */
    _serviceName: string

    get serviceName(): string {
        return this._serviceName
    }

    constructor (serviceName: string , data?: {}) {
        super({ message: `Circular dependency for service: ${serviceName}`, data })

        setPrototypeOf(this, CircularDependencyError.prototype)

        this.name = 'Circular Dependency Error'
        this._serviceName = serviceName
    }
}
