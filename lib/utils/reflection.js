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
        if (!obj1Val || !isFunction(obj1Val))
            return false;
    }
    return true;
}
exports.isCompatible = isCompatible;
function construct(constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    var k = F;
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
function isString(value) {
    return (typeof value) === 'string';
}
exports.isString = isString;
function getPropertyType(name, source, descriptor) {
    var value = source[name];
    if (value && isFunction(value))
        return 1 /* Method */;
    if (!value) {
        var descriptor = descriptor || Object.getOwnPropertyDescriptor(source, name);
        if (descriptor) {
            if (descriptor.writable === true)
                return 5 /* Field */;
            if (descriptor.get && !descriptor.set)
                return 2 /* Getter */;
            if (!descriptor.get && descriptor.set)
                return 3 /* Setter */;
            if (descriptor.get && descriptor.set)
                return 4 /* FullProperty */;
        }
    }
    return 5 /* Field */;
}
exports.getPropertyType = getPropertyType;
function getParamNames(func) {
    var funStr = func.toString();
    var result = funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
    return result || [];
}
//# sourceMappingURL=reflection.js.map