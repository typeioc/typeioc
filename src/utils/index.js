/// <reference path="../../d.ts/typeioc.d.ts" />
'use strict';
function getParamNames(func) {
    var funStr = func.toString();
    var result = funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);

    return result || [];
}
exports.getParamNames = getParamNames;

function paramsCount(func) {
    var paramNames = exports.getParamNames(func);

    return paramNames.length;
}
exports.paramsCount = paramsCount;

function hasParams(func) {
    return exports.paramsCount(func) > 0;
}
exports.hasParams = hasParams;

function getFactoryArgsCount(factory) {
    var paramNames = exports.getParamNames(factory);

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
//# sourceMappingURL=index.js.map
