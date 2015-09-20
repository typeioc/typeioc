/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
///<reference path="../../d.ts/typeioc.d.ts" />
///<reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Exceptions = require('../exceptions/index');
var Types = require('../types/index');
var Decorator = (function () {
    function Decorator(_registrationBaseService, _instanceRegistrationService, _container) {
        this._registrationBaseService = _registrationBaseService;
        this._instanceRegistrationService = _instanceRegistrationService;
        this._container = _container;
    }
    Object.defineProperty(Decorator.prototype, "container", {
        get: function () {
            return Utils.toPublicContainer(this._container);
        },
        enumerable: true,
        configurable: true
    });
    Decorator.prototype.register = function (service, options, builder) {
        var _this = this;
        return function (target) {
            if (!Utils.Reflection.isPrototype(target)) {
                var error = new Exceptions.DecoratorError("Decorator target not supported");
                error.data = { target: target };
                throw error;
            }
            var factory = function () { return target; };
            if (builder) {
                var registration = builder.register(service);
                registration.as(factory);
                _this.addRegistrationOptions(registration, options);
            }
            else {
                var regoBase = _this._registrationBaseService.create(service);
                var registration = _this._instanceRegistrationService.create(regoBase);
                registration.as(factory);
                regoBase.scope = options && options.within ? options.within : Types.Defaults.scope;
                regoBase.owner = Types.Owner.Externals;
                _this.addRegistrationOptions(registration, options);
                _this._container.add([regoBase]);
            }
            return target;
        };
    };
    Decorator.prototype.addRegistrationOptions = function (registration, options) {
        if (!options)
            return;
        Object.keys(options).forEach(function (item) {
            var option = options[item];
            //console.log(registration[item]);
            registration[item](options[item]);
        });
    };
    Decorator.prototype.resolve = function (service, container) {
        container = container || this._container;
        return function (target) {
            var result = container.resolve(target);
            var args = []; // TODO: options && options.args ? options.args : [];
            return Utils.Reflection.createPrototype(target, args);
        };
    };
    return Decorator;
})();
exports.Decorator = Decorator;
//# sourceMappingURL=decorator.js.map