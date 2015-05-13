/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

///<reference path='../d.ts/typeioc.internal.d.ts' />
///<reference path='../d.ts/typeioc.addons.d.ts' />

'use strict';

import DecoratorModule = require('./interceptors/decorator');
import ProxyModule = require('./interceptors/proxy');
import InterceptorModule = require('./interceptors/interceptor');

export class ScaffoldAddons {

    public interceptor() : Addons.Interceptors.IInterceptor {

        var decoratorService = this.decoratorService();
        var proxy = new ProxyModule.Proxy(decoratorService);

        return new InterceptorModule.Interceptor(proxy);
    }

    private decoratorService() : Typeioc.Internal.IDecoratorService {
        return{
            create() : Typeioc.Internal.Interceptors.IDecorator {

                return new DecoratorModule.Decorator();
            }
        }
    }
}