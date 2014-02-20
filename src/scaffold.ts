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


export class Scaffold {

    public createBuilder() : Typeioc.IContainerBuilder {

        var moduleStorageService = this.internalStorageService<any, Typeioc.Internal.IModuleItemRegistrationOptions>();
        var internalRegoStorageService = this.internalStorageService<any, Typeioc.Internal.IIndexedCollection>();
        var regoStorageService = this.registrationStorageService(internalRegoStorageService);
        var disposableStorageService = this.disposableStorageService();
        var baseRegoService = this.registrationBaseService();
        var instanceRegoService = new InstanceRegistrationService();
        var moduleRegoService = this.moduleRegistrationService(moduleStorageService, baseRegoService);
        var configRegoService = this.configRegistrationService(baseRegoService, moduleRegoService);
        var containerService = this.containerService(regoStorageService, disposableStorageService,baseRegoService);


        return new BuilderModule.ContainerBuilder(
            configRegoService,
            baseRegoService,
            instanceRegoService,
            moduleRegoService,
            containerService);
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
                                           Typeioc.Internal.IInternalStorageService<any, Typeioc.Internal.IIndexedCollection>)
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

                var result = new ModuleRego.ModuleRegistration(storage, registrationBaseService);

                result.applyBase(baseRegistration);

                return result;
            }
        };
    }

    private containerService(registrationStorageService : Typeioc.Internal.IRegistrationStorageService,
                             disposableStorageService : Typeioc.Internal.IIDisposableStorageService,
                             registrationBaseService : Typeioc.Internal.IRegistrationBaseService) : Typeioc.Internal.IContainerService {
        return {
            create : () => {

                var result = new ContainerModule.Container(
                    registrationStorageService,
                    disposableStorageService,
                    registrationBaseService
                );

                return result;
            }
        };
    }

    private configRegistrationService(registrationBaseService : Typeioc.Internal.IRegistrationBaseService,
                                      moduleRegistrationService : Typeioc.Internal.IModuleRegistrationService)
        : Typeioc.Internal.IConfigRegistrationService {

        return {
            create : (config : Typeioc.IConfig) =>  {
                var result = new ConfigRegoModule.ConfigRegistration(
                    registrationBaseService,
                    moduleRegistrationService);

                result.apply(config);

                return result;
            }
        };
    }
}

class InstanceRegistrationService implements Typeioc.Internal.IInstanceRegistrationService {
    create<R>(baseRegistration : Typeioc.Internal.IRegistrationBase) : Typeioc.IRegistration<R> {
        var result = new InstanceRegoModule.Registration();

        result.applyBase(baseRegistration);

        return result;
    }
}
