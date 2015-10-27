/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () -
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Registration = (function () {
    function Registration(_base) {
        this._base = _base;
    }
    Registration.prototype.as = function (factory) {
        var self = this;
        self._base.factory = factory;
        return {
            initializeBy: self.initializeBy.bind(self),
            dispose: self.dispose.bind(self),
            named: self.named.bind(self),
            within: self.within.bind(self),
            ownedBy: self.ownedBy.bind(self)
        };
    };
    Registration.prototype.named = function (value) {
        var self = this;
        self._base.name = value;
        return {
            within: self.within.bind(self),
            ownedBy: self.ownedBy.bind(self)
        };
    };
    Registration.prototype.within = function (scope) {
        var self = this;
        self._base.scope = scope;
        return {
            ownedBy: self.ownedBy.bind(self)
        };
    };
    Registration.prototype.ownedBy = function (owner) {
        this._base.owner = owner;
    };
    Registration.prototype.initializeBy = function (action) {
        var self = this;
        self._base.initializer = action;
        return {
            dispose: self.dispose.bind(self),
            named: self.named.bind(self),
            within: self.within.bind(self),
            ownedBy: self.ownedBy.bind(self)
        };
    };
    Registration.prototype.dispose = function (action) {
        var self = this;
        self._base.disposer = action;
        return {
            named: self.named.bind(self),
            within: self.within.bind(self),
            ownedBy: self.ownedBy.bind(self)
        };
    };
    return Registration;
})();
exports.Registration = Registration;
//# sourceMappingURL=registration.js.map