import { callInfo } from '../common'
import { createProxy, getPropertyType, isBlackListProperty } from './common'
import { IDecorator, PropertyType, IStrategyInfo, IStorage } from './types'
import { getAllPropertyNames, getPropertyDescriptor } from '../utils'
import { IndexedCollection } from '../types'

export interface IProxy {
    byPrototype(parent: Function, storage?: IStorage): Function
    byInstance(parent: {}, storage?: IStorage): {}
}

export class Proxy implements IProxy {

    private restrictedProperties = getAllPropertyNames(Function)

    private propTypeToDescriptor = {
        [PropertyType.Method]: [callInfo.any, callInfo.method],
        [PropertyType.Getter]: [callInfo.any, callInfo.getter],
        [PropertyType.Setter]: [callInfo.any, callInfo.setter],
        [PropertyType.FullProperty]: [
            callInfo.any,
            callInfo.getter,
            callInfo.setter,
            callInfo.getterSetter
        ],
        [PropertyType.Field]: [
            callInfo.any,
            callInfo.getter,
            callInfo.setter,
            callInfo.getterSetter,
            callInfo.field
        ]
    }

    constructor(private _decorator: IDecorator) {}

    public byPrototype(parent: Function,
                       storage?: IStorage): Function {

        const source = parent.prototype
        const proxy = createProxy(this, parent, storage)

        getAllPropertyNames(source)
            .filter(name => !isBlackListProperty(name))
            .map(p => this.createStrategyInfo(source, proxy.prototype, p, '_parent'))
            .forEach(s => this.decorateProperty(s, storage))

        Object.getOwnPropertyNames(parent)
            .filter(name => this.restrictedProperties.indexOf(name) === -1)
            .map(p => this.createStrategyInfo(parent, proxy, p))
            .forEach(s => this.decorateProperty(s, storage))

        return proxy
    }

    public byInstance(parent: Object, storage? : IStorage) : Object {

        const result = Object.create({})

        getAllPropertyNames(parent)
            .filter(name => !isBlackListProperty(name))
            .map(p => this.createStrategyInfo(parent, result, p))
            .forEach(s => this.decorateProperty(s, storage))

        return result
    }

    private decorateProperty(strategyInfo: IStrategyInfo, storage? : IStorage) {

        if (storage) {
            const types = this.propTypeToDescriptor[strategyInfo.type]
            const substitute = storage.getSubstitutes(strategyInfo.name, types)

            strategyInfo.substitute = substitute || undefined
            this._decorator.wrap(strategyInfo)

            return
        }

        this._decorator.wrap(strategyInfo)
    }

    private createStrategyInfo(source: Function | Object,
                               destination: Function | Object,
                               name: string,
                               contextName?: string): IStrategyInfo {

        const descriptor = getPropertyDescriptor(source, name)
        const propertyType = getPropertyType(descriptor)

        return {
            type: propertyType,
            descriptor,
            substitute: undefined,
            name,
            source: (source as IndexedCollection<Function | {}>),
            destination: (destination as IndexedCollection<Function | {}>),
            contextName
        }
    }
}
