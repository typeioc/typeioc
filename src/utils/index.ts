/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.3
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import { ArgumentNullError, ApplicationError } from '../exceptions';
import * as ReflectionModule from './reflection';
import ImmutableArray from './immutableArray';

export var Reflection = ReflectionModule;

export function concat(array : any[], tailArray : any[]) : any[] {

    array.push.apply(array, tailArray);

    return array;
}

export function checkNullArgument(value : any, argument: string,  message?: string) {
    if((value != '') && !value) {
        var exception = new ArgumentNullError(argument, message);
        exception.data = value;
        throw exception;
    }
}

export function checkDependency(dependency: Typeioc.IDynamicDependency) : void {
    
    const factoryValueKey = 'factoryValue';

    if((dependency.factory && dependency.factoryType) ||
        (dependency.factory && factoryValueKey in dependency) ||
        (dependency.factoryType && factoryValueKey in dependency)) {
            throw new ApplicationError('Unknown registration type');
        }
}

export function createImmutable(array : Array<any>) : Typeioc.Internal.IImmutableArray {
    return new ImmutableArray(array);
}

export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }