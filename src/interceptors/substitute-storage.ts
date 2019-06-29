import { IndexedCollection } from '../types'
import { callInfo, CallInfoType } from '../common'
import { ISubstitute, IList, IStorage } from './types'
import { ProxyError } from '../exceptions'

export class SubstituteStorage implements IStorage {
    private _known: IndexedCollection<IList<ISubstitute>>
    private _unknown: IList<ISubstitute>

    constructor() {
        this._known = Object.create(null)
        this._unknown = { head: null, tail: null }
    }

    public add(value: ISubstitute) {
        if (value.method) {
            this.addKnownSubstitute(value as ISubstitute)
        } else {
            this.addUnknownSubstitute(value)
        }
    }

    getSubstitutes(name: string, types: CallInfoType[]): ISubstitute | null {

        const unknown = this._unknown.head ?
            this.copyList(
                this._unknown,
                (value) => !value.type || types.indexOf(value.type) >= 0)
            :
            null

        const bucket = this._known[name]

        if (!bucket) {
            return unknown ? unknown.head : null
        }

        const result = this.copyList(bucket, (value) => {
            if (!value.type || types.indexOf(value.type) >= 0) {
                return true
            }

            throw this.createIncompatibleTypeError(value.type, types)
        })

        result.tail!.next = (unknown ? unknown.head : result.tail!.next) || undefined

        return result.head
    }

    private addKnownSubstitute(value: ISubstitute) {
        const method = value.method!
        const bucket = this._known[method] || { head: null, tail: null }

        this.addToList(value, bucket)
        this._known[method] = bucket
    }

    private addUnknownSubstitute(value: ISubstitute) {
        this.addToList(value, this._unknown)
    }

    private createIncompatibleTypeError(type: CallInfoType, types: CallInfoType[]) {

        const typeMessage = types.map(item => this.callTypeToString(item)).join(', ')

        const message = [
        'Could not match proxy type and property type.',
        `Expected one of: ${typeMessage}.`,
        `Actual: ${this.callTypeToString(type)}`].join(' ')
        throw new ProxyError({ message })
    }

    private addToList(value: ISubstitute, list: IList<ISubstitute>) {
        if (!list.head) {
            list.head = value
            list.tail = value
        } else {
            list.tail!.next = value
            list.tail = value
        }
    }

    private copyList(
        list: IList<ISubstitute>,
        predicate: (value: ISubstitute) => boolean): IList<ISubstitute> {

        const result = {
            head: null,
            tail: null
        }

        let current = list.head

        while (current) {
            if (predicate(current)) {

                const substitute = {
                    method : current.method,
                    type : current.type,
                    wrapper : current.wrapper
                }

                this.addToList(substitute, result)
            }

            current = current.next || null
        }

        return result
    }

    private callTypeToString(type: CallInfoType): string {
        switch (type) {
            case callInfo.field: return 'Field'
            case callInfo.getter: return 'Getter'
            case callInfo.setter: return 'Setter'
            case callInfo.getterSetter: return 'GetterSetter'
            case callInfo.method: return 'Method'
            default:
                return 'Any'
        }
    }
}
