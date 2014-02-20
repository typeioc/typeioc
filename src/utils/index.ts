/// <reference path="../../d.ts/typeioc.d.ts" />

'use strict';


export function getParamNames(func : Function) : string[] {
    var funStr = func.toString();
    return funStr.slice(funStr.indexOf('(')+1, funStr.indexOf(')')).match(/([^\s,]+)/g);
}

export function paramsCount(func : Function) {
    var paramNames = getParamNames(func);

    return paramNames ? paramNames.length : 0;
}

export function hasParams(func : Function) : boolean {
    return paramsCount(func) > 0;
}

export function getFactoryArgsCount(factory: Typeioc.IFactory<any>) {

    var paramNames = getParamNames(factory);

    return paramNames ? paramNames.length - 1 : 0;
}

export function isCompatible(obj1 : Object, obj2 : Object) : boolean {

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