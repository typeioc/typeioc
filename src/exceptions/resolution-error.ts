import { ApplicationError } from './application-error'
import { setPrototypeOf } from '../utils'

/**
 * @public
 */
export class ResolutionError extends ApplicationError {

    /**
     * @internal
     */
    _innerError?: Error

    get innerError() {
        return this._innerError
    }

    constructor(params?: { message?: string, data?: {}, error?: Error }) {
        super(params)

        setPrototypeOf(this, ResolutionError.prototype)

        this.name = 'Resolution Error'
        this._innerError = params ? params.error : undefined

    }
}
