/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.2
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

import Internal = Typeioc.Internal;

export function getMetadata(reflect, type : any) {
    return reflect.getMetadata("design:paramtypes", type) || [];
}

export function getFactoryArgsCount(factory: Typeioc.IFactory<any>): number {

    const paramsCount = (<Function>factory).length;
    return Math.max(paramsCount - 1, 0);
}

export function isCompatible(obj1 : Object, obj2 : Object) : boolean {
   
    return !Object.getOwnPropertyNames(obj2)
    .filter(key => isFunction(obj2[key]))
    .some(key => {
        const obj1Val = obj1[key];
        return !obj1Val || !isFunction(obj1Val);
    });
}

export function construct(constructor, args) {
    return args && args.length ? new constructor(...args) : new constructor();
}

export function isArray(value : any) : boolean {
    return Array.isArray(value);
}

export function isFunction(f : any) : boolean {
    return f instanceof Function;
}

export function isPrototype(f : any) : boolean {
    return isFunction(f) && f.prototype;
}

export function isObject(o : any) : boolean {
    return o === Object(o);
}

export function getPropertyType(name : string, descriptor : PropertyDescriptor)
        : Internal.Reflection.PropertyType {

    if(descriptor.value && isFunction(descriptor.value )) return Internal.Reflection.PropertyType.Method;

    if(descriptor.get && !descriptor.set) return Internal.Reflection.PropertyType.Getter;

    if(!descriptor.get && descriptor.set) return Internal.Reflection.PropertyType.Setter;

    if(descriptor.get && descriptor.set) return Internal.Reflection.PropertyType.FullProperty;

    return Internal.Reflection.PropertyType.Field;
}

export function getPropertyDescriptor(object, key) {
    let descriptor;
    
    do {
        descriptor = Object.getOwnPropertyDescriptor(object, key);
    } while(!descriptor && (object = Object.getPrototypeOf(object)));

    if (descriptor) {
        descriptor['object'] = object;
    }

    return descriptor;
}

export function getAllPropertyNames(obj) {
    const props = [];

    do {
        Object.getOwnPropertyNames(obj).forEach(function ( prop ) {
            if (props.indexOf(prop) === -1) {
                props.push( prop );
            }
        });
    } while(obj = Object.getPrototypeOf(obj));

    return props;
}