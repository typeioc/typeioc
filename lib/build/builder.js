/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const utils_1 = require("../utils");
class ContainerBuilder {
    constructor(_registrationBaseService, _instanceRegistrationService, _moduleRegistrationService, _internalContainerService, _containerService) {
        this._registrationBaseService = _registrationBaseService;
        this._instanceRegistrationService = _instanceRegistrationService;
        this._moduleRegistrationService = _moduleRegistrationService;
        this._internalContainerService = _internalContainerService;
        this._containerService = _containerService;
        this._registrations = [];
        this._moduleRegistrations = [];
    }
    register(service) {
        utils_1.checkNullArgument(service, 'service');
        var regoBase = this._registrationBaseService.create(service);
        var registration = this._instanceRegistrationService.create(regoBase);
        setDefaults(regoBase);
        this._registrations.push(regoBase);
        return registration;
    }
    registerModule(serviceModule) {
        utils_1.checkNullArgument(serviceModule, 'serviceModule');
        var regoBase = this._registrationBaseService.create(serviceModule);
        var moduleRegistration = this._moduleRegistrationService.create(regoBase);
        setDefaults(regoBase);
        this._moduleRegistrations.push(moduleRegistration);
        return moduleRegistration.getAsModuleRegistration();
    }
    build() {
        var regoes = this._registrations.slice(0);
        this._moduleRegistrations.forEach(item => {
            regoes.push.apply(regoes, item.registrations);
        });
        var internalContainer = this._internalContainerService.create();
        var container = this._containerService.create(internalContainer);
        internalContainer.add(regoes);
        return {
            cache: container.cache,
            resolve: container.resolve.bind(container),
            resolveAsync: container.resolveAsync.bind(container),
            tryResolve: container.tryResolve.bind(container),
            tryResolveAsync: container.tryResolveAsync.bind(container),
            resolveNamed: container.resolveNamed.bind(container),
            resolveNamedAsync: container.resolveNamedAsync.bind(container),
            tryResolveNamed: container.tryResolveNamed.bind(container),
            tryResolveNamedAsync: container.tryResolveNamedAsync.bind(container),
            resolveWithDependencies: container.resolveWithDependencies.bind(container),
            resolveWithDependenciesAsync: container.resolveWithDependenciesAsync.bind(container),
            resolveWith: container.resolveWith.bind(container),
            createChild: container.createChild.bind(container),
            dispose: container.dispose.bind(container),
            disposeAsync: container.disposeAsync.bind(container)
        };
    }
}
exports.ContainerBuilder = ContainerBuilder;
function setDefaults(rego) {
    rego.scope = types_1.Defaults.Scope;
    rego.owner = types_1.Defaults.Owner;
}
//# sourceMappingURL=builder.js.map