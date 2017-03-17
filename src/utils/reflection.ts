/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import Internal = Typeioc.Internal;

export function getMetadata(reflect, type : any) {
    return reflect.getMetadata("design:paramtypes", type) || [];
}

export function getFactoryArgsCount(factory: Typeioc.IFactory<any>) {

    var paramNames = getParamNames(<Function>factory);

    return paramNames.length > 0 ? paramNames.length - 1 : 0;
}

export function isCompatible(obj1 : Object, obj2 : Object) : boolean {
   
    return !Object.getOwnPropertyNames(obj2)
    .filter(key => isFunction(obj2[key]))
    .some(key => {
        
        var obj1Val = obj1[key];
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
    return typeof o === 'object';
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
    do {

        var descriptor = Object.getOwnPropertyDescriptor(object, key);
    } while(!descriptor && (object = Object.getPrototypeOf(object)));

    if (descriptor) {
        descriptor['object'] = object;
    }

    return descriptor;
}

export function getAllPropertyNames(obj) {
    var props = [];

    do {
        Object.getOwnPropertyNames(obj).forEach(function ( prop ) {
            if (props.indexOf(prop) === -1) {
                props.push( prop );
            }
        });
    } while(obj = Object.getPrototypeOf(obj));

    return props;
}

function getParamNames(func : Function) : string[] {
    var regexes = [/function\s.*?\(([^)]*)\)/,
                   /\(?([\w,\s.]+)\)?\s*=>\s*\{[^}]*\}/,
                   /\(?([\w,\s.]+)\)?\s*=>\s*[^}]*/];
    
    var funcStr = func.toString().replace(/\/\*.*\*\//, '');
    var args = regexes.map(item => {
            let match = funcStr.match(item);
            return match ? match[1] : null;
        })
        .filter(item => !!item)[0];
    
    if(!args) return [];
    
    return args.split(',')
        .map(arg => arg.trim())
        .filter(arg => !!arg);
}