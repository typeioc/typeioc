import { ApplicationError } from './application-error'
import { setPrototypeOf } from '../utils'

/**
 * @public
 */
export class ArgumentError extends ApplicationError {
    _argumentName: string

    get argumentName() {
        return this._argumentName
    }

    constructor (argumentName: string, params?: { message?: string, data?: {} }) {
        super(params)

        setPrototypeOf(this, ArgumentError.prototype)

        this.name = 'Argument Error'
        this._argumentName = argumentName
    }
}
