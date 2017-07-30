/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/


"use strict";

import { NullReferenceError, ResolutionError } from '../exceptions';
import { Reflection } from '../utils';
import { Scope, Owner } from '../types';

import Internal = Typeioc.Internal;


export class InternalContainer implements Internal.IContainer {

    private parent : InternalContainer ;
    private children : InternalContainer [] = [];
    private _disposableStorage : Internal.IDisposableStorage;
    private _collection : Internal.IRegistrationStorage;
    private _cache : Internal.IIndexedCollection<any>;
    private _dependencyScope = Scope.None;
    private _dependencyOwner = Owner.Externals;

    constructor(private _registrationStorageService : Internal.IRegistrationStorageService,
                private _disposableStorageService : Internal.IIDisposableStorageService,
                private _registrationBaseService : Internal.IRegistrationBaseService,
                private _containerApiService : Internal.IContainerApiService,
                private _resolutionDetails? : Internal.IDecoratorResolutionParamsData) {

        this._collection = this._registrationStorageService.create();
        this._disposableStorage = this._disposableStorageService.create();
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

        if(!registration.factory && !registration.factoryType){
            var exception = new NullReferenceError("Factory/Type is not defined");
            exception.data = registration.service;
            throw exception;
        }

        registration.container = this;

        this._collection.addEntry(registration);
    }

    private resolveBase(registration : Internal.IRegistrationBase, throwIfNotFound : boolean) : any {

        var entry = this.resolveImpl(registration, throwIfNotFound);
      
        if(!entry && throwIfNotFound === false) {
            return null;  
        }
        
        entry.args = registration.args;

        return this.resolveScope(entry, throwIfNotFound);
    }

    private resolveImpl(registration : Internal.IRegistrationBase, throwIfNotFound : boolean) : Internal.IRegistrationBase {

        var serviceEntry = this._collection.getEntry(registration);

        if(!serviceEntry  && this.parent) {
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

    private createTrackable(registration : Internal.IRegistrationBase, throwIfNotFound : boolean) : any {

        try {
        
            let instance = registration.invoke();

            if(registration.forInstantiation === true) {

                instance = this.instantiate(instance, registration, throwIfNotFound);
            }

            if(registration.initializer) {
                instance = registration.initializer(this, instance);
            }

            if(registration.owner === Owner.Container &&
                registration.disposer) {

                this._disposableStorage.add(instance, registration.disposer);
            }

            return instance;
        } catch (error) {
            const exception = new ResolutionError('Could not instantiate service');
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

            if((!dependency.factory && !dependency.factoryType) ||
                (dependency.factory && dependency.factoryType)) {
                const exception = new ResolutionError('Factory or Factory type should be defined');
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

    private resolveWithDepBase<R>(api : Internal.IContainerApi<R>) : R {
        var child = <InternalContainer>this.createChild();

        var registration = this.createRegistration(api.serviceValue);
        registration.args = api.argsValue;
        registration.name = api.nameValue;

        var implementation = this.resolveImpl(registration, api.throwResolveError);
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

        this._cache[name] = value;
    }

    private instantiate(type : any, registration : Internal.IRegistrationBase, throwIfNotFound : boolean) {
        
        var dependencies = Reflection.getMetadata(Reflect, type);
        
        if(registration.args.length) {
            return Reflection.construct(type, registration.args);
        }

        if(registration.params.length) {
            const params = registration.params
            .map(item => { 
                const dependancy = registration.dependenciesValue.filter(d => d.service === item)[0];
                const depName = dependancy ? dependancy.named : null;

                if(throwIfNotFound === true) {
                    return !!depName ? this.resolveNamed(item, depName) : this.resolve(item);
                }

                return !!depName ? this.tryResolveNamed(item, depName) : this.tryResolve(item);
            });

            return Reflection.construct(type, params);
        }

        var params = dependencies
            .map((dependancy, index) => {

                let depParams = this._resolutionDetails ? this._resolutionDetails.tryGet(type) : null;
                let depParamsValue = depParams ? depParams[index] : null;

                if(!depParamsValue) {
                    return this.resolve(dependancy);
                }

                if(depParamsValue.value) {
                    return depParamsValue.value;
                }

                let resolutionItem = depParamsValue.service || dependancy;
                let resolution = this.resolveWith(resolutionItem);

                if(depParamsValue.args && depParamsValue.args.length)
                    resolution.args(...depParamsValue.args);

                if(depParamsValue.name)
                    resolution.name(depParamsValue.name);

                if(depParamsValue.attempt === true)
                    resolution.attempt();

                if(depParamsValue.cache && depParamsValue.cache.use === true)
                    resolution.cache(depParamsValue.cache.name);

                return resolution.exec();
            });

        return Reflection.construct(type, params);
    }
}