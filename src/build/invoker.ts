/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

"use strict";

import { Reflection } from '../utils';
import { ResolutionError } from '../exceptions';

import Internal = Typeioc.Internal;

export class Invoker implements Internal.IInvoker {
    
    constructor(
        private _container: Internal.IContainer,
        private _resolutionDetails? : Internal.IDecoratorResolutionParamsData) { }
    
    public invoke<R>(registration : Internal.IRegistrationBase,
        throwIfNotFound : boolean,
        args?: Array<any>) : R {

        switch(registration.registrationType) {
            case Internal.RegistrationType.FactoryType:
                return this.instantiate(registration.factoryType, registration, throwIfNotFound, args);

            case Internal.RegistrationType.FactoryValue:
                return registration.factoryValue;

            case Internal.RegistrationType.Factory:
            default:
               return this.createByFactory(registration, args); 
        }
    }

    private createByFactory<R>(
        registration : Internal.IRegistrationBase, args: Array<any> = []) : R {
        
        args = [registration.container].concat(args.slice(0));
        return registration.factory.apply(registration.factory, args);
    }

    private instantiate(
        type : any,
        registration : Internal.IRegistrationBase,
        throwIfNotFound : boolean,
        args?: Array<any>) {
        
        if(args && args.length &&
            registration.params.length) {
            const exception = new ResolutionError('Could not instantiate type. Arguments and dependencies are not allowed for simultaneous resolution. Pick dependencies or arguments');
            exception.data = type;
            throw exception;
        }

        if(args && args.length) {
            return Reflection.construct(type, args);
        }

        if(registration.params.length) {
            const params = registration.params
            .map(item => { 
                const dependency = registration.dependenciesValue.filter(d => d.service === item)[0];
                const depName = dependency ? dependency.named : null;

                if(throwIfNotFound === true) {
                    return !!depName ? this._container.resolveNamed(item, depName) : this._container.resolve(item);
                }

                return !!depName ? this._container.tryResolveNamed(item, depName) : this._container.tryResolve(item);
            });

            return Reflection.construct(type, params);
        }

        const dependencies = Reflection.getMetadata(Reflect, type);

        const params = dependencies
            .map((dependency, index) => {

                let depParams = this._resolutionDetails ? this._resolutionDetails.tryGet(type) : null;
                let depParamsValue = depParams ? depParams[index] : null;

                if(!depParamsValue) {
                    return this._container.resolve(dependency);
                }

                if(depParamsValue.type === Internal.DecoratorResolutionParameterType.Value) {
                    return depParamsValue.value;
                }

                if(depParamsValue.type === Internal.DecoratorResolutionParameterType.FunctionValue) {
                    return depParamsValue.value();
                }

                let resolutionItem = depParamsValue.service || dependency;
                let resolution = this._container.resolveWith(resolutionItem);

                if(depParamsValue.args && depParamsValue.args.length)
                    resolution.args(...depParamsValue.args);

                if(depParamsValue.name)
                    resolution.name(depParamsValue.name);

                if(depParamsValue.attempt === true)
                    resolution.attempt();

                if(depParamsValue.cache && depParamsValue.cache.use === true)
                    resolution.cache(depParamsValue.cache.name);

                return resolution.exec();
            });

        return Reflection.construct(type, params);
    }
}