/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2014 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Exceptions = require('../exceptions/index');
import ApiContainer = require('./containerApi');


export class Container implements Typeioc.Internal.IContainer {

    private parent : Container;
    private children : Container[] = [];
    private _disposableStorage : Typeioc.Internal.IDisposableStorage;
    private _collection : Typeioc.Internal.IRegistrationStorage;

    private registerImpl : (registration : Typeioc.Internal.IRegistrationBase) => void;
    private resolveBase : (registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) => any;
    private resolveImpl : (registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) => Typeioc.Internal.IRegistrationBase;
    private resolveScope : (registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) => any;
    private resolveContainerScope : (registration : Typeioc.Internal.IRegistrationBase) => any;
    private resolveHierarchyScope : (registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) => any;
    private createTrackable : (registration : Typeioc.Internal.IRegistrationBase) => any;
    private createRegistration : (service: any) => Typeioc.Internal.IRegistrationBase;


    constructor(private _registrationStorageService : Typeioc.Internal.IRegistrationStorageService,
                private _disposableStorageService : Typeioc.Internal.IIDisposableStorageService,
                private _registrationBaseService : Typeioc.Internal.IRegistrationBaseService) {

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

    public import(registrations : Typeioc.Internal.IRegistrationBase[]) {

        registrations.forEach(this.registerImpl);
    }

    public createChild() : Typeioc.IContainer {

        var child = new Container(
            this._registrationStorageService,
            this._disposableStorageService,
            this._registrationBaseService);
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

        return <R>this.resolveBase(rego, false);
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

    //------------------------------------------------------------------------------------------------------------

    public resolveWithDep<R>(service: any,  ...dependencies : Typeioc.IDynamicDependency[]) : R {

        var child = <Container>this.createChild();

        var regoes = dependencies.map(dependency => {

            var registration = this.createRegistration(dependency.service);
            var implementation = this.resolveImpl(registration, true);
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

        return child.resolve<R>(service);
    }


    public resolveWith<R>(service : any) : Typeioc.IResolveWith<R> {

        var importApi : ApiContainer.IImportApi = {
            import : function<R>(api : ApiContainer.Api<R>) : R {

                var rego = this.createRegistration(service);

                return null;
            }
        }



        var api = new ApiContainer.Api<R>(importApi);

        return api.service.bind(api);
    }
}


function registerImpl(registration : Typeioc.Internal.IRegistrationBase) : void {

    if(!registration.factory)
    throw new Exceptions.ArgumentNullError("Factory is not defined for: " + registration.service.name);

    registration.container = this;

    this._collection.addEntry(registration);
}

function resolveBase(registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) : any {

    var entry = this.resolveImpl(registration, throwIfNotFound);

    if(!entry && throwIfNotFound === false) return null;
    entry.args = registration.args;

    return this.resolveScope(entry, throwIfNotFound);
}

function resolveImpl(registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) : Typeioc.Internal.IRegistrationBase {

    var serviceEntry = this._collection.getEntry(registration);

    if(!serviceEntry  && this.parent) {
        return this.parent.resolveImpl(registration, throwIfNotFound);
    }

    if(!serviceEntry  && throwIfNotFound === true) throw new Exceptions.ResolutionError('Could not resolve service');

    return serviceEntry;
}

function resolveScope(registration : Typeioc.Internal.IRegistrationBase,
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

function resolveContainerScope(registration : Typeioc.Internal.IRegistrationBase) : any {
    var entry : Typeioc.Internal.IRegistrationBase;

    if(registration.container !== this) {
        entry = registration.cloneFor(this);
        this._collection.addEntry(entry);
    } else {
        entry = registration;
    }

    if(!entry.instance) {
        entry.instance = this.createTrackable(entry);
    }

    return entry.instance;
}

function resolveHierarchyScope(registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) : any {
    if(registration.container &&
        registration.container !== this) {

        var container = <Container>registration.container;

        return resolveBase.bind(container)(registration, throwIfNotFound);
    }

    if(!registration.instance) {

        registration.instance = this.createTrackable(registration);
    }

    return registration.instance;
}

function createTrackable(registration : Typeioc.Internal.IRegistrationBase) : any {

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

function createRegistration(service: any) : Typeioc.Internal.IRegistrationBase {
    return this._registrationBaseService.create(service);
}