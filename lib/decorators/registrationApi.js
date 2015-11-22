/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
///<reference path="../../d.ts/typeioc.internal.d.ts" />
'use strinct';
var Utils = require('../utils/index');
var RegistrationApi = (function () {
    function RegistrationApi(_register) {
        this._register = _register;
    }
    Object.defineProperty(RegistrationApi.prototype, "service", {
        get: function () {
            return this._service;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationApi.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationApi.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationApi.prototype, "owner", {
        get: function () {
            return this._owner;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationApi.prototype, "initializedBy", {
        get: function () {
            return this._initializedBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationApi.prototype, "disposedBy", {
        get: function () {
            return this._disposedBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationApi.prototype, "builder", {
        get: function () {
            return this._builder;
        },
        enumerable: true,
        configurable: true
    });
    RegistrationApi.prototype.provide = function (service) {
        Utils.checkNullArgument(service, 'service');
        this._service = service;
        return {
            initializeBy: this.initializeBy.bind(this),
            dispose: this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    };
    RegistrationApi.prototype.initializeBy = function (action) {
        Utils.checkNullArgument(action, 'action');
        this._initializedBy = action;
        return {
            dispose: this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this),
        };
    };
    RegistrationApi.prototype.dispose = function (action) {
        Utils.checkNullArgument(action, 'action');
        this._disposedBy = action;
        return {
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this),
        };
    };
    RegistrationApi.prototype.named = function (name) {
        Utils.checkNullArgument(name, 'name');
        this._name = name;
        return {
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this),
        };
    };
    RegistrationApi.prototype.within = function (scope) {
        Utils.checkNullArgument(scope, 'scope');
        this._scope = scope;
        return {
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this),
        };
    };
    RegistrationApi.prototype.ownedBy = function (owner) {
        Utils.checkNullArgument(owner, 'owner');
        this._owner = owner;
        return {
            register: this.register.bind(this),
        };
    };
    RegistrationApi.prototype.register = function (builder) {
        this._builder = builder;
        return this._register(this);
    };
    return RegistrationApi;
})();
exports.RegistrationApi = RegistrationApi;
//# sourceMappingURL=registrationApi.js.map