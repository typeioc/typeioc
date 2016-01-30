/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../../d.ts/typeioc.internal.d.ts" />
'use strict';
var RegistrationBase = (function () {
    function RegistrationBase(_service) {
        this._service = _service;
        this._factory = null;
        this._name = null;
        this._initializer = null;
        this._disposer = null;
        this._instance = null;
        this._factoryType = null;
        this.args = [];
        this.params = [];
    }
    Object.defineProperty(RegistrationBase.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "service", {
        get: function () {
            return this._service;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        set: function (value) {
            this._scope = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "owner", {
        get: function () {
            return this._owner;
        },
        set: function (value) {
            this._owner = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "initializer", {
        get: function () {
            return this._initializer;
        },
        set: function (value) {
            this._initializer = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "disposer", {
        get: function () {
            return this._disposer;
        },
        set: function (value) {
            this._disposer = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "args", {
        get: function () {
            return this._args;
        },
        set: function (value) {
            this._args = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "params", {
        get: function () {
            return this._params;
        },
        set: function (value) {
            this._params = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "container", {
        get: function () {
            return this._container;
        },
        set: function (value) {
            this._container = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "instance", {
        get: function () {
            return this._instance;
        },
        set: function (value) {
            this._instance = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "factoryType", {
        get: function () {
            return this._factoryType;
        },
        set: function (value) {
            this._factoryType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationBase.prototype, "forInstantiation", {
        get: function () {
            return this._factoryType && !this._factory;
        },
        enumerable: true,
        configurable: true
    });
    RegistrationBase.prototype.cloneFor = function (container) {
        var result = new RegistrationBase(this._service);
        result.factory = this._factory;
        result.container = container;
        result.owner = this._owner;
        result.scope = this._scope;
        result.initializer = this._initializer;
        result.factoryType = this._factoryType;
        result.params = this._params;
        return result;
    };
    Object.defineProperty(RegistrationBase.prototype, "factory", {
        get: function () {
            return this._factory;
        },
        set: function (value) {
            this._factory = value;
        },
        enumerable: true,
        configurable: true
    });
    RegistrationBase.prototype.invoke = function () {
        if (this._factoryType) {
            return this._factoryType;
        }
        var args = [this.container].concat(this.args.slice(0));
        return this.factory.apply(this.factory, args);
    };
    return RegistrationBase;
})();
exports.RegistrationBase = RegistrationBase;
//# sourceMappingURL=registrationBase.js.map