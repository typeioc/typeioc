/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.8
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Exceptions = require('../exceptions/index');
import ReflectionModule = require('./reflection');
import ImmutableArrayModule = require('./immutableArray');

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

export function createImmutable(array : Array<any>) : Typeioc.Internal.IImmutableArray {
    return new ImmutableArrayModule.ImmutableArray(array);
}

export function toPublicContainer(container : Typeioc.Internal.IContainer) : Typeioc.IContainer {
    return {
        cache : container.cache,
        resolve : container.resolve.bind(container),
        tryResolve: container.tryResolve.bind(container),
        resolveNamed : container.resolveNamed.bind(container),
        tryResolveNamed : container.tryResolveNamed.bind(container),
        resolveWithDependencies : container.resolveWithDependencies.bind(container),
        resolveWith : container.resolveWith.bind(container),
        createChild : container.createChild.bind(container),
        dispose: container.dispose.bind(container)
    };
}