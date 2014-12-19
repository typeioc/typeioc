/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2014 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Exceptions = require('../exceptions/index');
var ApiContainer = require('./containerApi');
var Container = (function () {
    function Container(_registrationStorageService, _disposableStorageService, _registrationBaseService) {
        this._registrationStorageService = _registrationStorageService;
        this._disposableStorageService = _disposableStorageService;
        this._registrationBaseService = _registrationBaseService;
        this.children = [];
        this._collection = this._registrationStorageService.create();
        this._disposableStorage = this._disposableStorageService.create();
        this.registerImpl = registerImpl.bind(this);
        this.resolveBase = resolveBase.bind(this);
        this.resolveImpl = resolveImpl.bind(this);
        this.resolveScope = resolveScope.bind(this);
        this.resolveContainerScope = resolveContainerScope.bind(this);
        this.resolveHierarchyScope = resolveHierarchyScope.bind(this);
        this.createTrackable = createTrackable.bind(this);
        this.createRegistration = createRegistration.bind(this);
    }
    Container.prototype.import = function (registrations) {
        registrations.forEach(this.registerImpl);
    };
    Container.prototype.createChild = function () {
        var child = new Container(this._registrationStorageService, this._disposableStorageService, this._registrationBaseService);
        child.parent = this;
        this.children.push(child);
        return child;
    };
    Container.prototype.dispose = function () {
        this._disposableStorage.disposeItems();
        while (this.children.length > 0) {
            var item = this.children.pop();
            item.dispose();
        }
    };
    Container.prototype.resolve = function (service) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var rego = this.createRegistration(service);
        rego.args = args;
        return this.resolveBase(rego, true);
    };
    Container.prototype.tryResolve = function (service) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var rego = this.createRegistration(service);
        rego.args = args;
        return this.resolveBase(rego, false);
    };
    Container.prototype.resolveNamed = function (service, name) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var rego = this.createRegistration(service);
        rego.name = name;
        rego.args = args;
        return this.resolveBase(rego, true);
    };
    Container.prototype.tryResolveNamed = function (service, name) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var rego = this.createRegistration(service);
        rego.name = name;
        rego.args = args;
        return this.resolveBase(rego, false);
    };
    //------------------------------------------------------------------------------------------------------------
    Container.prototype.resolveWithDep = function (service) {
        var _this = this;
        var dependencies = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            dependencies[_i - 1] = arguments[_i];
        }
        var child = this.createChild();
        var regoes = dependencies.map(function (dependency) {
            var registration = _this.createRegistration(dependency.service);
            var implementation = _this.resolveImpl(registration, true);
            var baseRegistration = implementation.cloneFor(child);
            baseRegistration.disposer = null;
            baseRegistration.initializer = null;
            baseRegistration.factory = dependency.resolverFactory;
            return baseRegistration;
        });
        var registration = this.createRegistration(service);
        var implementation = this.resolveImpl(registration, true);
        var baseRegistration = implementation.cloneFor(child);
        regoes.push(baseRegistration);
        child.import(regoes);
        return child.resolve(service);
    };
    Container.prototype.resolveWith = function (service) {
        var importApi = {
            import: function (api) {
                var rego = this.createRegistration(service);
                return null;
            }
        };
        var api = new ApiContainer.Api(importApi);
        return api.service.bind(api);
    };
    return Container;
})();
exports.Container = Container;
function registerImpl(registration) {
    if (!registration.factory)
        throw new Exceptions.ArgumentNullError("Factory is not defined for: " + registration.service.name);
    registration.container = this;
    this._collection.addEntry(registration);
}
function resolveBase(registration, throwIfNotFound) {
    var entry = this.resolveImpl(registration, throwIfNotFound);
    if (!entry && throwIfNotFound === false)
        return null;
    entry.args = registration.args;
    return this.resolveScope(entry, throwIfNotFound);
}
function resolveImpl(registration, throwIfNotFound) {
    var serviceEntry = this._collection.getEntry(registration);
    if (!serviceEntry && this.parent) {
        return this.parent.resolveImpl(registration, throwIfNotFound);
    }
    if (!serviceEntry && throwIfNotFound === true)
        throw new Exceptions.ResolutionError('Could not resolve service');
    return serviceEntry;
}
function resolveScope(registration, throwIfNotFound) {
    switch (registration.scope) {
        case 1 /* None */:
            return this.createTrackable(registration);
        case 2 /* Container */:
            return this.resolveContainerScope(registration);
        case 3 /* Hierarchy */:
            return this.resolveHierarchyScope(registration, throwIfNotFound);
        default:
            throw new Exceptions.ResolutionError('Unknown scoping');
    }
}
function resolveContainerScope(registration) {
    var entry;
    if (registration.container !== this) {
        entry = registration.cloneFor(this);
        this._collection.addEntry(entry);
    }
    else {
        entry = registration;
    }
    if (!entry.instance) {
        entry.instance = this.createTrackable(entry);
    }
    return entry.instance;
}
function resolveHierarchyScope(registration, throwIfNotFound) {
    if (registration.container && registration.container !== this) {
        var container = registration.container;
        return resolveBase.bind(container)(registration, throwIfNotFound);
    }
    if (!registration.instance) {
        registration.instance = this.createTrackable(registration);
    }
    return registration.instance;
}
function createTrackable(registration) {
    var instance = registration.invoker();
    if (registration.owner === 1 /* Container */ && registration.disposer) {
        this._disposableStorage.add(instance, registration.disposer);
    }
    if (registration.initializer) {
        registration.initializer(this, instance);
    }
    return instance;
}
function createRegistration(service) {
    return this._registrationBaseService.create(service);
}
//# sourceMappingURL=container.js.map