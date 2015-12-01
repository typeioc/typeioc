/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
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

        var moduleStorageService = this.internalStorageService<any, Internal.IModuleItemRegistrationOptions>();
        var internalRegoStorageService = this.internalStorageService<any, Internal.IIndexedCollection<any>>();
        var regoStorageService = this.registrationStorageService(internalRegoStorageService);
        var disposableStorageService = this.disposableStorageService();
        var baseRegoService = this.registrationBaseService();
        var instanceRegoService = this.instanceRegistrationService();
        var moduleRegoService = this.moduleRegistrationService(moduleStorageService, baseRegoService);
        var configRegoService = this.configRegistrationService(baseRegoService, moduleRegoService);
        var containerApiService = this.containerApiService();

        var internalContainerService = this.internalContainerService(
            regoStorageService,
            disposableStorageService,
            baseRegoService,
            containerApiService);

        var containerService = this.containerService();

        return new BuilderModule.ContainerBuilder(
            configRegoService,
            baseRegoService,
            instanceRegoService,
            moduleRegoService,
            internalContainerService,
            containerService);
    }

    public createDecorator() : Decorators.IDecorator {

        var decoraorRegistrationService = this.decoratorRegistrationApiService();
        return new DecoratorModule.Decorator(this.createBuilder(), decoraorRegistrationService);
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
                //var storage = internalStorageService.create();

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
            create : (internalContainerService : Internal.IInternalContainerService,
                      container? : Internal.IContainer) => new ContainerModule.Container(internalContainerService, container)
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

    private internalContainerService(registrationStorageService : Internal.IRegistrationStorageService,
                                     disposableStorageService : Internal.IIDisposableStorageService,
                                     registrationBaseService : Internal.IRegistrationBaseService,
                                     containerApiService : Internal.IContainerApiService)
            : Internal.IInternalContainerService {
        return {
            create :() => {

                return new InternalContainerModule.InternalContainer(
                    registrationStorageService,
                    disposableStorageService,
                    registrationBaseService,
                    containerApiService);
            }
        }
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
