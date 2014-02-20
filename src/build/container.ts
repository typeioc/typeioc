/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Exceptions = require('../exceptions/index');

export class Container implements Typeioc.Internal.IContainer {

    private parent : Container;
    private children : Container[] = [];
    private _disposableStorage : Typeioc.Internal.IDisposableStorage;
    private _collection : Typeioc.Internal.IRegistrationStorage;

    constructor(private _registrationStorageService : Typeioc.Internal.IRegistrationStorageService,
                private _disposableStorageService : Typeioc.Internal.IIDisposableStorageService,
                private _registrationBaseService : Typeioc.Internal.IRegistrationBaseService) {

        this._collection = this._registrationStorageService.create();
        this._disposableStorage = this._disposableStorageService.create();
    }

    public import(registrations : Typeioc.Internal.IRegistrationBase[]) {
        var self = this;

        registrations.forEach(function(item : Typeioc.Internal.IRegistrationBase) {

            self.registerImpl(item);
        });
    }

    public createChild() : Typeioc.IContainer {

        var child = new Container(
            this._registrationStorageService,
            this._disposableStorageService,
            this._registrationBaseService
        );
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

    private registerImpl(registration : Typeioc.Internal.IRegistrationBase) : void {

        if(!registration.factory)
            throw new Exceptions.ArgumentNullError("Factory is not defined for: " + registration.service.name);

        registration.container = this;

        this._collection.addEntry(registration);
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

        if(!serviceEntry  && throwIfNotFound === true) throw new Exceptions.ResolutionError('Could not resolve service');

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

    private resolveContainerScope(registration : Typeioc.Internal.IRegistrationBase) {
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

    private resolveHierarchyScope(registration : Typeioc.Internal.IRegistrationBase, throwIfNotFound : boolean) {
        if(registration.container &&
            registration.container !== this) {

            var container = <Container>registration.container;

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
}