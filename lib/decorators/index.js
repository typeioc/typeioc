/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.8
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
///<reference path="../../d.ts/typeioc.d.ts" />
'use strict';
var _decorator;
exports.getDecorator;
var Instance;
(function (Instance) {
    function container() {
        return _decorator.container;
    }
    Instance.container = container;
    function register(service, options, builder) {
        if (!_decorator) {
            _decorator = exports.getDecorator();
        }
        return _decorator.register(service, options, builder);
    }
    Instance.register = register;
    function resolve(service, container) {
        if (!_decorator) {
            _decorator = exports.getDecorator();
        }
        return _decorator.resolve(service, container);
    }
    Instance.resolve = resolve;
})(Instance = exports.Instance || (exports.Instance = {}));
//# sourceMappingURL=index.js.map