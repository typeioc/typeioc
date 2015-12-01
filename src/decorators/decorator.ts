/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

///<reference path="../../d.ts/typeioc.d.ts" />
///<reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';


import Utils = require('../utils/index');
import Exceptions = require('../exceptions/index');
import Types = require('../types/index');
import Decorators = Typeioc.Decorators;
import Internal = Typeioc.Internal;

export class Decorator implements Decorators.IDecorator {

    constructor(private _builder : Typeioc.IContainerBuilder,
                private _decoratorRegistrationApiSerice : Typeioc.Internal.IDecoratorApiService ) {}

    public build() : Typeioc.IContainer {
        return this._builder.build();
    }

    public provide<R>(service: any) : Decorators.Register.IInitializedDisposedNamedReusedOwned<R> {

        var register = (api : Internal.IDecoratorRegistrationApi<R>)  => {

            return (target : R) => {

                if(!Utils.Reflection.isPrototype(target)) {
                    let error = new Exceptions.DecoratorError("Decorator target not supported, not a prototype");
                    error.data = { target : target };
                    throw error;
                }

                var containerBuilder = api.builder || this._builder;

                let registration = containerBuilder
                    .register(api.service)
                    .asType(target);

                var initializer = api.initializedBy;
                if(initializer)
                    registration.initializeBy(initializer);

                var disposer = api.disposedBy;
                if(disposer)
                    registration.dispose(disposer);

                var name = api.name;
                if(name)
                    registration.named(name);

                var scope = api.scope || Types.Defaults.Scope;
                registration.within(scope);

                var owner = api.owner || Types.Defaults.Owner;
                registration.ownedBy(owner);

                return target;
            };
        };

        var api = this._decoratorRegistrationApiSerice.createRegistration<R>(register);

        return api.provide(service);
    }

    public by(service? : any) : Decorators.Resolve.IArgsTryNamedCache {

        var resolve = (api: Internal.IDecoratorResolutionApi) => {

            return (target: any, key : string, index : number) => {

                var reflectionKey = Utils.Reflection.ReflectionKey;

                var bucket = <Internal.IDecoratorResolutionCollection>target[reflectionKey];

                if(!bucket)
                    bucket = target[reflectionKey] = <Internal.IDecoratorResolutionCollection>{ };

                bucket[index] = {
                    service : api.service,
                    args: api.args,
                    attempt: api.attempt,
                    name : api.name,
                    cache : api.cache,
                    container : api.container
                };
            };
        };

        var api = this._decoratorRegistrationApiSerice.createResolution(resolve);

        return api.by(service);
    }

    public resolveValue(value: any) : Decorators.Resolve.IDecoratorResolutionResult {

        return (target: any, key : string, index : number) => {

            var reflectionKey = Utils.Reflection.ReflectionKey;

            var bucket = target[reflectionKey];

            if(!bucket)
                bucket = target[reflectionKey] = <Internal.IDecoratorResolutionCollection>{ };

            bucket[index] = {
                value : value
            };
        };
    }
}