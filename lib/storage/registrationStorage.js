/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('../utils/index');
var RegistrationStorage = (function () {
    function RegistrationStorage(_internalStorage) {
        this._internalStorage = _internalStorage;
    }
    RegistrationStorage.prototype.addEntry = function (registration, entry) {
        var storage = this._internalStorage.register(registration.service, this.emptyBucket);
        var argsCount = this.getArgumentsCount(registration);
        if (!registration.name) {
            storage[argsCount] = entry();
        }
        else {
            var argsStorage = storage[registration.name];
            if (!argsStorage) {
                argsStorage = this.emptyArgsBucket;
                storage[registration.name] = argsStorage;
            }
            argsStorage[argsCount] = entry();
        }
    };
    RegistrationStorage.prototype.getEntry = function (registration) {
        var storage = this._internalStorage.tryGet(registration.service);
        if (!storage)
            return undefined;
        var argsCount = this.getArgumentsCount(registration);
        if (!registration.name) {
            return storage[argsCount];
        }
        var argsStorage = storage[registration.name];
        if (!argsStorage)
            return null;
        return argsStorage[argsCount];
    };
    RegistrationStorage.prototype.getArgumentsCount = function (registration) {
        return registration.factory ? Utils.Reflection.getFactoryArgsCount(registration.factory) : registration.args.length;
    };
    RegistrationStorage.prototype.emptyBucket = function () {
        return {};
    };
    Object.defineProperty(RegistrationStorage.prototype, "emptyArgsBucket", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    return RegistrationStorage;
})();
exports.RegistrationStorage = RegistrationStorage;
//# sourceMappingURL=registrationStorage.js.map