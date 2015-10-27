/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () - 
 * --------------------------------------------------------------------------------------------------*/


///<reference path="../../d.ts/typeioc.d.ts" />
///<reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Utils = require('../utils/index');
import Exceptions = require('../exceptions/index');
import Types = require('../types/index');


export class Decorator implements Typeioc.Decorators.IDecorator {

    constructor(private _builder : Typeioc.IContainerBuilder){}


    public build() : Typeioc.IContainer {
        return this._builder.build();
    }

    public register<R>(service : any, builder? : Typeioc.IContainerBuilder) {

        return target => {

            if(!Utils.Reflection.isPrototype(target)) {
                let error = new Exceptions.DecoratorError("Decorator target not supported, not a prototype");
                error.data = { target : target };
                throw error;
            }

            var factory = () => target;

            var containerBuilder = builder || this._builder;

            let registration = containerBuilder.register(service);
            registration.as(factory);
            //this.addRegistrationOptions(registration, options);



            return target;
        };
    }

    private addRegistrationOptions<R>(registration : Typeioc.IRegistration<any>,  options? : Typeioc.Decorators.IRegistrationOptions<R>) {

        if(!options) return;

        Object.keys(options).forEach(item => {

            var option = options[item];

            registration[item](options[item]);

        });
    }



    //public resolve(service : any, container? : Typeioc.IContainer) {
    //
    //    container = container || this._container;
    //
    //    return target => {
    //
    //        var result = container.resolve(target);
    //
    //        var args = []; // TODO: options && options.args ? options.args : [];
    //        return Utils.Reflection.createPrototype(target, args);
    //    };
    //}
}