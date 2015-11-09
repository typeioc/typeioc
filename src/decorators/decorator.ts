/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

///<reference path="../../d.ts/typeioc.d.ts" />
///<reference path="../../d.ts/typeioc.internal.d.ts" />

/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>


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

    public provide(service: any) : Decorators.Register.INamedReusedOwned {

        var register = (api : Internal.IDecoratorRegistrationApi)  => {

            return (target) => {

                if(!Utils.Reflection.isPrototype(target)) {
                    let error = new Exceptions.DecoratorError("Decorator target not supported, not a prototype");
                    error.data = { target : target };
                    throw error;
                }

                var containerBuilder = api.builder || this._builder;

                let registration = containerBuilder
                    .register(service)
                    .asType(target);

                var name = api.name;
                if(name)
                    registration.named(name);

                var scope = api.scope || Types.Defaults.scope;
                registration.within(scope);

                var owner = api.owner || Types.Defaults.owner;
                registration.ownedBy(owner);

                return target;
            };
        };

        var api = this._decoratorRegistrationApiSerice.createRegistration(register);

        return api.provide(service);
    }

    public by(service? : any) : Decorators.Resolve.ITryNamedCache {

        var resolve = (api: Internal.IDecoratorResolutionApi) => {

            return (target: any, key : string, index : number) => {

                var key = Utils.Reflection.ReflectionKey;

                var bucket = <Internal.IDecoratorResolutionCollection>target[key];

                if(!bucket)
                    bucket = target[key] = <Internal.IDecoratorResolutionCollection>{ };

                bucket[index] = {
                    service : api.service,
                    name : api.name,
                    attempt: api.attempt,
                    cache : api.cache,
                    container : api.container
                };
            };
        };

        var api = this._decoratorRegistrationApiSerice.createResolution(resolve);

        return api.by(service);
    }

    public resolve() : Decorators.Resolve.IDecoratorResolutionResult {

        return (target: any, key : string, index : number) => {

            var key = Utils.Reflection.ReflectionKey;

            var bucket = target[key];

            if(!bucket)
                bucket = target[key] = <Internal.IDecoratorResolutionCollection>{ };

            bucket.args[index] = { };
        };
    }
}