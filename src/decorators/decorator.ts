/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.8
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/


///<reference path="../../d.ts/typeioc.d.ts" />
///<reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Utils = require('../utils/index');
import Exceptions = require('../exceptions/index');
import Types = require('../types/index');

type IRegistrationOptions = Typeioc.Decorators.IRegistrationOptions;
type IDecorator = Typeioc.Decorators.IDecorator;

export class Decorator implements IDecorator {

    constructor(private _registrationBaseService : Typeioc.Internal.IRegistrationBaseService,
                private _instanceRegistrationService : Typeioc.Internal.IInstanceRegistrationService,
                private _container : Typeioc.Internal.IContainer){}


    public get container() : Typeioc.IContainer {
        return Utils.toPublicContainer(this._container);
    }

    public register(service : any, options? : IRegistrationOptions, builder? : Typeioc.IContainerBuilder) {

        return target => {

            if(!Utils.Reflection.isPrototype(target)) {
                let error = new Exceptions.DecoratorError("Decorator target not supported");
                error.data = { target : target };
                throw error;
            }

            var factory = () => target;

            if(builder){
                let registration = builder.register(service);
                registration.as(factory);
                this.addRegistrationOptions(registration, options);

            } else {
                let regoBase = this._registrationBaseService.create(service);
                let registration = this._instanceRegistrationService.create(regoBase);

                registration.as(factory);

                regoBase.scope = options && options.within ? options.within : Types.Defaults.scope;
                regoBase.owner = Types.Owner.Externals;

                this.addRegistrationOptions(registration, options);

                this._container.add([ regoBase ]);
            }

            return target;
        };
    }

    private addRegistrationOptions(registration : Typeioc.IRegistration<any>,  options? : IRegistrationOptions) {

        if(!options) return;

        Object.keys(options).forEach(item => {

            var option = options[item];

            //console.log(registration[item]);

            registration[item](options[item]);

        });
    }



    public resolve(service : any, container? : Typeioc.IContainer) {

        container = container || this._container;

        return target => {

            var result = container.resolve(target);

            var args = []; // TODO: options && options.args ? options.args : [];
            return Utils.Reflection.createPrototype(target, args);
        };
    }
}