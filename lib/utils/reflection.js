"use strict";
/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
function getMetadata(reflect, type) {
    return reflect.getMetadata("design:paramtypes", type) || [];
}
exports.getMetadata = getMetadata;
function getFactoryArgsCount(factory) {
    const paramNames = getParamNames(factory);
    return paramNames.length > 0 ? paramNames.length - 1 : 0;
}
exports.getFactoryArgsCount = getFactoryArgsCount;
function isCompatible(obj1, obj2) {
    return !Object.getOwnPropertyNames(obj2)
        .filter(key => isFunction(obj2[key]))
        .some(key => {
        const obj1Val = obj1[key];
        return !obj1Val || !isFunction(obj1Val);
    });
}
exports.isCompatible = isCompatible;
function construct(constructor, args) {
    return args && args.length ? new constructor(...args) : new constructor();
}
exports.construct = construct;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function isFunction(f) {
    return f instanceof Function;
}
exports.isFunction = isFunction;
function isPrototype(f) {
    return isFunction(f) && f.prototype;
}
exports.isPrototype = isPrototype;
function isObject(o) {
    return o === Object(o);
}
exports.isObject = isObject;
function getPropertyType(name, descriptor) {
    if (descriptor.value && isFunction(descriptor.value))
        return 1 /* Method */;
    if (descriptor.get && !descriptor.set)
        return 2 /* Getter */;
    if (!descriptor.get && descriptor.set)
        return 3 /* Setter */;
    if (descriptor.get && descriptor.set)
        return 4 /* FullProperty */;
    return 5 /* Field */;
}
exports.getPropertyType = getPropertyType;
function getPropertyDescriptor(object, key) {
    let descriptor;
    do {
        descriptor = Object.getOwnPropertyDescriptor(object, key);
    } while (!descriptor && (object = Object.getPrototypeOf(object)));
    if (descriptor) {
        descriptor['object'] = object;
    }
    return descriptor;
}
exports.getPropertyDescriptor = getPropertyDescriptor;
function getAllPropertyNames(obj) {
    const props = [];
    do {
        Object.getOwnPropertyNames(obj).forEach(function (prop) {
            if (props.indexOf(prop) === -1) {
                props.push(prop);
            }
        });
    } while (obj = Object.getPrototypeOf(obj));
    return props;
}
exports.getAllPropertyNames = getAllPropertyNames;
function getParamNames(func) {
    const regexes = [/function\s.*?\(([^)]*)\)/,
        /\(?([\w,\s.]+)\)?\s*=>\s*\{[^}]*\}/,
        /\(?([\w,\s.]+)\)?\s*=>\s*[^}]*/];
    const funcStr = func.toString().replace(/\/\*.*\*\//, '');
    const args = regexes.map(item => {
        const match = funcStr.match(item);
        return match ? match[1] : null;
    })
        .filter(item => !!item)[0];
    if (!args)
        return [];
    return args.split(',')
        .map(arg => arg.trim())
        .filter(arg => !!arg);
}
//# sourceMappingURL=reflection.js.map