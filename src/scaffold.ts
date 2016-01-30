/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

///<reference path='../d.ts/typeioc.internal.d.ts' />

'use strict';

import Internal = Typeioc.Internal;
import Decorators = Typeioc.Decorators;

import InternalStorageModule = require('./storage/internalStorage');
import DisposableStorageModule = require('./storage/disposableStorage');
import RegoBaseModule = require('./registration/base/registrationBase');
import RegoStorageModule = require('./storage/registrationStorage');
import ModuleRego = require('./registration/module/moduleRegistration');
import InstanceRegoModule = require('./registration/instance/registration');
import ConfigRegoModule = require('./registration/config/configRegistration');
import ContainerModule = require('./build/container');
import BuilderModule = require('./build/builder');
import ApiContainer = require('./build/containerApi');
import InternalContainerModule = require('./build/internalContainer');
import DecoratorModule=  require('./decorators/decorator');
import DecoratorRegistrationApiModule = require('./decorators/registrationApi');
import DecoratorResolutionApiModule = require('./decorators/resolutionApi');


export class Scaffold {

    public createBuilder() : Typeioc.IContainerBuilder {

        var internalContainerService = this.internalContainerService();

        return this.builderService().create(internalContainerService);
    }

    public createDecorator() : Decorators.IDecorator {

        var decoratorRegistrationService = this.decoratorRegistrationApiService();
        var internalSorageService = this.internalStorageService<any, Internal.IDecoratorResolutionCollection>();

        var internalContainerService = this.internalContainerService();

        return new DecoratorModule.Decorator(
            this.builderService(),
            internalContainerService,
            decoratorRegistrationService,
            internalSorageService);
    }

    private builderService() : Internal.IContainerBuilderService {

        return {
            create : (internalContainerService : Internal.IInternalContainerService) => {

                var moduleStorageService = this.internalStorageService<any, Internal.IModuleItemRegistrationOptions>();
                var baseRegoService = this.registrationBaseService();
                var instanceRegoService = this.instanceRegistrationService();
                var moduleRegoService = this.moduleRegistrationService(moduleStorageService, baseRegoService);
                var configRegoService = this.configRegistrationService(baseRegoService, moduleRegoService);

                var containerService = this.containerService();

                return new BuilderModule.ContainerBuilder(
                    configRegoService,
                    baseRegoService,
                    instanceRegoService,
                    moduleRegoService,
                    internalContainerService,
                    containerService);
            }
        };
    }

    private internalStorageService<K, T>() : Internal.IInternalStorageService<K, T> {

        return {
            create() {
                return new InternalStorageModule.InternalStorage<K, T>();
            }
        };
    }

    private disposableStorageService() : Internal.IIDisposableStorageService {
        return {
            create() {
                return new DisposableStorageModule.DisposableStorage();
            }
        };
    }

    private registrationBaseService() : Internal.IRegistrationBaseService {
        return {
            create(service : any) {
                return new RegoBaseModule.RegistrationBase(service);
            }
        };
    }

    private registrationStorageService(internalStorageService :
                                           Internal.IInternalStorageService<any, Internal.IIndexedCollection<any>>)
        : Internal.IRegistrationStorageService {

        var service = {
            create<R1, R2>() {
                return new InternalStorageModule.InternalStorage<R1, R2>();
            }
        };

        return {
            create() {
                return new RegoStorageModule.RegistrationStorage(service);
            }
        };
    }

    private moduleRegistrationService(
        internalStorageService :
            Internal.IInternalStorageService<any, Internal.IModuleItemRegistrationOptions>,
        registrationBaseService : Internal.IRegistrationBaseService)
        : Internal.IModuleRegistrationService {

        return {
            create(baseRegistration : Internal.IRegistrationBase) {
                var storage = internalStorageService.create();

                return  new ModuleRego.ModuleRegistration(baseRegistration, storage, registrationBaseService);
            }
        };
    }

    private containerService() : Internal.IContainerService {
        return {
            create : (container? : Internal.IContainer) => new ContainerModule.Container(container)
        };
    }

    private configRegistrationService(registrationBaseService : Internal.IRegistrationBaseService,
                                      moduleRegistrationService : Internal.IModuleRegistrationService)
        : Typeioc.Internal.IConfigRegistrationService {

        return {
            create : () => new ConfigRegoModule.ConfigRegistration(
                            registrationBaseService,
                            moduleRegistrationService)
        };
    }

    private containerApiService() : Internal.IContainerApiService {

        return {
            create : function<R>(container : Internal.IImportApi<R>) {
                return new ApiContainer.Api(container);
            }
        }
    }

    private instanceRegistrationService() : Internal.IInstanceRegistrationService {
        return {
            create : function<R>(baseRegistration : Internal.IRegistrationBase) : Typeioc.IRegistration<R> {
                return new InstanceRegoModule.Registration(baseRegistration);
            }
        };
    }

    private internalContainerService()
            : Internal.IInternalContainerService {

        var that = this;

        return {

            create() {

                var internalRegoStorageService = that.internalStorageService<any, Internal.IIndexedCollection<any>>();
                var regoStorageService = that.registrationStorageService(internalRegoStorageService);
                var disposableStorageService = that.disposableStorageService();
                var baseRegoService = that.registrationBaseService();
                var containerApiService = that.containerApiService();

                return new InternalContainerModule.InternalContainer(
                    regoStorageService ,
                    disposableStorageService,
                    baseRegoService,
                    containerApiService,
                    this.resolutionDetails);
            }
        };
    }

    private decoratorRegistrationApiService() : Internal.IDecoratorApiService {
        return {
            createRegistration<R>(register : (api : Internal.IDecoratorRegistrationApi<R>) => Decorators.Register.IDecoratorRegisterResult)
                                : Internal.IDecoratorRegistrationApi<R> {
                return new DecoratorRegistrationApiModule.RegistrationApi(register);
            },

            createResolution(resolve : (api : Internal.IDecoratorResolutionApi) => Decorators.Resolve.IDecoratorResolutionResult)
                : Internal.IDecoratorResolutionApi {

                return new DecoratorResolutionApiModule.ResolutionApi(resolve);
            }
        }
    }

}
