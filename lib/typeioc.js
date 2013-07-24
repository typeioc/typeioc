"use strict";


var RegoDefinitionsModule = require("./registration/definitions");


var RegistrationModule = require("./registration/registration");
var RegistrationBaseModule = require("./registration/registrationBase");
var MultiRegistrationsModule = require("./registration/moduleRegistration");
var ConfigRegistrationModule = require("./registration/configRegistration");
var ContainerModule = require("./container/container");
var DefaultsModule = require("./configuration/defaults");

var ContainerBuilder = (function () {
    function ContainerBuilder() {
        this.DefaultScope = DefaultsModule.Defaults.Scope;
        this.DefaultOwner = DefaultsModule.Defaults.Owner;
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

var Constants = (function () {
    function Constants() {
    }
    Constants.Scope = RegoDefinitionsModule.Scope;
    Constants.Owner = RegoDefinitionsModule.Owner;
    return Constants;
})();
exports.Constants = Constants;

//@ sourceMappingURL=typeioc.js.map
