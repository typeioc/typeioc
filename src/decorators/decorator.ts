/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

///<reference path="../../d.ts/typeioc.d.ts" />
///<reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';


import { Reflection } from '../utils';
import { DecoratorError } from '../exceptions';
import { Defaults } from '../types';
import Decorators = Typeioc.Decorators;
import Internal = Typeioc.Internal;

export class Decorator implements Decorators.IDecorator {

    private _builder : Typeioc.IContainerBuilder;
    private _internalStorage : Internal.IInternalStorage<any, Internal.IDecoratorResolutionCollection>;

    constructor(private _builderService : Internal.IContainerBuilderService,
                private _internalContainerService : Internal.IInternalContainerService,
                private _decoratorRegistrationApiService : Internal.IDecoratorApiService,
                private _internalStorageService : Internal.IInternalStorageService<any, Internal.IDecoratorResolutionCollection>) {

        this._internalStorage = this._internalStorageService.create();

        _internalContainerService.resolutionDetails = this._internalStorage;

        this._builder = _builderService.create(_internalContainerService);
    }

    public build():Typeioc.IContainer {
        
        return this._builder.build();
    }

    public provide<R>(service:any):Decorators.Register.IInitializedDisposedNamedReusedOwned<R> {

        var register = (api:Internal.IDecoratorRegistrationApi<R>)  => (target:R) => {

            if (!Reflection.isPrototype(target)) {
                let error = new DecoratorError("Decorator target not supported, not a prototype");
                error.data = {target: target};
                throw error;
            }

            let registration = this._builder
                .register(api.service)
                .asType(target);

            var initializer = api.initializedBy;
            if (initializer)
                registration.initializeBy(initializer);

            var disposer = api.disposedBy;
            if (disposer)
                registration.dispose(disposer);

            var name = api.name;
            if (name)
                registration.named(name);

            var scope = api.scope || Defaults.Scope;
            registration.within(scope);

            var owner = api.owner || Defaults.Owner;
            registration.ownedBy(owner);

            return target;
        };

        var api = this._decoratorRegistrationApiService.createRegistration<R>(register);

        return api.provide(service);
    }

    public by(service?:any):Decorators.Resolve.IArgsTryNamedCache {

        var resolve = (api:Internal.IDecoratorResolutionApi) => (target:any, key:string, index:number) => {

            if(!api.service) {
                var dependencies = Reflection.getMetadata(Reflect, target);
                api.service = dependencies[index];
            }

            var bucket = this._internalStorage.register(target, () => <Internal.IDecoratorResolutionCollection>{});

            bucket[index] = {
                service: api.service,
                args: api.args,
                attempt: api.attempt,
                name: api.name,
                cache: api.cache
            };
        };

        var api = this._decoratorRegistrationApiService.createResolution(resolve);

        return api.by(service);
    }

    public resolveValue(value:any) : ParameterDecorator {

        return (target:any, key:string, index:number) => {

            var bucket = this._internalStorage.register(target, () => <Internal.IDecoratorResolutionCollection>{});

            bucket[index] = <Internal.IDecoratorResolutionParams> {
                value : value
            };
        };
    }
}