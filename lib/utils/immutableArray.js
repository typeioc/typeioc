/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
const index_1 = require('./index');
const exceptions_1 = require('../exceptions');
class ImmutableArray {
    constructor(data) {
        index_1.checkNullArgument(data, 'data');
        if (index_1.Reflection.isArray(data) !== true)
            throw new exceptions_1.ArgumentError('data', 'should represent an array');
        this._data = this.initialize(data);
    }
    get value() {
        return this._data.slice(0);
    }
    initialize(data) {
        return data.map(item => {
            var type = typeof (item);
            return type === 'object' ||
                type === 'function' ? Object.freeze(item) : item;
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImmutableArray;
//# sourceMappingURL=immutableArray.js.map