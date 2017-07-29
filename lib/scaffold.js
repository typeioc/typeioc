/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
///<reference path='../d.ts/typeioc.internal.d.ts' />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internalStorage_1 = require("./storage/internalStorage");
const disposableStorage_1 = require("./storage/disposableStorage");
const registrationBase_1 = require("./registration/base/registrationBase");
const registrationStorage_1 = require("./storage/registrationStorage");
const moduleRegistration_1 = require("./registration/module/moduleRegistration");
const registration_1 = require("./registration/instance/registration");
const container_1 = require("./build/container");
const builder_1 = require("./build/builder");
const containerApi_1 = require("./build/containerApi");
const internalContainer_1 = require("./build/internalContainer");
const decorator_1 = require("./decorators/decorator");
const registrationApi_1 = require("./decorators/registrationApi");
const resolutionApi_1 = require("./decorators/resolutionApi");
class Scaffold {
    createBuilder() {
        var internalContainerService = this.internalContainerService();
        return this.builderService().create(internalContainerService);
    }
    createDecorator() {
        var decoratorRegistrationService = this.decoratorRegistrationApiService();
        var internalSorageService = this.internalStorageService();
        var internalContainerService = this.internalContainerService();
        return new decorator_1.Decorator(this.builderService(), internalContainerService, decoratorRegistrationService, internalSorageService);
    }
    builderService() {
        return {
            create: (internalContainerService) => {
                var moduleStorageService = this.internalStorageService();
                var baseRegoService = this.registrationBaseService();
                var instanceRegoService = this.instanceRegistrationService();
                var moduleRegoService = this.moduleRegistrationService(moduleStorageService, baseRegoService);
                var containerService = this.containerService();
                return new builder_1.ContainerBuilder(baseRegoService, instanceRegoService, moduleRegoService, internalContainerService, containerService);
            }
        };
    }
    internalStorageService() {
        return {
            create() {
                return new internalStorage_1.InternalStorage();
            }
        };
    }
    disposableStorageService() {
        return {
            create() {
                return new disposableStorage_1.DisposableStorage();
            }
        };
    }
    registrationBaseService() {
        return {
            create(service) {
                return new registrationBase_1.RegistrationBase(service);
            }
        };
    }
    registrationStorageService(internalStorageService) {
        var service = {
            create() {
                return new internalStorage_1.InternalStorage();
            }
        };
        return {
            create() {
                return new registrationStorage_1.RegistrationStorage(service);
            }
        };
    }
    moduleRegistrationService(internalStorageService, registrationBaseService) {
        return {
            create(baseRegistration) {
                var storage = internalStorageService.create();
                return new moduleRegistration_1.ModuleRegistration(baseRegistration, storage, registrationBaseService);
            }
        };
    }
    containerService() {
        return {
            create: (container) => new container_1.Container(container)
        };
    }
    containerApiService() {
        return {
            create: function (container) {
                return new containerApi_1.Api(container);
            }
        };
    }
    instanceRegistrationService() {
        return {
            create: function (baseRegistration) {
                return new registration_1.Registration(baseRegistration);
            }
        };
    }
    internalContainerService() {
        var that = this;
        return {
            create() {
                var internalRegoStorageService = that.internalStorageService();
                var regoStorageService = that.registrationStorageService(internalRegoStorageService);
                var disposableStorageService = that.disposableStorageService();
                var baseRegoService = that.registrationBaseService();
                var containerApiService = that.containerApiService();
                return new internalContainer_1.InternalContainer(regoStorageService, disposableStorageService, baseRegoService, containerApiService, this.resolutionDetails);
            }
        };
    }
    decoratorRegistrationApiService() {
        return {
            createRegistration(register) {
                return new registrationApi_1.RegistrationApi(register);
            },
            createResolution(resolve) {
                return new resolutionApi_1.ResolutionApi(resolve);
            }
        };
    }
}
exports.Scaffold = Scaffold;
//# sourceMappingURL=scaffold.js.map