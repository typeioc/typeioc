/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/


'use strict';

import Exceptions = require('../exceptions/index');


export class InternalContainer implements Typeioc.Internal.IContainer {

    private parent : InternalContainer ;
    private children : InternalContainer [] = [];
    private _disposableStorage : Typeioc.Internal.IDisposableStorage;
    private _collection : Typeioc.Internal.IRegistrationStorage<Typeioc.Internal.IRegistrationBase>;
    private _cache : Typeioc.Internal.IIndexedCollection;
    private _dependencyScope = Typeioc.Types.Scope.None;
    private _dependencyOwner = Typeioc.Types.Owner.Externals;

    constructor(private _registrationStorageService : Typeioc.Internal.IRegistrationStorageService,
                private _disposableStorageService : Typeioc.Internal.IIDisposableStorageService,
                private _registrationBaseService : Typeioc.Internal.IRegistrationBaseService,
                private _containerApiService : Typeioc.Internal.IContainerApiService) {

        this._collection = this._registrationStorageService.create<Typeioc.Internal.IRegistrationBase>();
        this._disposableStorage = this._disposableStorageService.create();
        this._cache = {};
    }

    public get cache() : Typeioc.Internal.IIndexedCollection {
        return this._cache;
    }

    public add(registrations : Typeioc.Internal.IRegistrationBase[]) {

        var resolveImplementation = this.registerImpl.bind(this);

        registrations.forEach(resolveImplementation);
    }

    public createChild() : Typeioc.IContainer {

        var child = new InternalContainer (
            this._registrationStorageService,
            this._disposableStorageService,
            this._registrationBaseService,
            this._containerApiService);
        child.parent = this;
        this.children.push(child);
        return child;
    }

    public dispose() : void {

        this._disposableStorage.disposeItems();

        while(this.children.length > 0) {
            var item = this.children.pop();
            item.dispose();
        }
    }

    public resolve<R>(service: any, ...args:any[]) : R {
        var rego = this.createRegistration(service);
        rego.args = args;

        return this.resolveBase(rego, true);
    }

    public tryResolve<R>(service: any, ...args:any[]) : R {
        var rego = this.createRegistration(service);
        rego.args = args;

        return this.resolveBase(rego, false);
    }

    public resolveNamed<R>(service: any, name : string, ...args:any[]) : R {
        var rego = this.createRegistration(service);
        rego.name = name;
        rego.args = args;

        return this.resolveBase(rego, true);
    }

    public tryResolveNamed<R>(service: any, name : string, ...args:any[]) : R {
        var rego = this.createRegistration(service);
        rego.name = name;
        rego.args = args;

        return this.resolveBase(rego, false);
    }

    public resolveWithDependencies<R>(service: any, dependencies : Typeioc.IDynamicDependency[]) : R {

        var api = this._containerApiService.create<R>(undefined);
        api.service(service)
            .dependencies(dependencies);

        return this.resolveWithDepBase<R>(api);
    }

    public resolveWith<R>(service : any) : Typeioc.IResolveWith<R> {

        var importApi : Typeioc.Internal.IImportApi<R> = {
            execute : (api : Typeioc.Internal.IContainerApi<R>) : R => {

                var result;

                if(api.isDependenciesResolvable) {
                    result = this.resolveWithDepBase(api);
                } else {
                    var rego = this.createRegistration(api.serviceValue);
                    rego.name = api.nameValue;
                    rego.args = api.argsValue;

                    result = this.resolveBase(rego, api.throwResolveError);
                }

                if(result && api.cacheValue.use === true) {

                    this.addToCache(result, api);
                }

                return result;
            }
        };

        var api = this._containerApiService.create<R>(importApi);

        return api.service(service);
    }

    private registerImpl(registration : Typeioc.Internal.IRegistrationBase) : void {

        if(!registration.factory){
            var exception = new Exceptions.NullReferenceError("Factory is not defined");
            exception.data = registration.service;
            throw exception;
        }

        registration.container = this;

        this._collection.addEntry(registration, () => registration);
    }

    private resolveBase(registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) : any {

        var entry = this.resolveImpl(registration, throwIfNotFound);

        if(!entry && throwIfNotFound === false) return null;
        entry.args = registration.args;

        return this.resolveScope(entry, throwIfNotFound);
    }

    private resolveImpl(registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) : Typeioc.Internal.IRegistrationBase {

        var serviceEntry = this._collection.getEntry(registration);

        if(!serviceEntry  && this.parent) {
            return this.parent.resolveImpl(registration, throwIfNotFound);
        }

        if(!serviceEntry  && throwIfNotFound === true) {
            var exception = new Exceptions.ResolutionError('Could not resolve service');
            exception.data = registration.service;
            throw exception;
        }

        return serviceEntry;
    }

    private resolveScope(registration : Typeioc.Internal.IRegistrationBase,
                         throwIfNotFound : boolean) : any {

        switch(registration.scope) {
            case Typeioc.Types.Scope.None:
                return this.createTrackable(registration);

            case Typeioc.Types.Scope.Container:

                return this.resolveContainerScope(registration);

            case Typeioc.Types.Scope.Hierarchy :

                return this.resolveHierarchyScope(registration, throwIfNotFound);

            default:
                throw new Exceptions.ResolutionError('Unknown scoping');
        }
    }

    private resolveContainerScope(registration : Typeioc.Internal.IRegistrationBase) : any {
        var entry : Typeioc.Internal.IRegistrationBase;

        if(registration.container !== this) {
            entry = registration.cloneFor(this);
            this._collection.addEntry(entry, () => entry);
        } else {
            entry = registration;
        }

        if(!entry.instance) {
            entry.instance = this.createTrackable(entry);
        }

        return entry.instance;
    }

    private resolveHierarchyScope(registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) : any {
        if(registration.container &&
            registration.container !== this) {

            var container = <InternalContainer>registration.container;

            return container.resolveBase(registration, throwIfNotFound);
        }

        if(!registration.instance) {

            registration.instance = this.createTrackable(registration);
        }

        return registration.instance;
    }

    private createTrackable(registration : Typeioc.Internal.IRegistrationBase) : any {

        var instance = registration.invoker();

        if(registration.owner === Typeioc.Types.Owner.Container &&
            registration.disposer) {

            this._disposableStorage.add(instance, registration.disposer);
        }

        if(registration.initializer) {
            registration.initializer(this, instance);
        }

        return instance;
    }

    private createRegistration(service: any) : Typeioc.Internal.IRegistrationBase {
        return this._registrationBaseService.create(service);
    }

    private createDependenciesRegistration<R>(api : Typeioc.Internal.IContainerApi<R>)
    : Array<Typeioc.Internal.IRegistrationBase> {

        var items = api.dependenciesValue.map(dependency => {

            if(!dependency.service) {
                var exception = new Exceptions.ResolutionError('Service is not defined');
                exception.data = dependency;
                throw exception;
            }

            if(!dependency.factory) {
                var exception = new Exceptions.ResolutionError('Factory is not defined');
                exception.data = dependency;
                throw exception;
            }

            var registration = this.createRegistration(dependency.service);
            registration.factory = dependency.factory;
            registration.name = dependency.named;

            var throwOnError = dependency.required !== false &&
                               api.throwResolveError === true;

            return {
                implementation : this.resolveImpl(registration, throwOnError),
                dependency : dependency
            };
        })
        .filter(item => item.implementation || item.dependency.required === false ? true : false);

        if(items.length !== api.dependenciesValue.length) return [];

        return items.map(item => {
            var baseRegistration = item.dependency.required === false ? this.createRegistration(item.dependency.service)
                : item.implementation.cloneFor(this);

            baseRegistration.factory = item.dependency.factory;
            baseRegistration.name = item.dependency.named;
            baseRegistration.initializer = item.dependency.initializer;
            baseRegistration.disposer = undefined;
            baseRegistration.scope = this._dependencyScope;
            baseRegistration.owner = this._dependencyOwner;

            return baseRegistration;
        });
    }

    private resolveWithDepBase<R>(api : Typeioc.Internal.IContainerApi<R>) : R {
        var child = <InternalContainer>this.createChild();

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

        if(regoes.length <= 0) return null;

        regoes.push(baseRegistration);

        child.add(regoes);

        return <R>child.resolveBase(baseRegistration, api.throwResolveError);
    }

    private addToCache(value : any, api : Typeioc.Internal.IContainerApi<{}>) : void {
        var name : any;

        if(api.cacheValue.name) {
            name = api.cacheValue.name;
        } else
        if(api.nameValue) {
            name = api.nameValue;
        } else
        if(api.serviceValue['name']) {
            name = api.serviceValue['name'];
        } else
        if(typeof api.serviceValue === 'string') {
            name = api.serviceValue;
        } else {
            throw new Exceptions.ResolutionError('Missing cache name');
        }

        this._cache[name] = value;
    }
}