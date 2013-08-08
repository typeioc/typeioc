/// <reference path="../t.d.ts/enums.d.ts" />
/// <reference path="../t.d.ts/registration.d.ts" />
"use strict";




var Registration = (function () {
    function Registration(baseRegistgration) {
        this._base = baseRegistgration;
    }
    Registration.prototype.as = function (factory) {
        var self = this;
        self._base.factory = factory;

        return {
            initializeBy: self.initializeBy.bind(self),
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
            named: self.named.bind(self),
            within: self.within.bind(self),
            ownedBy: self.ownedBy.bind(self)
        };
    };
    return Registration;
})();
exports.Registration = Registration;

//# sourceMappingURL=registration.js.map
