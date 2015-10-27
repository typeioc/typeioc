/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () -
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Exceptions = require('../exceptions/index');
var ReflectionModule = require('./reflection');
var ImmutableArrayModule = require('./immutableArray');
exports.Reflection = ReflectionModule;
function concat(array, tailArray) {
    array.push.apply(array, tailArray);
    return array;
}
exports.concat = concat;
function checkNullArgument(value, argument, message) {
    if (!value) {
        var exception = new Exceptions.ArgumentNullError(argument, message);
        exception.data = value;
        throw exception;
    }
}
exports.checkNullArgument = checkNullArgument;
function createImmutable(array) {
    return new ImmutableArrayModule.ImmutableArray(array);
}
exports.createImmutable = createImmutable;
function toPublicContainer(container) {
    return {
        cache: container.cache,
        resolve: container.resolve.bind(container),
        tryResolve: container.tryResolve.bind(container),
        resolveNamed: container.resolveNamed.bind(container),
        tryResolveNamed: container.tryResolveNamed.bind(container),
        resolveWithDependencies: container.resolveWithDependencies.bind(container),
        resolveWith: container.resolveWith.bind(container),
        createChild: container.createChild.bind(container),
        dispose: container.dispose.bind(container)
    };
}
exports.toPublicContainer = toPublicContainer;
//# sourceMappingURL=index.js.map