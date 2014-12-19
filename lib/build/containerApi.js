/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2014 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Api = (function () {
    function Api(_container) {
        this._container = _container;
        this._cache = {
            use: false,
            name: undefined
        };
        this._dependencies = [];
        this._try = false;
        this._args = [];
    }
    Api.prototype.service = function (value) {
        this._service = value;
        return {
            name: this.name.bind(this),
            args: this.args.bind(this),
            try: this.try.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    };
    Api.prototype.name = function (value) {
        this._name = value;
        return {
            args: this.args.bind(this),
            try: this.try.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    };
    Api.prototype.args = function (data) {
        this._args = data;
        return {
            try: this.try.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    };
    Api.prototype.try = function () {
        this._try = true;
        return {
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    };
    Api.prototype.dependencies = function (data) {
        this._dependencies = data;
        return {
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    };
    Api.prototype.cache = function (name) {
        this._cache.use = true;
        this._cache.name = name;
        return {
            exec: this.exec.bind(this)
        };
    };
    Api.prototype.exec = function () {
        return this._container.import(this);
    };
    return Api;
})();
exports.Api = Api;
//# sourceMappingURL=containerApi.js.map