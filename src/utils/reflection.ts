
import Exceptions = require('../exceptions/index');

export function getFactoryArgsCount(factory: Typeioc.IFactory<any>) {

    var paramNames = getParamNames(<Function>factory);

    return paramNames.length > 0 ? paramNames.length - 1 : 0;
}

export function isCompatible(obj1 : Object, obj2 : Object) : boolean {

    for(var key in obj2) {

        if(!isFunction(obj2[key])) continue;

        var obj1Val = obj1[key];

        if(!obj1Val ||
            !isFunction(obj1Val)) return false;
    }

    return true;
}

export function construct(constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }

    F.prototype = constructor.prototype;
    var k : any = F;

    return new k();
}

export function isArray(value : any) : boolean {
    return Array.isArray(value);
}

export function isFunction(f : any) : boolean {
    return f instanceof Function;
}

export function isString(value : any) :boolean {
    return (typeof value) === 'string';
}

export function getPropertyType(name : string, source : Object, descriptor : PropertyDescriptor)
        : Typeioc.Internal.Reflection.PropertyType {

    if(descriptor.value && isFunction(descriptor.value )) return Typeioc.Internal.Reflection.PropertyType.Method;

    if(descriptor.get && !descriptor.set) return Typeioc.Internal.Reflection.PropertyType.Getter;

    if(!descriptor.get && descriptor.set) return Typeioc.Internal.Reflection.PropertyType.Setter;

    if(descriptor.get && descriptor.set) return Typeioc.Internal.Reflection.PropertyType.FullProperty;

    return Typeioc.Internal.Reflection.PropertyType.Field;
}

export function getPropertyDescriptor(object, key) {
    do {

        var descriptor = Object.getOwnPropertyDescriptor(object, key);
    } while(!descriptor && (object = Object.getPrototypeOf(object)));

    if (descriptor) {
        descriptor['object'] = object;
    }

    return descriptor;
}

function getParamNames(func : Function) : string[] {
    var funStr = func.toString();
    var result = funStr.slice(funStr.indexOf('(')+1, funStr.indexOf(')')).match(/([^\s,]+)/g);

    return result || [];
}