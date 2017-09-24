/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.3
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import { Decorator } from './interceptors/decorator';
import { Proxy } from './interceptors/proxy';
import { Interceptor } from './interceptors/interceptor';

export class ScaffoldAddons {

    public interceptor() : Addons.Interceptors.IInterceptor {

        var decorator = new Decorator();
        var proxy = new Proxy(decorator);

        return new Interceptor(proxy);
    }
}