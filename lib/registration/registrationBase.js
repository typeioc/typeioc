/// <reference path="../t.d.ts/enums.d.ts" />
/// <reference path="../t.d.ts/container.d.ts" />
/// <reference path="../t.d.ts/registration.d.ts" />
"use strict";

var Utils = require('../utils');


var RegistrationBase = (function () {
    function RegistrationBase(service) {
        this._service = null;
        this._factory = null;
        this._name = null;
        this._initializer = null;
        this._instance = null;
        this._service = service;
        this.args = [];
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


    Object.defineProperty(RegistrationBase.prototype, "invoker", {
        get: function () {
            var self = this;
            return function () {
                self.args.splice(0, 0, self.container);
                return self.factory.apply(self.factory, self.args);
            };
        },
        enumerable: true,
        configurable: true
    });

    RegistrationBase.prototype.toNamedKey = function () {
        var argsCount = this._factory ? Utils.getFactoryArgsCount(this._factory) : this._args.length;

        return [this._name || "_", ":", argsCount.toString()].join(" ");
    };

    RegistrationBase.prototype.cloneFor = function (container) {
        var result = new RegistrationBase(this._service);
        result.factory = this._factory;
        result.container = container;
        result.owner = this._owner;
        result.scope = this._scope;
        result.initializer = this._initializer;

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

    return RegistrationBase;
})();
exports.RegistrationBase = RegistrationBase;

//# sourceMappingURL=registrationBase.js.map
