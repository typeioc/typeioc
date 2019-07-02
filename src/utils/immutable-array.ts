import { checkNullArgument } from './common.js'
import { isArray } from './reflection.js'
import { ArgumentError } from '../exceptions/index.js'

export interface IImmutableArray<T> {
    value: T[]
}

export class ImmutableArray<T> implements IImmutableArray<T>  {

    private _data: T[]

    public get value(): T[]  {
        return this._data.slice(0)
    }

    constructor(data: T[]) {

        checkNullArgument(data, 'data')

        if (!isArray(data)) {
            throw new ArgumentError('data', { message: 'should represent an array' })
        }

        this._data = this.initialize(data)
    }

    public static createImmutable<R>(array: R[]): ImmutableArray<R> {
        return new ImmutableArray<R>(array)
    }

    private initialize(data: T[]): T[] {

        return data.map(item => {
            const type = typeof (item)

            return type === 'object' ||
                   type === 'function' ? Object.freeze(item) : item
        })
    }
}
