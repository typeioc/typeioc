
"use strict";

import DefinitionModule = module('definitions');

export function getParamNames(func : Function) : string[] {
    var funStr = func.toString();
    return funStr.slice(funStr.indexOf('(')+1, funStr.indexOf(')')).match(/([^\s,]+)/g);
}

export function paramsCount(func : Function) {
    var paramNames = getParamNames(func);

    return paramNames ? paramNames.length : 0;
}

export function hasParams(func : Function) : bool {
    return paramsCount(func) > 0;
}

export function getFactoryArgsCount(factory: DefinitionModule.IFactory<any>) {

    var paramNames = getParamNames(factory);

    return paramNames ? paramNames.length - 1 : 0;
}

export function isDisposable(value) : bool {

    return typeof value.dispose === 'function' ||
                  typeof value.Dispose === 'function';
}

export function getDisposeMethod(value) : Function {

    return typeof value.dispose === 'function' ? value.dispose :
        (typeof value.Dispose === 'function' ? value.Dispose : null);
}


export function isCompatible(obj1 : Object, obj2 : Object) : bool {

    for(var key in obj2) {

        var obj1Val = obj1[key];

        if(!obj1Val ||
           !(obj1Val instanceof Function)) return false;
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

