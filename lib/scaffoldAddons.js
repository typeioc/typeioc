/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
///<reference path='../d.ts/typeioc.internal.d.ts' />
///<reference path='../d.ts/typeioc.addons.d.ts' />
'use strict';
var DecoratorModule = require('./interceptors/decorator');
var ProxyModule = require('./interceptors/proxy');
var InterceptorModule = require('./interceptors/interceptor');
var ScaffoldAddons = (function () {
    function ScaffoldAddons() {
    }
    ScaffoldAddons.prototype.interceptor = function () {
        var decorator = new DecoratorModule.Decorator();
        var proxy = new ProxyModule.Proxy(decorator);
        return new InterceptorModule.Interceptor(proxy);
    };
    return ScaffoldAddons;
})();
exports.ScaffoldAddons = ScaffoldAddons;
//# sourceMappingURL=scaffoldAddons.js.map