/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
function getMetadata(reflect, type) {
    return reflect.getMetadata("design:paramtypes", type) || [];
}
exports.getMetadata = getMetadata;
function getFactoryArgsCount(factory) {
    var paramNames = getParamNames(factory);
    return paramNames.length > 0 ? paramNames.length - 1 : 0;
}
exports.getFactoryArgsCount = getFactoryArgsCount;
function isCompatible(obj1, obj2) {
    for (var key in obj2) {
        if (!isFunction(obj2[key]))
            continue;
        var obj1Val = obj1[key];
        if (!obj1Val ||
            !isFunction(obj1Val))
            return false;
    }
    return true;
}
exports.isCompatible = isCompatible;
function createPrototype(constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return F;
}
exports.createPrototype = createPrototype;
function construct(constructor, args) {
    var k = createPrototype(constructor, args);
    return new k();
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
    return typeof o === 'object';
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
    do {
        var descriptor = Object.getOwnPropertyDescriptor(object, key);
    } while (!descriptor && (object = Object.getPrototypeOf(object)));
    if (descriptor) {
        descriptor['object'] = object;
    }
    return descriptor;
}
exports.getPropertyDescriptor = getPropertyDescriptor;
function getAllPropertyNames(obj) {
    var props = [];
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
    var funStr = func.toString();
    var result = funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
    return result || [];
}
exports.getParamNames = getParamNames;
//# sourceMappingURL=reflection.js.map