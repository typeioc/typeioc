/// <reference path="../t.d.ts/node.d.ts" />
/// <reference path="../t.d.ts/misc.d.ts" />
/// <reference path="../t.d.ts/container.d.ts" />
/// <reference path="../t.d.ts/registration.d.ts" />

"use strict";

import Defaults = require('../configuration/defaults');
import Utils = require('../utils');
import Exceptions = require('../exceptions');
import RegistrationBaseModule = require('../registration/registrationBase');

var hashes = require('hashes');
var weak = require('weak');

export class Container implements Typeioc.IContainer {

    private weakRef = weak;
    private collection : any;

    private disposables = [];
    private parent : Container;
    private children : Container[] = [];

    constructor(registrations? : Typeioc.IRegistrationBase[]) {
        this.collection =  new hashes.HashTable();

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

        var self = this;

        while(this.disposables.length > 0) {
            var disposable = this.disposables.pop();

            if(!self.weakRef.isDead(disposable)) {
                var obj = self.weakRef.get(disposable);
                Utils.getDisposeMethod(disposable).apply(disposable);
            }
        }

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

        this.addEntry(registration);
    }

    private addEntry(registration : Typeioc.IRegistrationBase) : void {

        var entry = this.collection.contains(registration.service) ?
            this.collection.get(registration.service).value : <Typeioc.ICollection>{};

        entry[registration.toNamedKey()] = registration;

        this.collection.add(registration.service, entry, true);
    }

    private getEntry(registration : Typeioc.IRegistrationBase) : Typeioc.IRegistrationBase {

        try {

            var entry = this.collection.get(registration.service);

            if(!entry) return null;

            var storage = <Typeioc.ICollection>entry.value;
            return storage[registration.toNamedKey()];

        } catch(error) {

            var resolutionError : any  = new Exceptions.ResolutionError('Error constructing service key');
            resolutionError.innerError = error;

            throw resolutionError;
        }
    }

    private resolveBase(registration : Typeioc.IRegistrationBase, throwIfNotFound : boolean) : any {

        var entry = this.resolveImpl(registration, throwIfNotFound);

        if(!entry && throwIfNotFound === false) return null;
        entry.args = registration.args;

        return this.resolveScope(entry, throwIfNotFound);
    }

    private resolveImpl(registration : Typeioc.IRegistrationBase, throwIfNotFound : boolean) : Typeioc.IRegistrationBase {

        var serviceEntry = this.getEntry(registration);

        if(!serviceEntry  && this.parent) {
            return this.parent.resolveImpl(registration, throwIfNotFound);
        }

        if(!serviceEntry  && throwIfNotFound === true) throw new Exceptions.ResolutionError('Could not resolve service');

        return serviceEntry;
    }


    private resolveScope(registration : Typeioc.IRegistrationBase,
                         throwIfNotFound : boolean) : any {

        switch(registration.scope) {
            case Defaults.Scope.None:
                return this.createTrackable(registration);

            case Defaults.Scope.Container:

                return this.resolveContainerScope(registration);

            case Defaults.Scope.Hierarchy :

                return this.resolveHierarchyScope(registration, throwIfNotFound);

            default:
                throw new Exceptions.ResolutionError('Unknown scoping');
        }
    }

    private resolveContainerScope(registration : Typeioc.IRegistrationBase) {
        var entry : Typeioc.IRegistrationBase;

        if(registration.container !== this) {
            entry = registration.cloneFor(this);
            this.addEntry(entry);
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

        if(registration.owner === Defaults.Owner.Container &&
            Utils.isDisposable(instance)) {

            this.disposables.push(this.weakRef(instance));
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