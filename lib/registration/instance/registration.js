/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Registration = (function () {
    function Registration(_base) {
        this._base = _base;
    }
    Registration.prototype.as = function (factory) {
        this._base.factory = factory;
        return {
            initializeBy: this.initializeBy.bind(this),
            dispose: this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this)
        };
    };
    Registration.prototype.asType = function (type) {
        this._base.factory = function () { return type; };
        this._base.forInstantiation = true;
        return {
            initializeBy: this.initializeBy.bind(this),
            dispose: this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this)
        };
    };
    Registration.prototype.named = function (value) {
        this._base.name = value;
        return {
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this)
        };
    };
    Registration.prototype.within = function (scope) {
        this._base.scope = scope;
        return {
            ownedBy: this.ownedBy.bind(this)
        };
    };
    Registration.prototype.ownedBy = function (owner) {
        this._base.owner = owner;
    };
    Registration.prototype.initializeBy = function (action) {
        this._base.initializer = action;
        return {
            dispose: this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this)
        };
    };
    Registration.prototype.dispose = function (action) {
        this._base.disposer = action;
        return {
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this)
        };
    };
    return Registration;
})();
exports.Registration = Registration;
//# sourceMappingURL=registration.js.map