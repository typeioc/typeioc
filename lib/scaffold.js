/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () -
 * --------------------------------------------------------------------------------------------------*/
///<reference path='../d.ts/typeioc.internal.d.ts' />
'use strict';
var InternalStorageModule = require('./storage/internalStorage');
var DisposableStorageModule = require('./storage/disposableStorage');
var RegoBaseModule = require('./registration/base/registrationBase');
var RegoStorageModule = require('./storage/registrationStorage');
var ModuleRego = require('./registration/module/moduleRegistration');
var InstanceRegoModule = require('./registration/instance/registration');
var ConfigRegoModule = require('./registration/config/configRegistration');
var ContainerModule = require('./build/container');
var BuilderModule = require('./build/builder');
var ApiContainer = require('./build/containerApi');
var InternalContainerModule = require('./build/internalContainer');
var DecoratorModule = require('./decorators/decorator');
var Scaffold = (function () {
    function Scaffold() {
    }
    Scaffold.prototype.createBuilder = function () {
        var moduleStorageService = this.internalStorageService();
        var internalRegoStorageService = this.internalStorageService();
        var regoStorageService = this.registrationStorageService(internalRegoStorageService);
        var disposableStorageService = this.disposableStorageService();
        var baseRegoService = this.registrationBaseService();
        var instanceRegoService = this.instanceRegistrationService();
        var moduleRegoService = this.moduleRegistrationService(moduleStorageService, baseRegoService);
        var configRegoService = this.configRegistrationService(baseRegoService, moduleRegoService);
        var containerApiService = this.containerApiService();
        var internalContainerService = this.internalContainerService(regoStorageService, disposableStorageService, baseRegoService, containerApiService);
        var containerService = this.containerService(internalContainerService);
        return new BuilderModule.ContainerBuilder(configRegoService, baseRegoService, instanceRegoService, moduleRegoService, containerService);
    };
    Scaffold.prototype.createDecorator = function () {
        return new DecoratorModule.Decorator(this.createBuilder());
    };
    Scaffold.prototype.internalStorageService = function () {
        return {
            create: function () {
                return new InternalStorageModule.InternalStorage();
            }
        };
    };
    Scaffold.prototype.disposableStorageService = function () {
        return {
            create: function () {
                return new DisposableStorageModule.DisposableStorage();
            }
        };
    };
    Scaffold.prototype.registrationBaseService = function () {
        return {
            create: function (service) {
                return new RegoBaseModule.RegistrationBase(service);
            }
        };
    };
    Scaffold.prototype.registrationStorageService = function (internalStorageService) {
        return {
            create: function () {
                var storage = internalStorageService.create();
                return new RegoStorageModule.RegistrationStorage(storage);
            }
        };
    };
    Scaffold.prototype.moduleRegistrationService = function (internalStorageService, registrationBaseService) {
        return {
            create: function (baseRegistration) {
                var storage = internalStorageService.create();
                return new ModuleRego.ModuleRegistration(baseRegistration, storage, registrationBaseService);
            }
        };
    };
    Scaffold.prototype.containerService = function (internalContainerService) {
        return {
            create: function () { return new ContainerModule.Container(internalContainerService); }
        };
    };
    Scaffold.prototype.configRegistrationService = function (registrationBaseService, moduleRegistrationService) {
        return {
            create: function () { return new ConfigRegoModule.ConfigRegistration(registrationBaseService, moduleRegistrationService); }
        };
    };
    Scaffold.prototype.containerApiService = function () {
        return {
            create: function (container) {
                return new ApiContainer.Api(container);
            }
        };
    };
    Scaffold.prototype.instanceRegistrationService = function () {
        return {
            create: function (baseRegistration) {
                return new InstanceRegoModule.Registration(baseRegistration);
            }
        };
    };
    Scaffold.prototype.internalContainerService = function (registrationStorageService, disposableStorageService, registrationBaseService, containerApiService) {
        return {
            create: function () {
                return new InternalContainerModule.InternalContainer(registrationStorageService, disposableStorageService, registrationBaseService, containerApiService);
            }
        };
    };
    return Scaffold;
})();
exports.Scaffold = Scaffold;
//# sourceMappingURL=scaffold.js.map