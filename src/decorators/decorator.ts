/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.4
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

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

    public provide<R>(service:any): Decorators.Register.IInitializedLazyDisposedNamedReusedOwned<R> {
        const register = createRegister(this._builder);
        const api = this._decoratorRegistrationApiService.createRegistration<R>(register);
        return api.provide(service);
    }

    public provideSelf<R>() : Decorators.Register.IInitializedLazyDisposedNamedReusedOwned<R> {
        const register = createRegister(this._builder, true);
        const api = this._decoratorRegistrationApiService.createRegistration<R>(register);
        return api.provideUndefined();
    }

    public by(service?:any): Decorators.Resolve.IArgsTryNamedCache {

        const resolve = (api:Internal.IDecoratorResolutionApi) => (target:any, key:string, index:number) => {

            if(!api.service) {
                var dependencies = Reflection.getMetadata(Reflect, target);
                api.service = dependencies[index];
            }

            const bucket = this._internalStorage.register(target, () => <Internal.IDecoratorResolutionCollection>{});

            bucket[index] = <Internal.IDecoratorResolutionParams> {
                service: api.service,
                args: api.args,
                attempt: api.attempt,
                name: api.name,
                cache: api.cache,
                type: Internal.DecoratorResolutionParameterType.Service
            };
        };

        const api = this._decoratorRegistrationApiService.createResolution(resolve);

        return api.by(service);
    }

    public resolveValue(value: any | Function) : ParameterDecorator {

        return (target:any, key:string, index:number) => {

            const bucket = this._internalStorage.register(target, () => <Internal.IDecoratorResolutionCollection>{});

            const type = Reflection.isFunction(value) ?
                Internal.DecoratorResolutionParameterType.FunctionValue:
                Internal.DecoratorResolutionParameterType.Value;

            bucket[index] = <Internal.IDecoratorResolutionParams> {
                value,
                type
            };
        };
    }

    public register<R>(service: any): Typeioc.IRegistration<R> {
        return this._builder.register<R>(service);
    }

    public import(builder: Typeioc.IContainerBuilder): void {
        this._builder.copy(builder);
    }
}

function createRegister<R>(builder : Typeioc.IContainerBuilder, isSelf = false) { 
    return (api:Internal.IDecoratorRegistrationApi<R>)  => (target) => {
    
        if (!Reflection.isPrototype(target)) {
            const error = new DecoratorError("Decorator target not supported, not a prototype");
            error.data = { target };
            throw error;
        }

        const registration = isSelf ?
            builder.register(target).asSelf() :
            builder
            .register(api.service)
            .asType(target);

        const initializer = api.initializedBy;
        if (initializer) {
            registration.initializeBy(initializer);
        }

        const isLazy = api.isLazy;
        if (isLazy) {
            registration.lazy();
        }

        const disposer = api.disposedBy;
        if (disposer) {
            registration.dispose(disposer);
        }

        const name = api.name;
        if (name) {
            registration.named(name);
        }

        const scope = api.scope || Defaults.Scope;
        registration.within(scope);

        const owner = api.owner || Defaults.Owner;
        registration.ownedBy(owner);

        return target;
    };
}