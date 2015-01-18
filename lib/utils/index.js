/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.d.ts" />
'use strict';
var Exceptions = require('../exceptions/index');
function getParamNames(func) {
    var funStr = func.toString();
    var result = funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
    return result || [];
}
exports.getParamNames = getParamNames;
function getFactoryArgsCount(factory) {
    var paramNames = getParamNames(factory);
    return paramNames.length > 0 ? paramNames.length - 1 : 0;
}
exports.getFactoryArgsCount = getFactoryArgsCount;
function isCompatible(obj1, obj2) {
    for (var key in obj2) {
        if (!(obj2[key] instanceof Function))
            continue;
        var obj1Val = obj1[key];
        if (!obj1Val || !(obj1Val instanceof Function))
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
function concat(array, tailArray) {
    array.push.apply(array, tailArray);
    return array;
}
exports.concat = concat;
function checkNullArgument(value, message) {
    if (!value) {
        var exception = new Exceptions.ArgumentNullError(message);
        exception.data = value;
        throw exception;
    }
}
exports.checkNullArgument = checkNullArgument;
//# sourceMappingURL=index.js.map