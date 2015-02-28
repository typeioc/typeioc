/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.d.ts" />

'use strict';

import Exceptions = require('../exceptions/index');
import ReflectionModule = require('./reflection');

export var Reflection = ReflectionModule;

export function concat(array : any[], tailArray : any[]) : any[] {

    array.push.apply(array, tailArray);

    return array;
}

export function checkNullArgument(value : any, argument: string,  message?: string) {
    if(!value) {
        var exception = new Exceptions.ArgumentNullError(argument, message);
        exception.data = value;
        throw exception;
    }
}