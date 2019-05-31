import { ApplicationError } from './application-error'
import { setPrototypeOf } from '../utils'

/**
 * @public
 */
export class ProxyError extends ApplicationError {

    constructor(params?: { message?: string, data?: {} }) {
        super(params)

        setPrototypeOf(this, ProxyError.prototype)

        this.name = 'Proxy Error'
    }
}
