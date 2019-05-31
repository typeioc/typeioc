import { ApplicationError } from './application-error'
import { setPrototypeOf } from '../utils'

/**
 * @public
 */
export class DecoratorError extends ApplicationError {

    constructor(params?: { message?: string, data?: {} }) {
        super(params)

        setPrototypeOf(this, DecoratorError.prototype)

        this.name = 'Decorator Error'
    }
}
