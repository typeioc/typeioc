/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () -
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('./index');
var Exceptions = require('../exceptions/index');
var ImmutableArray = (function () {
    function ImmutableArray(data) {
        Utils.checkNullArgument(data, 'data');
        if (Utils.Reflection.isArray(data) !== true)
            throw new Exceptions.ArgumentError('data', 'should represent an array');
        this._data = this.initialize(data);
    }
    Object.defineProperty(ImmutableArray.prototype, "value", {
        get: function () {
            return this._data.slice(0);
        },
        enumerable: true,
        configurable: true
    });
    ImmutableArray.prototype.initialize = function (data) {
        return data.map(function (item) {
            var type = typeof (item);
            return type === 'object' ||
                type === 'function' ? Object.freeze(item) : item;
        });
    };
    return ImmutableArray;
})();
exports.ImmutableArray = ImmutableArray;
//# sourceMappingURL=immutableArray.js.map