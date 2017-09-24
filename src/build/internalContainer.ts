/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.2
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

"use strict";

import { ResolutionError } from '../exceptions';
import { Scope, Owner } from '../types';

import Internal = Typeioc.Internal;

export class InternalContainer implements Internal.IContainer {

    private parent : InternalContainer;
    private children : InternalContainer [] = [];
    private _disposableStorage : Internal.IDisposableStorage;
    private _collection : Internal.IRegistrationStorage;
    private _cache : Internal.IIndexedCollection<any>;
    private _invoker : Internal.IInvoker;
    private _dependencyScope = Scope.None;
    private _dependencyOwner = Owner.Externals;

    constructor(private _registrationStorageService : Internal.IRegistrationStorageService,
                private _disposableStorageService : Internal.IIDisposableStorageService,
                private _registrationBaseService : Internal.IRegistrationBaseService,
                private _containerApiService : Internal.IContainerApiService,
                private _invokerService : Internal.IInvokerService,
                private _resolutionDetails? : Internal.IDecoratorResolutionParamsData) {

        this._collection = this._registrationStorageService.create();
        this._disposableStorage = this._disposableStorageService.create();
        this._invoker = this._invokerService.create(this, _resolutionDetails);
        this._cache = {};

        this.registerImpl = this.registerImpl.bind(this);
    }

    public get cache() : Internal.IIndexedCollection<any> {
        return this._cache;
    }

    public add(registrations : Internal.IRegistrationBase[]) {

        registrations.forEach(this.registerImpl);
    }

    public createChild() : Typeioc.IContainer {

        var child = new InternalContainer (
            this._registrationStorageService,
            this._disposableStorageService,
            this._registrationBaseService,
            this._containerApiService,
            this._invokerService,
            this._resolutionDetails);
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

        this._collection.clear();
        
        for (var member in this._cache)
            delete this._cache[member];

    }
    
    public disposeAsync() : Promise<void> {
        throw 'Not implemented';
    }

    public resolve<R>(service: any, ...args:any[]) : R {
        var rego = this.createRegistration(service);
        rego.args = args;

        return this.resolveBase(rego, true);
    }
    
    public resolveAsync<R>(service: any, ...args:any[]) : Promise<R> {
    
        throw 'Not implemented';
    }
    
    public tryResolve<R>(service: any, ...args:any[]) : R {
        var rego = this.createRegistration(service);
        rego.args = args;

        return this.resolveBase(rego, false);
    }
    
    public tryResolveAsync<R>(service: any, ...args:any[]) : Promise<R> {
        
        throw 'Not implemented';
    } 
    
    public resolveNamed<R>(service: any, name : string, ...args:any[]) : R {
        var rego = this.createRegistration(service);
        rego.name = name;
        rego.args = args;

        return this.resolveBase(rego, true);
    }
    
    public resolveNamedAsync<R>(service: R, name : string, ...args:any[]) : Promise<R> {
        throw 'Not implemented';
    }
    
    public tryResolveNamed<R>(service: any, name : string, ...args:any[]) : R {
        var rego = this.createRegistration(service);
        rego.name = name;
        rego.args = args;

        return this.resolveBase(rego, false);
    }
    
    public tryResolveNamedAsync<R>(service: R, name : string, ...args:any[]) : Promise<R> {
        throw 'Not implemented';
    }

    public resolveWithDependencies<R>(service: any, dependencies : Typeioc.IDynamicDependency[]) : R {

        var api = this._containerApiService.create<R>(undefined);
        api.service(service)
            .dependencies(dependencies);

        return this.resolveWithDepBase<R>(api);
    }
    
    public resolveWithDependenciesAsync<R>(service: R, dependencies : Typeioc.IDynamicDependency[]) : Promise<R> {
        throw 'Not implemented';
    }
    
    public resolveWith<R>(service : any) : Typeioc.IResolveWith<R> {

        var importApi : Internal.IImportApi<R> = {
            execute : (api : Internal.IContainerApi<R>) : R => {

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

    private registerImpl(registration : Internal.IRegistrationBase) : void {

        registration.checkRegistrationType();
        registration.container = this;

        this._collection.addEntry(registration);
    }

    private resolveBase(registration : Internal.IRegistrationBase, throwIfNotFound : boolean) : any {

        var entry = this.resolveImpl(registration, throwIfNotFound);
      
        if(!entry && throwIfNotFound === false) {
            return null;  
        }

        // ------------ with args always returns new instance ...
        if(registration.args && registration.args.length) {
            return this.createTrackable(entry, throwIfNotFound, registration.args);
        }
        
        return this.resolveScope(entry, throwIfNotFound);
    }

    private resolveImpl(registration : Internal.IRegistrationBase, throwIfNotFound : boolean) : Internal.IRegistrationBase {

        var serviceEntry = this._collection.getEntry(registration);

        if(!serviceEntry && this.parent) {
            return this.parent.resolveImpl(registration, throwIfNotFound);
        }

        if(!serviceEntry  && throwIfNotFound === true) {
            var exception = new ResolutionError('Could not resolve service');
            exception.data = registration.service;
            throw exception;
        }

        return serviceEntry;
    }

    private resolveScope(registration : Internal.IRegistrationBase,
                         throwIfNotFound : boolean) : any {

        switch(registration.scope) {
            case Typeioc.Types.Scope.None:
                return this.createTrackable(registration, throwIfNotFound);

            case Scope.Container:
                return this.resolveContainerScope(registration, throwIfNotFound);

            case Scope.Hierarchy :
                return this.resolveHierarchyScope(registration, throwIfNotFound);

            default:
                throw new ResolutionError('Unknown scoping');
        }
    }

    private resolveContainerScope(registration : Internal.IRegistrationBase, throwIfNotFound : boolean) : any {
        let entry : Internal.IRegistrationBase;

        if(registration.container !== this) {
            entry = registration.cloneFor(this);
            this._collection.addEntry(entry);
        } else {
            entry = registration;
        }

        if(!entry.instance) {
            entry.instance = this.createTrackable(entry, throwIfNotFound);
        }

        return entry.instance;
    }

    private resolveHierarchyScope(registration : Internal.IRegistrationBase, throwIfNotFound : boolean) : any {
        if(registration.container &&
            registration.container !== this) {

            const container = <InternalContainer>registration.container;

            return container.resolveBase(registration, throwIfNotFound);
        }

        if(!registration.instance) {
            registration.instance = this.createTrackable(registration, throwIfNotFound);
        }

        return registration.instance;
    }

    private createTrackable(registration : Internal.IRegistrationBase, throwIfNotFound : boolean, args?: Array<any>) : any {
        try {
            let instance = this._invoker.invoke(registration, throwIfNotFound, args);

            if(registration.initializer) {
                instance = registration.initializer(this, instance);
            }

            if(registration.owner === Owner.Container &&
                registration.disposer) {
                this._disposableStorage.add(instance, registration.disposer);
            }

            return instance;
        } catch (error) {
            let message = 'Could not instantiate service';

            if(error instanceof ResolutionError) {
                message += '. ' + error.message;
            }

            const exception = new ResolutionError(message);
            exception.data = registration.service;
            exception.innerError = error;
            throw exception;
        }
    }

    private createRegistration(service: any) : Internal.IRegistrationBase {
        return this._registrationBaseService.create(service);
    }

    private createDependenciesRegistration<R>(api : Internal.IContainerApi<R>)
    : Array<Internal.IRegistrationBase> {

        const items = api.dependenciesValue.map(dependency => {

            if(!dependency.service) {
                const exception = new ResolutionError('Service is not defined');
                exception.data = dependency;
                throw exception;
            }

            const registration = this.createRegistration(dependency.service);
            registration.copyDependency(dependency);
            registration.checkRegistrationType();
            
            const throwOnError = dependency.required !== false &&
                               api.throwResolveError === true;

            return {
                implementation : this.resolveImpl(registration, throwOnError),
                dependency
            };
        })
        .filter(item => item.implementation ||
                        item.dependency.required === false ? true : false);

        if(items.length !== api.dependenciesValue.length) return [];

        return items.map(item => {
            var baseRegistration = item.dependency.required === false ?
                this.createRegistration(item.dependency.service)
                : item.implementation.cloneFor(this);

            baseRegistration.copyDependency(item.dependency);
            baseRegistration.disposer = undefined;
            baseRegistration.scope = this._dependencyScope;
            baseRegistration.owner = this._dependencyOwner;

            return baseRegistration;
        });
    }

    private resolveWithDepBase<R>(api : Internal.IContainerApi<R>) : R {
        var child = <InternalContainer>this.createChild();

        var registration = this.createRegistration(api.serviceValue);
        registration.args = api.argsValue;
        registration.name = api.nameValue;

        var implementation = this.resolveImpl(registration, api.throwResolveError);
        if(!implementation && api.throwResolveError === false) {
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

        if(regoes.length <= 0) {
            return null;
        }

        regoes.push(baseRegistration);

        child.add(regoes);

        return <R>child.resolveBase(baseRegistration, api.throwResolveError);
    }

    private addToCache(value : any, api : Internal.IContainerApi<{}>) : void {
        var name : any;

        if(api.cacheValue.name) {
            name = api.cacheValue.name;
        } else
        if(api.nameValue) {
            name = api.nameValue;
        } else
        if((<{name : string}>api.serviceValue).name) {
            name = (<{name : string}>api.serviceValue).name;
        } else
        if(typeof api.serviceValue === 'string') {
            name = api.serviceValue;
        } else {
            throw new ResolutionError('Missing cache name');
        }

        Object.defineProperty(this._cache, name, {
            value,
            writable : true,
            enumerable : true,
            configurable : true
        });
    }
}