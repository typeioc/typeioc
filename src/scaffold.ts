/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () - 
 * --------------------------------------------------------------------------------------------------*/

///<reference path='../d.ts/typeioc.internal.d.ts' />

'use strict';

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
import DecoratorModule= require('./decorators/decorator');


export class Scaffold {

    public createBuilder() : Typeioc.IContainerBuilder {

        var moduleStorageService = this.internalStorageService<any, Typeioc.Internal.IModuleItemRegistrationOptions>();
        var internalRegoStorageService = this.internalStorageService<any, Typeioc.Internal.IIndexedCollection<any>>();
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

    public createDecorator() : Typeioc.Decorators.IDecorator {

        return new DecoratorModule.Decorator(this.createBuilder());
    }

    private internalStorageService<K, T>() : Typeioc.Internal.IInternalStorageService<K, T> {

        return {
            create : () => {
                return new InternalStorageModule.InternalStorage<K, T>();
            }
        };
    }

    private disposableStorageService() : Typeioc.Internal.IIDisposableStorageService {
        return {
            create : () =>  {
                return new DisposableStorageModule.DisposableStorage();
            }
        };
    }

    private registrationBaseService() : Typeioc.Internal.IRegistrationBaseService {
        return {
            create : (service : any) => {
                return new RegoBaseModule.RegistrationBase(service);
            }
        };
    }

    private registrationStorageService(internalStorageService :
                                           Typeioc.Internal.IInternalStorageService<any, Typeioc.Internal.IIndexedCollection<any>>)
        : Typeioc.Internal.IRegistrationStorageService {
        return {
            create : () => {
                var storage = internalStorageService.create();

                return new RegoStorageModule.RegistrationStorage(storage);
            }
        };
    }

    private moduleRegistrationService(
        internalStorageService :
            Typeioc.Internal.IInternalStorageService<any, Typeioc.Internal.IModuleItemRegistrationOptions>,
        registrationBaseService : Typeioc.Internal.IRegistrationBaseService)
        : Typeioc.Internal.IModuleRegistrationService {

        return {
            create : (baseRegistration : Typeioc.Internal.IRegistrationBase) =>  {
                var storage = internalStorageService.create();

                return  new ModuleRego.ModuleRegistration(baseRegistration, storage, registrationBaseService);
            }
        };
    }

    private containerService() : Typeioc.Internal.IContainerService {
        return {
            create : (internalContainerService : Typeioc.Internal.IInternalContainerService,
                      container? : Typeioc.Internal.IContainer) => new ContainerModule.Container(internalContainerService, container)
        };
    }

    private configRegistrationService(registrationBaseService : Typeioc.Internal.IRegistrationBaseService,
                                      moduleRegistrationService : Typeioc.Internal.IModuleRegistrationService)
        : Typeioc.Internal.IConfigRegistrationService {

        return {
            create : () => new ConfigRegoModule.ConfigRegistration(
                            registrationBaseService,
                            moduleRegistrationService)
        };
    }

    private containerApiService() : Typeioc.Internal.IContainerApiService {

        return {
            create : function<R>(container : Typeioc.Internal.IImportApi<R>) {
                return new ApiContainer.Api(container);
            }
        }
    }

    private instanceRegistrationService() : Typeioc.Internal.IInstanceRegistrationService {
        return {
            create : function<R>(baseRegistration : Typeioc.Internal.IRegistrationBase) : Typeioc.IRegistration<R> {
                return new InstanceRegoModule.Registration(baseRegistration);
            }
        };
    }

    private internalContainerService(registrationStorageService : Typeioc.Internal.IRegistrationStorageService,
                                     disposableStorageService : Typeioc.Internal.IIDisposableStorageService,
                                     registrationBaseService : Typeioc.Internal.IRegistrationBaseService,
                                     containerApiService : Typeioc.Internal.IContainerApiService) : Typeioc.Internal.IInternalContainerService {
        return {
            create: function ():Typeioc.Internal.IContainer {

                return new InternalContainerModule.InternalContainer(
                    registrationStorageService,
                    disposableStorageService,
                    registrationBaseService,
                    containerApiService);
            }
        }
    }

}
