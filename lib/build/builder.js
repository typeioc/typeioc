/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Types = require('../types/index');
var Utils = require('../utils/index');
var ContainerBuilder = (function () {
    function ContainerBuilder(_configRegistrationService, _registrationBaseService, _instanceRegistrationService, _moduleRegistrationService, _internalContainerService, _containerService) {
        this._configRegistrationService = _configRegistrationService;
        this._registrationBaseService = _registrationBaseService;
        this._instanceRegistrationService = _instanceRegistrationService;
        this._moduleRegistrationService = _moduleRegistrationService;
        this._internalContainerService = _internalContainerService;
        this._containerService = _containerService;
        this._registrations = [];
        this._moduleRegistrations = [];
        this._defaults = Types.Defaults;
    }
    ContainerBuilder.prototype.register = function (service) {
        Utils.checkNullArgument(service, 'service');
        var regoBase = this._registrationBaseService.create(service);
        var registration = this._instanceRegistrationService.create(regoBase);
        setDefaults(regoBase, this._defaults);
        this._registrations.push(regoBase);
        return registration;
    };
    ContainerBuilder.prototype.registerModule = function (serviceModule) {
        Utils.checkNullArgument(serviceModule, 'serviceModule');
        var regoBase = this._registrationBaseService.create(serviceModule);
        var moduleRegistration = this._moduleRegistrationService.create(regoBase);
        setDefaults(regoBase, this._defaults);
        this._moduleRegistrations.push(moduleRegistration);
        return moduleRegistration.getAsModuleRegistration();
    };
    ContainerBuilder.prototype.registerConfig = function (config) {
        Utils.checkNullArgument(config, 'config');
        var configRego = this._configRegistrationService.create();
        configRego.apply(config);
        setDefaults(configRego, this._defaults);
        this._registrations.push.apply(this._registrations, configRego.registrations);
    };
    ContainerBuilder.prototype.build = function () {
        var regoes = this._registrations.slice(0);
        this._moduleRegistrations.forEach(function (item) {
            regoes.push.apply(regoes, item.registrations);
        });
        var internalContainer = this._internalContainerService.create();
        var container = this._containerService.create(internalContainer);
        internalContainer.add(regoes);
        return {
            cache: container.cache,
            resolve: container.resolve.bind(container),
            tryResolve: container.tryResolve.bind(container),
            resolveNamed: container.resolveNamed.bind(container),
            tryResolveNamed: container.tryResolveNamed.bind(container),
            resolveWithDependencies: container.resolveWithDependencies.bind(container),
            resolveWith: container.resolveWith.bind(container),
            createChild: container.createChild.bind(container),
            dispose: container.dispose.bind(container)
        };
    };
    return ContainerBuilder;
})();
exports.ContainerBuilder = ContainerBuilder;
function setDefaults(rego, defaults) {
    rego.scope = defaults.Scope;
    rego.owner = defaults.Owner;
}
//# sourceMappingURL=builder.js.map