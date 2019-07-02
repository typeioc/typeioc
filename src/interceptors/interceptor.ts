import { callInfo } from '../common/index.js'
import {
    ISubstituteInfo, ISubstitute, IWithSubstituteResult, IInterceptor, IStorage
} from './types'
import { IProxy } from './proxy'
import { SubstituteStorage } from './substitute-storage.js'
import { checkNullArgument, isPrototype, isObject, isArray } from '../utils/index.js'
import { ArgumentError } from '../exceptions/index.js'

export class Interceptor implements IInterceptor {

    constructor(private _proxy: IProxy) { }

    public interceptPrototype<R extends Function>(
        subject: R, substitutes?: ISubstituteInfo | ISubstituteInfo[]): R {

        this.assertPrototype(subject)

        const storage = this.convertParams(subject, substitutes)
        return this._proxy.byPrototype(subject, storage) as R
    }

    public interceptInstance<R extends Object>(
        subject: R, substitutes?: ISubstituteInfo | ISubstituteInfo[]): R {

        this.assertObject(subject)

        const storage = this.convertParams(subject, substitutes)
        return this._proxy.byInstance(subject, storage) as R
    }

    public intercept<R extends (Function | Object)>(
        subject: R, substitutes?: ISubstituteInfo | ISubstituteInfo): R {
        const storage = this.convertParams(subject, substitutes)
        return this.convertToIntercept(subject, storage)
    }

    public withSubstitute(substitute: ISubstituteInfo): IWithSubstituteResult {
        const storage = new SubstituteStorage()

        const interceptInstance = <R>(subject: {}): R => {
            this.assertObject(subject)

            return this._proxy.byInstance(subject, storage) as R
        }

        const interceptPrototype = <R extends Function>(subject: Function): R => {
            this.assertPrototype(subject)

            return this._proxy.byPrototype(subject, storage) as R
        }

        const intercept = <R extends (Function | Object)>(subject: {}): R => {
            return this.convertToIntercept(subject, storage)
        }

        return this.with(
            interceptInstance,
            interceptPrototype,
            intercept,
            storage,
            substitute)
    }

    private with(
        interceptInstance: <R extends Object>(subject: R) => R,
        interceptPrototype: <R extends Function>(subject: R) => R,
        intercept: <R extends (Function | Object)>(subject: R) => R,
        storage: IStorage,
        substitute: ISubstituteInfo): IWithSubstituteResult {

        storage.add(this.createSubstitute(substitute))

        return {
            withSubstitute: this.with.bind(
                this, interceptInstance, interceptPrototype, intercept, storage),
            interceptInstance,
            interceptPrototype,
            intercept
        }
    }

    private convertParams<R extends (Function | Object)>(
        subject: R,
        substitutes? : ISubstituteInfo | ISubstituteInfo[]): IStorage | undefined {

        checkNullArgument(subject, 'subject')

        if (!substitutes) {
            return undefined
        }

        const data = isArray(substitutes) ?
            (substitutes as ISubstituteInfo[]) :
            [substitutes as ISubstituteInfo]

        return this.transformSubstitutes(data)
    }

    private convertToIntercept<R>(subject: {}, storage?: IStorage): R {
        let result: {}

        if (isPrototype(subject)) {
            result = this._proxy.byPrototype(subject as Function, storage)
        } else if (isObject(subject)) {
            result = this._proxy.byInstance(subject, storage)
        } else {
            throw new ArgumentError('subject', {
                message: 'Subject should be a prototype function or an object'
            })
        }

        return result as R
    }

    private transformSubstitutes(substitutes: ISubstituteInfo[]): IStorage {

        const storage = new SubstituteStorage()

        return substitutes.reduce((storage, current) => {
            const substitute = this.createSubstitute(current)
            storage.add(substitute)
            return storage
        },
        storage)
    }

    private createSubstitute(value : ISubstituteInfo): ISubstitute {

        if (!value.wrapper) {
            throw new ArgumentError('wrapper', {
                message: 'Missing interceptor wrapper', data: value
            })
        }

        return {
            method : value.method,
            type: value.type || callInfo.any,
            wrapper : value.wrapper,
            next: undefined
        }
    }

    private assertPrototype<R>(subject: R) {
        if (!isPrototype(subject)) {
            throw new ArgumentError('subject', {
                message: 'Subject should be a prototype function'
            })
        }
    }

    private assertObject<R>(subject: R) {
        if (isPrototype(subject)) {
            throw new ArgumentError('subject', { message: 'Subject should be an object' })
        }
    }
}
