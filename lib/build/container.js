/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.8
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Exceptions = require('../exceptions/index');
var Container = (function () {
    function Container(_internalContainerService, container) {
        this._internalContainerService = _internalContainerService;
        this._container = container || _internalContainerService.create();
    }
    Object.defineProperty(Container.prototype, "cache", {
        get: function () {
            return this._container['cache'];
        },
        enumerable: true,
        configurable: true
    });
    Container.prototype.add = function (registrations) {
        this._container.add(registrations);
    };
    Container.prototype.createChild = function () {
        return new Container(this._internalContainerService, this._container.createChild());
    };
    Container.prototype.dispose = function () {
        this._container.dispose();
    };
    Container.prototype.resolve = function (service) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        Utils.checkNullArgument(service, 'service');
        args = Utils.concat([service], args);
        return this._container.resolve.apply(this._container, args);
    };
    Container.prototype.tryResolve = function (service) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        Utils.checkNullArgument(service, 'service');
        args = Utils.concat([service], args);
        return this._container.tryResolve.apply(this._container, args);
    };
    Container.prototype.resolveNamed = function (service, name) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        Utils.checkNullArgument(service, 'service');
        args = Utils.concat([service, name], args);
        return this._container.resolveNamed.apply(this._container, args);
    };
    Container.prototype.tryResolveNamed = function (service, name) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        Utils.checkNullArgument(service, 'service');
        args = Utils.concat([service, name], args);
        return this._container.tryResolveNamed.apply(this._container, args);
    };
    Container.prototype.resolveWithDependencies = function (service, dependencies) {
        Utils.checkNullArgument(service, 'service');
        if (!dependencies || dependencies.length <= 0)
            throw new Exceptions.ResolutionError('No dependencies provided');
        return this._container.resolveWithDependencies(service, dependencies);
    };
    Container.prototype.resolveWith = function (service) {
        Utils.checkNullArgument(service, 'service');
        return this._container.resolveWith(service);
    };
    return Container;
})();
exports.Container = Container;
//# sourceMappingURL=container.js.map