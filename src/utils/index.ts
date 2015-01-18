/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2014 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.d.ts" />

'use strict';

import Exceptions = require('../exceptions/index')

export function getParamNames(func : Function) : string[] {
    var funStr = func.toString();
    var result = funStr.slice(funStr.indexOf('(')+1, funStr.indexOf(')')).match(/([^\s,]+)/g);

    return result || [];
}

export function getFactoryArgsCount(factory: Typeioc.IFactory<any>) {

    var paramNames = getParamNames(<Function>factory);

    return paramNames.length > 0 ? paramNames.length - 1 : 0;
}

export function isCompatible(obj1 : Object, obj2 : Object) : boolean {

    for(var key in obj2) {

        if(!(obj2[key] instanceof Function)) continue;

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

export function concat(array : any[], tailArray : any[]) : any[] {

    array.push.apply(array, tailArray);

    return array;
}

export function checkNullArgument(value : any, message: string) {
    if(!value) {
        var exception = new Exceptions.ArgumentNullError(message);
        exception.data = value;
        throw exception;
    }
}