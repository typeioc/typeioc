/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const utils_1 = require("../utils");
const types_1 = require("../types");
class InternalContainer {
    constructor(_registrationStorageService, _disposableStorageService, _registrationBaseService, _containerApiService, _resolutionDetails) {
        this._registrationStorageService = _registrationStorageService;
        this._disposableStorageService = _disposableStorageService;
        this._registrationBaseService = _registrationBaseService;
        this._containerApiService = _containerApiService;
        this._resolutionDetails = _resolutionDetails;
        this.children = [];
        this._dependencyScope = types_1.Scope.None;
        this._dependencyOwner = types_1.Owner.Externals;
        this._collection = this._registrationStorageService.create();
        this._disposableStorage = this._disposableStorageService.create();
        this._cache = {};
        this.registerImpl = this.registerImpl.bind(this);
    }
    get cache() {
        return this._cache;
    }
    add(registrations) {
        registrations.forEach(this.registerImpl);
    }
    createChild() {
        var child = new InternalContainer(this._registrationStorageService, this._disposableStorageService, this._registrationBaseService, this._containerApiService, this._resolutionDetails);
        child.parent = this;
        this.children.push(child);
        return child;
    }
    dispose() {
        this._disposableStorage.disposeItems();
        while (this.children.length > 0) {
            var item = this.children.pop();
            item.dispose();
        }
    }
    disposeAsync() {
        throw 'Not implemented';
    }
    resolve(service, ...args) {
        var rego = this.createRegistration(service);
        rego.args = args;
        return this.resolveBase(rego, true);
    }
    resolveAsync(service, ...args) {
        throw 'Not implemented';
    }
    tryResolve(service, ...args) {
        var rego = this.createRegistration(service);
        rego.args = args;
        return this.resolveBase(rego, false);
    }
    tryResolveAsync(service, ...args) {
        throw 'Not implemented';
    }
    resolveNamed(service, name, ...args) {
        var rego = this.createRegistration(service);
        rego.name = name;
        rego.args = args;
        return this.resolveBase(rego, true);
    }
    resolveNamedAsync(service, name, ...args) {
        throw 'Not implemented';
    }
    tryResolveNamed(service, name, ...args) {
        var rego = this.createRegistration(service);
        rego.name = name;
        rego.args = args;
        return this.resolveBase(rego, false);
    }
    tryResolveNamedAsync(service, name, ...args) {
        throw 'Not implemented';
    }
    resolveWithDependencies(service, dependencies) {
        var api = this._containerApiService.create(undefined);
        api.service(service)
            .dependencies(dependencies);
        return this.resolveWithDepBase(api);
    }
    resolveWithDependenciesAsync(service, dependencies) {
        throw 'Not implemented';
    }
    resolveWith(service) {
        var importApi = {
            execute: (api) => {
                var result;
                if (api.isDependenciesResolvable) {
                    result = this.resolveWithDepBase(api);
                }
                else {
                    var rego = this.createRegistration(api.serviceValue);
                    rego.name = api.nameValue;
                    rego.args = api.argsValue;
                    result = this.resolveBase(rego, api.throwResolveError);
                }
                if (result && api.cacheValue.use === true) {
                    this.addToCache(result, api);
                }
                return result;
            }
        };
        var api = this._containerApiService.create(importApi);
        return api.service(service);
    }
    registerImpl(registration) {
        if (!registration.factory && !registration.factoryType) {
            var exception = new exceptions_1.NullReferenceError("Factory/Type is not defined");
            exception.data = registration.service;
            throw exception;
        }
        registration.container = this;
        this._collection.addEntry(registration);
    }
    resolveBase(registration, throwIfNotFound) {
        var entry = this.resolveImpl(registration, throwIfNotFound);
        if (!entry && throwIfNotFound === false) {
            return null;
        }
        // ------------ with args always returns new instance ...
        if (registration.args && registration.args.length) {
            return this.createTrackable(entry, throwIfNotFound, registration.args);
        }
        return this.resolveScope(entry, throwIfNotFound);
    }
    resolveImpl(registration, throwIfNotFound) {
        var serviceEntry = this._collection.getEntry(registration);
        if (!serviceEntry && this.parent) {
            return this.parent.resolveImpl(registration, throwIfNotFound);
        }
        if (!serviceEntry && throwIfNotFound === true) {
            var exception = new exceptions_1.ResolutionError('Could not resolve service');
            exception.data = registration.service;
            throw exception;
        }
        return serviceEntry;
    }
    resolveScope(registration, throwIfNotFound) {
        switch (registration.scope) {
            case 1 /* None */:
                return this.createTrackable(registration, throwIfNotFound);
            case types_1.Scope.Container:
                return this.resolveContainerScope(registration, throwIfNotFound);
            case types_1.Scope.Hierarchy:
                return this.resolveHierarchyScope(registration, throwIfNotFound);
            default:
                throw new exceptions_1.ResolutionError('Unknown scoping');
        }
    }
    resolveContainerScope(registration, throwIfNotFound) {
        let entry;
        if (registration.container !== this) {
            entry = registration.cloneFor(this);
            this._collection.addEntry(entry);
        }
        else {
            entry = registration;
        }
        if (!entry.instance) {
            entry.instance = this.createTrackable(entry, throwIfNotFound);
        }
        return entry.instance;
    }
    resolveHierarchyScope(registration, throwIfNotFound) {
        if (registration.container &&
            registration.container !== this) {
            const container = registration.container;
            return container.resolveBase(registration, throwIfNotFound);
        }
        if (!registration.instance) {
            registration.instance = this.createTrackable(registration, throwIfNotFound);
        }
        return registration.instance;
    }
    createTrackable(registration, throwIfNotFound, args) {
        try {
            let instance = registration.invoke(args);
            if (registration.forInstantiation === true) {
                instance = this.instantiate(instance, registration, throwIfNotFound, args);
            }
            if (registration.initializer) {
                instance = registration.initializer(this, instance);
            }
            if (registration.owner === types_1.Owner.Container &&
                registration.disposer) {
                this._disposableStorage.add(instance, registration.disposer);
            }
            return instance;
        }
        catch (error) {
            let message = 'Could not instantiate service';
            if (error instanceof exceptions_1.ResolutionError) {
                message += '. ' + error.message;
            }
            const exception = new exceptions_1.ResolutionError(message);
            exception.data = registration.service;
            exception.innerError = error;
            throw exception;
        }
    }
    createRegistration(service) {
        return this._registrationBaseService.create(service);
    }
    createDependenciesRegistration(api) {
        const items = api.dependenciesValue.map(dependency => {
            if (!dependency.service) {
                const exception = new exceptions_1.ResolutionError('Service is not defined');
                exception.data = dependency;
                throw exception;
            }
            if ((!dependency.factory && !dependency.factoryType) ||
                (dependency.factory && dependency.factoryType)) {
                const exception = new exceptions_1.ResolutionError('Factory or Factory type should be defined');
                exception.data = dependency;
                throw exception;
            }
            const registration = this.createRegistration(dependency.service);
            registration.factory = dependency.factory;
            registration.factoryType = dependency.factoryType;
            registration.name = dependency.named;
            const throwOnError = dependency.required !== false &&
                api.throwResolveError === true;
            return {
                implementation: this.resolveImpl(registration, throwOnError),
                dependency
            };
        })
            .filter(item => item.implementation ||
            item.dependency.required === false ? true : false);
        if (items.length !== api.dependenciesValue.length)
            return [];
        return items.map(item => {
            var baseRegistration = item.dependency.required === false ?
                this.createRegistration(item.dependency.service)
                : item.implementation.cloneFor(this);
            baseRegistration.factoryType = item.dependency.factoryType;
            baseRegistration.factory = item.dependency.factory;
            baseRegistration.name = item.dependency.named;
            baseRegistration.initializer = item.dependency.initializer;
            baseRegistration.disposer = undefined;
            baseRegistration.scope = this._dependencyScope;
            baseRegistration.owner = this._dependencyOwner;
            return baseRegistration;
        });
    }
    resolveWithDepBase(api) {
        var child = this.createChild();
        var registration = this.createRegistration(api.serviceValue);
        registration.args = api.argsValue;
        registration.name = api.nameValue;
        var implementation = this.resolveImpl(registration, api.throwResolveError);
        if (!implementation && api.throwResolveError === false) {
            return null;
        }
        var baseRegistration = implementation.cloneFor(child);
        baseRegistration.args = api.argsValue;
        baseRegistration.name = api.nameValue;
        baseRegistration.disposer = undefined;
        baseRegistration.dependenciesValue = api.dependenciesValue;
        baseRegistration.scope = this._dependencyScope;
        baseRegistration.owner = this._dependencyOwner;
        var regoes = this.createDependenciesRegistration(api);
        if (regoes.length <= 0) {
            return null;
        }
        regoes.push(baseRegistration);
        child.add(regoes);
        return child.resolveBase(baseRegistration, api.throwResolveError);
    }
    addToCache(value, api) {
        var name;
        if (api.cacheValue.name) {
            name = api.cacheValue.name;
        }
        else if (api.nameValue) {
            name = api.nameValue;
        }
        else if (api.serviceValue.name) {
            name = api.serviceValue.name;
        }
        else if (typeof api.serviceValue === 'string') {
            name = api.serviceValue;
        }
        else {
            throw new exceptions_1.ResolutionError('Missing cache name');
        }
        this._cache[name] = value;
    }
    instantiate(type, registration, throwIfNotFound, args) {
        if (args && args.length &&
            registration.params.length) {
            const exception = new exceptions_1.ResolutionError('Could not instantiate type. Arguments and dependencies are not allowed for simultaneous resolution. Pick dependencies or arguments');
            exception.data = type;
            throw exception;
        }
        if (args && args.length) {
            return utils_1.Reflection.construct(type, args);
        }
        if (registration.params.length) {
            const params = registration.params
                .map(item => {
                const dependancy = registration.dependenciesValue.filter(d => d.service === item)[0];
                const depName = dependancy ? dependancy.named : null;
                if (throwIfNotFound === true) {
                    return !!depName ? this.resolveNamed(item, depName) : this.resolve(item);
                }
                return !!depName ? this.tryResolveNamed(item, depName) : this.tryResolve(item);
            });
            return utils_1.Reflection.construct(type, params);
        }
        const dependencies = utils_1.Reflection.getMetadata(Reflect, type);
        const params = dependencies
            .map((dependancy, index) => {
            let depParams = this._resolutionDetails ? this._resolutionDetails.tryGet(type) : null;
            let depParamsValue = depParams ? depParams[index] : null;
            if (!depParamsValue) {
                return this.resolve(dependancy);
            }
            if (depParamsValue.value) {
                return depParamsValue.value;
            }
            let resolutionItem = depParamsValue.service || dependancy;
            let resolution = this.resolveWith(resolutionItem);
            if (depParamsValue.args && depParamsValue.args.length)
                resolution.args(...depParamsValue.args);
            if (depParamsValue.name)
                resolution.name(depParamsValue.name);
            if (depParamsValue.attempt === true)
                resolution.attempt();
            if (depParamsValue.cache && depParamsValue.cache.use === true)
                resolution.cache(depParamsValue.cache.name);
            return resolution.exec();
        });
        return utils_1.Reflection.construct(type, params);
    }
}
exports.InternalContainer = InternalContainer;
//# sourceMappingURL=internalContainer.js.map