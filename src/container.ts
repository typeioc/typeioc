/// <reference path="../d.ts/node.d.ts" />
/// <reference path="../d.ts/typeioc.d.ts" />

'use strict';

import Exceptions = require('./exceptions');
import RegistrationBaseModule = require('./registrationBase');
import InternalStorageModule = require('./internalStorage');
import DisposableStorageModule = require('./disposableStorage');

var weak = require('weak');


export class Container implements Typeioc.IContainer {

    private weakRef = weak;
    private collection : Typeioc.IInternalStorage;

    private disposables : Typeioc.IDisposableStorage;
    private parent : Container;
    private children : Container[] = [];

    constructor(registrations? : Typeioc.IRegistrationBase[]) {
        this.collection =  new InternalStorageModule.InternalStorage();
        this.disposables = new DisposableStorageModule.DisposableStorage();

        if(registrations) {
            this.import(registrations);
        }
    }

    public createChild() : Typeioc.IContainer {

        var child = new Container();
        child.parent = this;
        this.children.push(child);
        return child;
    }

    public dispose() : void {

        this.disposables.disposeItems();

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

    private import(registrations : Typeioc.IRegistrationBase[]) {
        var self = this;

        registrations.forEach(function(item : Typeioc.IRegistrationBase) {

            self.registerImpl(item);
        });
    }

    private registerImpl(registration : Typeioc.IRegistrationBase) : void {

        if(!registration.factory)
            throw new Exceptions.ArgumentNullError("Factory is not defined for: " + registration.service.name);

        registration.container = this;

        this.collection.addEntry(registration);
    }

    private resolveBase(registration : Typeioc.IRegistrationBase, throwIfNotFound : boolean) : any {

        var entry = this.resolveImpl(registration, throwIfNotFound);

        if(!entry && throwIfNotFound === false) return null;
        entry.args = registration.args;

        return this.resolveScope(entry, throwIfNotFound);
    }

    private resolveImpl(registration : Typeioc.IRegistrationBase, throwIfNotFound : boolean) : Typeioc.IRegistrationBase {

        var serviceEntry = this.collection.getEntry(registration);

        if(!serviceEntry  && this.parent) {
            return this.parent.resolveImpl(registration, throwIfNotFound);
        }

        if(!serviceEntry  && throwIfNotFound === true) throw new Exceptions.ResolutionError('Could not resolve service');

        return serviceEntry;
    }

    private resolveScope(registration : Typeioc.IRegistrationBase,
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

    private resolveContainerScope(registration : Typeioc.IRegistrationBase) {
        var entry : Typeioc.IRegistrationBase;

        if(registration.container !== this) {
            entry = registration.cloneFor(this);
            this.collection. addEntry(entry);
        } else {
            entry = registration;
        }

        if(!entry.instance) {
            entry.instance = this.createTrackable(entry);
        }

        return entry.instance;
    }

    private resolveHierarchyScope(registration : Typeioc.IRegistrationBase, throwIfNotFound : boolean) {
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

    private createTrackable(registration : Typeioc.IRegistrationBase) : any {

        var instance = registration.invoker();

        if(registration.owner === Typeioc.Types.Owner.Container &&
            registration.disposer) {

            this.disposables.add(instance, registration.disposer);
        }

        if(registration.initializer) {
            registration.initializer(this, instance);
        }

        return instance;
    }

    private createRegistration(service: any) : Typeioc.IRegistrationBase {
        return new RegistrationBaseModule.RegistrationBase(service);
    }
}