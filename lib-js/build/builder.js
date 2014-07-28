/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var ContainerBuilder = (function () {
    function ContainerBuilder(_configRegistrationService, _registrationBaseService, _instanceRegistrationService, _moduleRegistrationService, _containerService) {
        this._configRegistrationService = _configRegistrationService;
        this._registrationBaseService = _registrationBaseService;
        this._instanceRegistrationService = _instanceRegistrationService;
        this._moduleRegistrationService = _moduleRegistrationService;
        this._containerService = _containerService;
        this.DefaultScope = 1 /* None */;
        this.DefaultOwner = 1 /* Container */;
        this.registrations = [];
        this.moduleRegistrations = [];
    }
    ContainerBuilder.prototype.register = function (service) {
        var regoBase = this._registrationBaseService.create(service);
        var registration = this._instanceRegistrationService.create(regoBase);

        regoBase.scope = this.DefaultScope;
        regoBase.owner = this.DefaultOwner;

        this.registrations.push(regoBase);

        return registration;
    };

    ContainerBuilder.prototype.registerModule = function (serviceModule) {
        var regoBase = this._registrationBaseService.create(serviceModule);
        var moduleRegistration = this._moduleRegistrationService.create(regoBase);

        regoBase.scope = this.DefaultScope;
        regoBase.owner = this.DefaultOwner;

        this.moduleRegistrations.push(moduleRegistration);

        return moduleRegistration.getAsModuleRegistration();
    };

    ContainerBuilder.prototype.registerConfig = function (config) {
        var configRego = this._configRegistrationService.create(config);
        configRego.scope = this.DefaultScope;
        configRego.owner = this.DefaultOwner;

        var regoes = configRego.registrations;

        this.registrations.push.apply(this.registrations, regoes);
    };

    ContainerBuilder.prototype.build = function () {
        var regoes = this.registrations.slice(0);

        this.moduleRegistrations.forEach(function (item) {
            regoes.push.apply(regoes, item.registrations);
        });

        var container = this._containerService.create();
        container.import(regoes);

        return {
            resolve: container.resolve.bind(container),
            tryResolve: container.tryResolve.bind(container),
            resolveNamed: container.resolveNamed.bind(container),
            tryResolveNamed: container.tryResolveNamed.bind(container),
            createChild: container.createChild.bind(container),
            dispose: container.dispose.bind(container)
        };
    };
    return ContainerBuilder;
})();
exports.ContainerBuilder = ContainerBuilder;
