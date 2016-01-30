/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
///<reference path="../../d.ts/typeioc.internal.d.ts" />
'use strinct';
var ResolutionApi = (function () {
    function ResolutionApi(_resolve) {
        this._resolve = _resolve;
        this._args = [];
        this._cache = {
            use: false,
            name: undefined
        };
    }
    Object.defineProperty(ResolutionApi.prototype, "service", {
        get: function () {
            return this._service;
        },
        set: function (value) {
            this._service = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResolutionApi.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResolutionApi.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResolutionApi.prototype, "attempt", {
        get: function () {
            return this._attempt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResolutionApi.prototype, "cache", {
        get: function () {
            return this._cache;
        },
        enumerable: true,
        configurable: true
    });
    ResolutionApi.prototype.by = function (service) {
        this._service = service;
        return {
            args: this.argsAction.bind(this),
            attempt: this.attemptAction.bind(this),
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    };
    ResolutionApi.prototype.argsAction = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i - 0] = arguments[_i];
        }
        this._args = value;
        return {
            attempt: this.attemptAction.bind(this),
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    };
    ResolutionApi.prototype.attemptAction = function () {
        this._attempt = true;
        return {
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    };
    ResolutionApi.prototype.nameAction = function (value) {
        this._name = value;
        return {
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    };
    ResolutionApi.prototype.cacheAction = function (name) {
        this._cache = {
            use: true,
            name: name
        };
        return {
            resolve: this.resolveAction.bind(this)
        };
    };
    ResolutionApi.prototype.resolveAction = function () {
        return this._resolve(this);
    };
    return ResolutionApi;
})();
exports.ResolutionApi = ResolutionApi;
//# sourceMappingURL=resolutionApi.js.map