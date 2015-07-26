/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/


///<reference path="../../d.ts/typeioc.d.ts" />

'use strict';

type IDecorator = Typeioc.Decorators.IDecorator;
type IRegistrationOptions = Typeioc.Decorators.IRegistrationOptions;


var _decorator : IDecorator

export var getDecorator : () => IDecorator;

export module Instance {
    export function container() {
        return _decorator.container;
    }

    export function register(service : any, options? : IRegistrationOptions, builder? : Typeioc.IContainerBuilder) {

        if(!_decorator) {
            _decorator = getDecorator();
        }

        return _decorator.register(service, options, builder);
    }

    export function resolve(service : any, container? : Typeioc.IContainer) {

        if(!_decorator) {
            _decorator = getDecorator();
        }

        return _decorator.resolve(service, container);
    }
}
