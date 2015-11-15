/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var Exceptions = require('../exceptions/index');
var Utils = require('../utils/index');
var Types = require('../types/index');
var InternalContainer = (function () {
    function InternalContainer(_registrationStorageService, _disposableStorageService, _registrationBaseService, _containerApiService) {
        this._registrationStorageService = _registrationStorageService;
        this._disposableStorageService = _disposableStorageService;
        this._registrationBaseService = _registrationBaseService;
        this._containerApiService = _containerApiService;
        this.children = [];
        this._dependencyScope = Types.Scope.None;
        this._dependencyOwner = Types.Owner.Externals;
        this._collection = this._registrationStorageService.create();
        this._disposableStorage = this._disposableStorageService.create();
        this._cache = {};
    }
    Object.defineProperty(InternalContainer.prototype, "cache", {
        get: function () {
            return this._cache;
        },
        enumerable: true,
        configurable: true
    });
    InternalContainer.prototype.add = function (registrations) {
        var resolveImplementation = this.registerImpl.bind(this);
        registrations.forEach(resolveImplementation);
    };
    InternalContainer.prototype.createChild = function () {
        var child = new InternalContainer(this._registrationStorageService, this._disposableStorageService, this._registrationBaseService, this._containerApiService);
        child.parent = this;
        this.children.push(child);
        return child;
    };
    InternalContainer.prototype.dispose = function () {
        this._disposableStorage.disposeItems();
        while (this.children.length > 0) {
            var item = this.children.pop();
            item.dispose();
        }
    };
    InternalContainer.prototype.resolve = function (service) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var rego = this.createRegistration(service);
        rego.args = args;
        return this.resolveBase(rego, true);
    };
    InternalContainer.prototype.tryResolve = function (service) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var rego = this.createRegistration(service);
        rego.args = args;
        return this.resolveBase(rego, false);
    };
    InternalContainer.prototype.resolveNamed = function (service, name) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var rego = this.createRegistration(service);
        rego.name = name;
        rego.args = args;
        return this.resolveBase(rego, true);
    };
    InternalContainer.prototype.tryResolveNamed = function (service, name) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var rego = this.createRegistration(service);
        rego.name = name;
        rego.args = args;
        return this.resolveBase(rego, false);
    };
    InternalContainer.prototype.resolveWithDependencies = function (service, dependencies) {
        var api = this._containerApiService.create(undefined);
        api.service(service)
            .dependencies(dependencies);
        return this.resolveWithDepBase(api);
    };
    InternalContainer.prototype.resolveWith = function (service) {
        var _this = this;
        var importApi = {
            execute: function (api) {
                var result;
                if (api.isDependenciesResolvable) {
                    result = _this.resolveWithDepBase(api);
                }
                else {
                    var rego = _this.createRegistration(api.serviceValue);
                    rego.name = api.nameValue;
                    rego.args = api.argsValue;
                    result = _this.resolveBase(rego, api.throwResolveError);
                }
                if (result && api.cacheValue.use === true) {
                    _this.addToCache(result, api);
                }
                return result;
            }
        };
        var api = this._containerApiService.create(importApi);
        return api.service(service);
    };
    InternalContainer.prototype.registerImpl = function (registration) {
        if (!registration.factory) {
            var exception = new Exceptions.NullReferenceError("Factory is not defined");
            exception.data = registration.service;
            throw exception;
        }
        registration.container = this;
        this._collection.addEntry(registration);
    };
    InternalContainer.prototype.resolveBase = function (registration, throwIfNotFound) {
        var entry = this.resolveImpl(registration, throwIfNotFound);
        if (!entry && throwIfNotFound === false)
            return null;
        entry.args = registration.args;
        return this.resolveScope(entry, throwIfNotFound);
    };
    InternalContainer.prototype.resolveImpl = function (registration, throwIfNotFound) {
        var serviceEntry = this._collection.getEntry(registration);
        if (!serviceEntry && this.parent) {
            return this.parent.resolveImpl(registration, throwIfNotFound);
        }
        if (!serviceEntry && throwIfNotFound === true) {
            var exception = new Exceptions.ResolutionError('Could not resolve service');
            exception.data = registration.service;
            throw exception;
        }
        return serviceEntry;
    };
    InternalContainer.prototype.resolveScope = function (registration, throwIfNotFound) {
        switch (registration.scope) {
            case 1 /* None */:
                return this.createTrackable(registration);
            case Types.Scope.Container:
                return this.resolveContainerScope(registration);
            case Types.Scope.Hierarchy:
                return this.resolveHierarchyScope(registration, throwIfNotFound);
            default:
                throw new Exceptions.ResolutionError('Unknown scoping');
        }
    };
    InternalContainer.prototype.resolveContainerScope = function (registration) {
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
    };
    InternalContainer.prototype.resolveHierarchyScope = function (registration, throwIfNotFound) {
        if (registration.container &&
            registration.container !== this) {
            var container = registration.container;
            return container.resolveBase(registration, throwIfNotFound);
        }
        if (!registration.instance) {
            registration.instance = this.createTrackable(registration);
        }
        return registration.instance;
    };
    InternalContainer.prototype.createTrackable = function (registration) {
        var instance = registration.invoke();
        if (registration.forInstantiation === true) {
            instance = this.instantiate.apply(this, [instance].concat(registration.args));
        }
        if (registration.owner === Types.Owner.Container &&
            registration.disposer) {
            this._disposableStorage.add(instance, registration.disposer);
        }
        if (registration.initializer) {
            registration.initializer(this, instance);
        }
        return instance;
    };
    InternalContainer.prototype.createRegistration = function (service) {
        return this._registrationBaseService.create(service);
    };
    InternalContainer.prototype.createDependenciesRegistration = function (api) {
        var _this = this;
        var items = api.dependenciesValue.map(function (dependency) {
            if (!dependency.service) {
                var exception = new Exceptions.ResolutionError('Service is not defined');
                exception.data = dependency;
                throw exception;
            }
            if (!dependency.factory) {
                var exception = new Exceptions.ResolutionError('Factory is not defined');
                exception.data = dependency;
                throw exception;
            }
            var registration = _this.createRegistration(dependency.service);
            registration.factory = dependency.factory;
            registration.name = dependency.named;
            var throwOnError = dependency.required !== false &&
                api.throwResolveError === true;
            return {
                implementation: _this.resolveImpl(registration, throwOnError),
                dependency: dependency
            };
        })
            .filter(function (item) { return item.implementation || item.dependency.required === false ? true : false; });
        if (items.length !== api.dependenciesValue.length)
            return [];
        return items.map(function (item) {
            var baseRegistration = item.dependency.required === false ? _this.createRegistration(item.dependency.service)
                : item.implementation.cloneFor(_this);
            baseRegistration.factory = item.dependency.factory;
            baseRegistration.name = item.dependency.named;
            baseRegistration.initializer = item.dependency.initializer;
            baseRegistration.disposer = undefined;
            baseRegistration.scope = _this._dependencyScope;
            baseRegistration.owner = _this._dependencyOwner;
            return baseRegistration;
        });
    };
    InternalContainer.prototype.resolveWithDepBase = function (api) {
        var child = this.createChild();
        var registration = this.createRegistration(api.serviceValue);
        registration.args = api.argsValue;
        registration.name = api.nameValue;
        var implementation = this.resolveImpl(registration, api.throwResolveError);
        var baseRegistration = implementation.cloneFor(child);
        baseRegistration.args = api.argsValue;
        baseRegistration.name = api.nameValue;
        baseRegistration.disposer = undefined;
        baseRegistration.scope = this._dependencyScope;
        baseRegistration.owner = this._dependencyOwner;
        var regoes = this.createDependenciesRegistration(api);
        if (regoes.length <= 0)
            return null;
        regoes.push(baseRegistration);
        child.add(regoes);
        return child.resolveBase(baseRegistration, api.throwResolveError);
    };
    InternalContainer.prototype.addToCache = function (value, api) {
        var name;
        if (api.cacheValue.name) {
            name = api.cacheValue.name;
        }
        else if (api.nameValue) {
            name = api.nameValue;
        }
        else if (api.serviceValue['name']) {
            name = api.serviceValue['name'];
        }
        else if (typeof api.serviceValue === 'string') {
            name = api.serviceValue;
        }
        else {
            throw new Exceptions.ResolutionError('Missing cache name');
        }
        this._cache[name] = value;
    };
    InternalContainer.prototype.instantiate = function (type) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var key = Utils.Reflection.ReflectionKey;
        var dependencies = Reflect.getMetadata("design:paramtypes", type) || [];
        if ((!type[key]) &&
            dependencies.length <= 0) {
            return Utils.Reflection.construct(type, args);
        }
        var bucket = (type[key] || {});
        var params = dependencies
            .map(function (dependancy, index) {
            if (!bucket[index])
                return _this.resolve(dependancy);
            var depParams = bucket[index];
            if (depParams.value)
                return depParams.value;
            var container = depParams.container || _this;
            var resolutionItem = depParams.service || dependancy;
            var resolution = container.resolveWith(resolutionItem);
            if (depParams.args.length)
                resolution.args(depParams.args);
            if (depParams.name)
                resolution.name(params.name);
            if (depParams.attempt === true)
                resolution.attempt();
            if (depParams.cache.use === true)
                resolution.cache(params.cache.name);
            return resolution.exec();
        });
        return Utils.Reflection.construct(type, params);
    };
    return InternalContainer;
})();
exports.InternalContainer = InternalContainer;
//# sourceMappingURL=internalContainer.js.map