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
var Scaffold = (function () {
    function Scaffold() {
    }
    Scaffold.prototype.createBuilder = function () {
        var moduleStorageService = this.internalStorageService();
        var internalRegoStorageService = this.internalStorageService();
        var regoStorageService = this.registrationStorageService(internalRegoStorageService);
        var disposableStorageService = this.disposableStorageService();
        var baseRegoService = this.registrationBaseService();
        var instanceRegoService = new InstanceRegistrationService();
        var moduleRegoService = this.moduleRegistrationService(moduleStorageService, baseRegoService);
        var configRegoService = this.configRegistrationService(baseRegoService, moduleRegoService);
        var containerService = this.containerService(regoStorageService, disposableStorageService, baseRegoService);
        return new BuilderModule.ContainerBuilder(configRegoService, baseRegoService, instanceRegoService, moduleRegoService, containerService);
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
    Scaffold.prototype.containerService = function (registrationStorageService, disposableStorageService, registrationBaseService) {
        return {
            create: function () {
                var result = new ContainerModule.Container(registrationStorageService, disposableStorageService, registrationBaseService);
                return result;
            }
        };
    };
    Scaffold.prototype.configRegistrationService = function (registrationBaseService, moduleRegistrationService) {
        return {
            create: function (config) {
                var result = new ConfigRegoModule.ConfigRegistration(registrationBaseService, moduleRegistrationService);
                result.apply(config);
                return result;
            }
        };
    };
    return Scaffold;
})();
exports.Scaffold = Scaffold;
var InstanceRegistrationService = (function () {
    function InstanceRegistrationService() {
    }
    InstanceRegistrationService.prototype.create = function (baseRegistration) {
        return new InstanceRegoModule.Registration(baseRegistration);
    };
    return InstanceRegistrationService;
})();
//# sourceMappingURL=scaffold.js.map