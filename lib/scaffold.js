/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
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
var DecoratorRegistrationApiModule = require('./decorators/registrationApi');
var DecoratorResolutionApiModule = require('./decorators/resolutionApi');
var Scaffold = (function () {
    function Scaffold() {
    }
    Scaffold.prototype.createBuilder = function () {
        var internalContainerService = this.internalContainerService();
        return this.builderService().create(internalContainerService);
    };
    Scaffold.prototype.createDecorator = function () {
        var decoratorRegistrationService = this.decoratorRegistrationApiService();
        var internalSorageService = this.internalStorageService();
        var internalContainerService = this.internalContainerService();
        return new DecoratorModule.Decorator(this.builderService(), internalContainerService, decoratorRegistrationService, internalSorageService);
    };
    Scaffold.prototype.builderService = function () {
        var _this = this;
        return {
            create: function (internalContainerService) {
                var moduleStorageService = _this.internalStorageService();
                var baseRegoService = _this.registrationBaseService();
                var instanceRegoService = _this.instanceRegistrationService();
                var moduleRegoService = _this.moduleRegistrationService(moduleStorageService, baseRegoService);
                var configRegoService = _this.configRegistrationService(baseRegoService, moduleRegoService);
                var containerService = _this.containerService();
                return new BuilderModule.ContainerBuilder(configRegoService, baseRegoService, instanceRegoService, moduleRegoService, internalContainerService, containerService);
            }
        };
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
        var service = {
            create: function () {
                return new InternalStorageModule.InternalStorage();
            }
        };
        return {
            create: function () {
                return new RegoStorageModule.RegistrationStorage(service);
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
    Scaffold.prototype.containerService = function () {
        return {
            create: function (container) { return new ContainerModule.Container(container); }
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
    Scaffold.prototype.internalContainerService = function () {
        var that = this;
        return {
            create: function () {
                var internalRegoStorageService = that.internalStorageService();
                var regoStorageService = that.registrationStorageService(internalRegoStorageService);
                var disposableStorageService = that.disposableStorageService();
                var baseRegoService = that.registrationBaseService();
                var containerApiService = that.containerApiService();
                return new InternalContainerModule.InternalContainer(regoStorageService, disposableStorageService, baseRegoService, containerApiService, this.resolutionDetails);
            }
        };
    };
    Scaffold.prototype.decoratorRegistrationApiService = function () {
        return {
            createRegistration: function (register) {
                return new DecoratorRegistrationApiModule.RegistrationApi(register);
            },
            createResolution: function (resolve) {
                return new DecoratorResolutionApiModule.ResolutionApi(resolve);
            }
        };
    };
    return Scaffold;
})();
exports.Scaffold = Scaffold;
//# sourceMappingURL=scaffold.js.map