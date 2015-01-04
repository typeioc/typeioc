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
    Object.defineProperty(Api.prototype, "serviceValue", {
        get: function () {
            return this._service;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Api.prototype, "nameValue", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Api.prototype, "cacheValue", {
        get: function () {
            return this._cache;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Api.prototype, "dependenciesValue", {
        get: function () {
            return this._dependencies;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Api.prototype, "isDependenciesResolvable", {
        get: function () {
            return this._dependencies && this.dependencies.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Api.prototype, "tryValue", {
        get: function () {
            return this._try;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Api.prototype, "throwResolveError", {
        get: function () {
            return !this.tryValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Api.prototype, "argsValue", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
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
        return this._container.execute(this);
    };
    return Api;
})();
exports.Api = Api;
//# sourceMappingURL=containerApi.js.map