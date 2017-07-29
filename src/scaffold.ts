/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

///<reference path='../d.ts/typeioc.internal.d.ts' />

"use strict";

import Internal = Typeioc.Internal;
import Decorators = Typeioc.Decorators;

import { InternalStorage } from './storage/internalStorage';
import { DisposableStorage } from './storage/disposableStorage';
import { RegistrationBase } from './registration/base/registrationBase';
import { RegistrationStorage } from './storage/registrationStorage';
import { ModuleRegistration } from './registration/module/moduleRegistration';
import { Registration } from './registration/instance/registration';
import { Container } from './build/container';
import { ContainerBuilder } from './build/builder';
import { Api as ContainerApi } from './build/containerApi';
import { InternalContainer } from './build/internalContainer';
import { Decorator } from './decorators/decorator';
import { RegistrationApi as DecoratorRegistrationApi } from './decorators/registrationApi';
import { ResolutionApi as DecoratorResolutionApi } from './decorators/resolutionApi';


export class Scaffold {

    public createBuilder() : Typeioc.IContainerBuilder {

        var internalContainerService = this.internalContainerService();

        return this.builderService().create(internalContainerService);
    }

    public createDecorator() : Decorators.IDecorator {

        var decoratorRegistrationService = this.decoratorRegistrationApiService();
        var internalSorageService = this.internalStorageService<any, Internal.IDecoratorResolutionCollection>();

        var internalContainerService = this.internalContainerService();

        return new Decorator(
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
              
                var containerService = this.containerService();

                return new ContainerBuilder(
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
                return new InternalStorage<K, T>();
            }
        };
    }

    private disposableStorageService() : Internal.IIDisposableStorageService {
        return {
            create() {
                return new DisposableStorage();
            }
        };
    }

    private registrationBaseService() : Internal.IRegistrationBaseService {
        return {
            create(service : any) {
                return new RegistrationBase(service);
            }
        };
    }

    private registrationStorageService(internalStorageService :
                                           Internal.IInternalStorageService<any, Internal.IIndexedCollection<any>>)
        : Internal.IRegistrationStorageService {

        var service = {
            create<R1, R2>() {
                return new InternalStorage<R1, R2>();
            }
        };

        return {
            create() {
                return new RegistrationStorage(service);
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

                return new ModuleRegistration(baseRegistration, storage, registrationBaseService);
            }
        };
    }

    private containerService() : Internal.IContainerService {
        return {
            create : (container? : Internal.IContainer) => new Container(container)
        };
    }

    private containerApiService() : Internal.IContainerApiService {

        return {
            create : function<R>(container : Internal.IImportApi<R>) {
                return new ContainerApi(container);
            }
        }
    }

    private instanceRegistrationService() : Internal.IInstanceRegistrationService {
        return {
            create : function<R>(baseRegistration : Internal.IRegistrationBase) : Typeioc.IRegistration<R> {
                return new Registration(baseRegistration);
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

                return new InternalContainer(
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
            createRegistration<R>(register : (api : Internal.IDecoratorRegistrationApi<R>) => ClassDecorator)
                                : Internal.IDecoratorRegistrationApi<R> {
                return new DecoratorRegistrationApi(register);
            },

            createResolution(resolve : (api : Internal.IDecoratorResolutionApi) => ParameterDecorator)
                : Internal.IDecoratorResolutionApi {

                return new DecoratorResolutionApi(resolve);
            }
        }
    }
}
