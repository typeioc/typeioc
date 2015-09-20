/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
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
//# sourceMappingURL=index.js.map