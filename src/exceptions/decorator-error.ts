import { ApplicationError } from './application-error'
import { setPrototypeOf } from '../utils'

/**
 * Represents decorator error. It is thrown when an exception happens
 * during service parts decoration (class, parameter, etc...)
 * @public
 */
export class DecoratorError extends ApplicationError {

    /**
     * Constructor
     * @param params - optional additional information about the error
     * @returns - an instance of DecoratorError
     */
    constructor(params?: { message?: string, data?: {} }) {
        super(params)

        setPrototypeOf(this, DecoratorError.prototype)

        this.name = 'Decorator Error'
    }
}
