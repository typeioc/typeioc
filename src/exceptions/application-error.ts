import { setPrototypeOf } from '../utils'

/**
 * General purpose application error
 * @public
 */
export class ApplicationError extends Error {

    /**
     * @internal
     */
    _data?: {}

    get data() {
        return this._data
    }

    /**
     * Constructor
     * @param params - optional additional information
     * @returns An instance of ApplicationError
     */
    constructor(params?: { message?: string, data?: {} }) {
        super(params ? params.message : undefined)

        setPrototypeOf(this, ApplicationError.prototype)

        this.name = 'Application Error'
        this._data = params ? params.data : undefined
    }
}
