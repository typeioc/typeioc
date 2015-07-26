/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Types = require('../types/index');
var Utils = require('../utils/index');
var ContainerBuilder = (function () {
    function ContainerBuilder(_configRegistrationService, _registrationBaseService, _instanceRegistrationService, _moduleRegistrationService, _containerService) {
        this._configRegistrationService = _configRegistrationService;
        this._registrationBaseService = _registrationBaseService;
        this._instanceRegistrationService = _instanceRegistrationService;
        this._moduleRegistrationService = _moduleRegistrationService;
        this._containerService = _containerService;
        this.registrations = [];
        this.moduleRegistrations = [];
        this._defaults = Types.Defaults;
    }
    ContainerBuilder.prototype.register = function (service) {
        var regoBase = this._registrationBaseService.create(service);
        var registration = this._instanceRegistrationService.create(regoBase);
        regoBase.scope = this._defaults.scope;
        regoBase.owner = this._defaults.owner;
        this.registrations.push(regoBase);
        return registration;
    };
    ContainerBuilder.prototype.registerModule = function (serviceModule) {
        var regoBase = this._registrationBaseService.create(serviceModule);
        var moduleRegistration = this._moduleRegistrationService.create(regoBase);
        regoBase.scope = this._defaults.scope;
        regoBase.owner = this._defaults.owner;
        this.moduleRegistrations.push(moduleRegistration);
        return moduleRegistration.getAsModuleRegistration();
    };
    ContainerBuilder.prototype.registerConfig = function (config) {
        var configRego = this._configRegistrationService.create();
        configRego.apply(config);
        configRego.scope = this._defaults.scope;
        configRego.owner = this._defaults.owner;
        this.registrations.push.apply(this.registrations, configRego.registrations);
    };
    ContainerBuilder.prototype.build = function () {
        var regoes = this.registrations.slice(0);
        this.moduleRegistrations.forEach(function (item) {
            regoes.push.apply(regoes, item.registrations);
        });
        var container = this._containerService.create();
        container.add(regoes);
        return Utils.toPublicContainer(container);
    };
    return ContainerBuilder;
})();
exports.ContainerBuilder = ContainerBuilder;
//# sourceMappingURL=builder.js.map