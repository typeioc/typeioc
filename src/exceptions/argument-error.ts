import { ApplicationError } from './application-error.js'
import { setPrototypeOf } from './common.js'

/**
 * Represents argument error. It is thrown when the argument value does not
 * comply with the method specification
 * @public
 */
export class ArgumentError extends ApplicationError {
    /**
     * @internal
     */
    _argumentName: string

    get argumentName() {
        return this._argumentName
    }

    /**
     * Constructor
     * @param argumentName - argument name
     * @param params - optional additional information about the error
     * @returns - an instance of ArgumentError
     */
    constructor (argumentName: string, params?: { message?: string, data?: {} }) {
        super(params)

        setPrototypeOf(this, ArgumentError.prototype)

        this.name = 'Argument Error'
        this._argumentName = argumentName
    }
}
