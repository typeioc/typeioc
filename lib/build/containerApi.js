/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () -
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Api = (function () {
    function Api(_container) {
        this._container = _container;
        this._cache = {
            use: false,
            name: undefined
        };
        this._dependencies = [];
        this._attempt = false;
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
            return this._dependencies && this._dependencies.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Api.prototype, "attemptValue", {
        get: function () {
            return this._attempt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Api.prototype, "throwResolveError", {
        get: function () {
            return !this.attemptValue;
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
        Utils.checkNullArgument(value, 'value');
        this._service = value;
        return {
            args: this.args.bind(this),
            attempt: this.attempt.bind(this),
            name: this.name.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    };
    Api.prototype.args = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._args = args;
        return {
            attempt: this.attempt.bind(this),
            name: this.name.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    };
    Api.prototype.attempt = function () {
        this._attempt = true;
        return {
            name: this.name.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    };
    Api.prototype.name = function (value) {
        this._name = value;
        return {
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    };
    Api.prototype.dependencies = function (data) {
        var item = data;
        if (Array.isArray(item)) {
            this._dependencies.push.apply(this._dependencies, item);
        }
        else {
            this._dependencies.push(item);
        }
        return {
            dependencies: this.dependencies.bind(this),
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