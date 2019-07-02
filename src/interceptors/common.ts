import { propertyType, PropertyType, IStorage } from './types/index.js'
import { isFunction, construct, Invocable } from '../utils/index.js'

const blackListProperties = [
    '__lookupGetter__',
    '__lookupSetter__',
    '__proto__',
    '__defineGetter__',
    '__defineSetter__',
    'hasOwnProperty',
    'propertyIsEnumerable',
    'constructor'
]

export const isBlackListProperty = (property: string) => {
    return blackListProperties.indexOf(property) >= 0
}

export const getPropertyType = (descriptor?: PropertyDescriptor): PropertyType => {

    if (!descriptor) {
        return propertyType.field
    }

    if (descriptor.value && isFunction(descriptor.value)) {
        return propertyType.method
    }

    if (descriptor.get && !descriptor.set) return propertyType.getter

    if (!descriptor.get && descriptor.set) return propertyType.setter

    if (descriptor.get && descriptor.set) return propertyType.fullProperty

    return propertyType.field
}

export const createProxy = (self:any, parent: {}, storage?: IStorage) => {

    // tslint:disable-next-line: function-name
    function Proxy() {

        this._parent = construct(parent as Invocable, arguments)

        Object.getOwnPropertyNames(this._parent)
        .filter(name => !isBlackListProperty(name))
        .filter(name => !(name in this) && !(name in Proxy.prototype))
        .map(p => self.createStrategyInfo(this._parent, this, p))
        .forEach(s => self.decorateProperty(s, storage))
    }

    return Proxy
}
