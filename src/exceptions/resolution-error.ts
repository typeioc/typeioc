import { ApplicationError } from './application-error'
import { setPrototypeOf } from '../utils'

/**
 * Represents resolution error. It is thrown when an error happens
 * during service resolution / instantiation
 * @public
 */
export class ResolutionError extends ApplicationError {

    /**
     * @internal
     */
    _innerError?: Error

    /**
     * Internal error
     */
    get innerError() {
        return this._innerError
    }

    /**
     * Constructor
     * @param params - optional additional information about the error
     * @returns - an instance of ResolutionError
     */
    constructor(params?: { message?: string, data?: {}, error?: Error }) {
        super(params)

        setPrototypeOf(this, ResolutionError.prototype)

        this.name = 'Resolution Error'
        this._innerError = params ? params.error : undefined

    }
}
