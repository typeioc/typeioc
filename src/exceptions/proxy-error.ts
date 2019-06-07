import { ApplicationError } from './application-error'
import { setPrototypeOf } from '../utils'

/**
 * Represents proxy error. It is thrown when an exception happens
 * during proxy - interceptor construction
 * @public
 */
export class ProxyError extends ApplicationError {

    /**
     * Constructor
     * @param params - optional additional information about the error
     * @returns - an instance of ProxyError
     */
    constructor(params?: { message?: string, data?: {} }) {
        super(params)

        setPrototypeOf(this, ProxyError.prototype)

        this.name = 'Proxy Error'
    }
}
