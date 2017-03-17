/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const ReflectionModule = require("./reflection");
const immutableArray_1 = require("./immutableArray");
exports.Reflection = ReflectionModule;
function concat(array, tailArray) {
    array.push.apply(array, tailArray);
    return array;
}
exports.concat = concat;
function checkNullArgument(value, argument, message) {
    if ((value != '') && !value) {
        var exception = new exceptions_1.ArgumentNullError(argument, message);
        exception.data = value;
        throw exception;
    }
}
exports.checkNullArgument = checkNullArgument;
function createImmutable(array) {
    return new immutableArray_1.default(array);
}
exports.createImmutable = createImmutable;
//# sourceMappingURL=index.js.map