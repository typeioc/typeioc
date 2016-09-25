/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
///<reference path='../d.ts/typeioc.internal.d.ts' />
///<reference path='../d.ts/typeioc.addons.d.ts' />
'use strict';
const decorator_1 = require('./interceptors/decorator');
const proxy_1 = require('./interceptors/proxy');
const interceptor_1 = require('./interceptors/interceptor');
class ScaffoldAddons {
    interceptor() {
        var decorator = new decorator_1.Decorator();
        var proxy = new proxy_1.Proxy(decorator);
        return new interceptor_1.Interceptor(proxy);
    }
}
exports.ScaffoldAddons = ScaffoldAddons;
//# sourceMappingURL=scaffoldAddons.js.map