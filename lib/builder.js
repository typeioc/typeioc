/// <reference path="../d.ts/typeioc.d.ts" />
'use strict';
var RegistrationModule = require('./registration');
var RegistrationBaseModule = require('./registrationBase');
var MultiRegistrationsModule = require('./moduleRegistration');
var ConfigRegistrationModule = require('./configRegistration');
var ContainerModule = require('./container');

var ContainerBuilder = (function () {
    function ContainerBuilder() {
        this.DefaultScope = 1 /* None */;
        this.DefaultOwner = 1 /* Container */;
        this.registrations = [];
        this.moduleRegistrations = [];
    }
    ContainerBuilder.prototype.register = function (service) {
        var regoBase = new RegistrationBaseModule.RegistrationBase(service);

        var registration = new RegistrationModule.Registration(regoBase);
        regoBase.scope = this.DefaultScope;
        regoBase.owner = this.DefaultOwner;

        this.registrations.push(regoBase);

        return registration;
    };

    ContainerBuilder.prototype.registerModule = function (serviceModule) {
        var regoBase = new RegistrationBaseModule.RegistrationBase(serviceModule);
        var moduleRegistration = new MultiRegistrationsModule.ModuleRegistration(regoBase);

        regoBase.scope = this.DefaultScope;
        regoBase.owner = this.DefaultOwner;

        this.moduleRegistrations.push(moduleRegistration);

        return moduleRegistration.getAsModuleRegistration();
    };

    ContainerBuilder.prototype.registerConfig = function (config) {
        var configRego = new ConfigRegistrationModule.ConfigRegistration(config);
        configRego.scope = this.DefaultScope;
        configRego.owner = this.DefaultOwner;

        var regoes = configRego.registrations;

        this.registrations.push.apply(this.registrations, regoes);
    };

    ContainerBuilder.prototype.build = function () {
        var regoes = this.registrations;
        this.registrations = [];

        this.moduleRegistrations.forEach(function (item) {
            regoes.push.apply(regoes, item.registrations);
        });

        var container = new ContainerModule.Container(regoes);

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
