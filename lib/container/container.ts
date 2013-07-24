/// <reference path="../t.d.ts/node/node.d.ts" />

"use strict";

import DefinitionsModule = require('../definitions');
import RegoDefinitionsModule = require('../registration/definitions');
import ContainerDefinitionsModule = require('definitions');
import Utils = require('../utils');
import Exceptions = require('../exceptions');
import RegistrationBaseModule = require('../registration/registrationBase');

var hashes = require('hashes');
var weak = require('weak');

export class Container implements ContainerDefinitionsModule.IContainer {

    private weakRef = weak;
    private collection : any;

    private disposables = [];
    private parent : Container;
    private children : Container[] = [];

    constructor(registrations? : RegoDefinitionsModule.IRegistrationBase[]) {
        this.collection =  new hashes.HashTable();

        if(registrations) {
            this.import(registrations);
        }
    }

    public createChild() : ContainerDefinitionsModule.IContainer {

        var child = new Container();
        child.parent = this;
        this.children.push(child);
        return child;
    }

    public dispose() : void {

        var self = this;

        while(this.disposables.length > 0) {
            var item = this.disposables.pop();

            if(!self.weakRef.isDead(item)) {
                var obj = self.weakRef.get(item);
                Utils.getDisposeMethod(item).apply(item);
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

    private import(registrations : RegoDefinitionsModule.IRegistrationBase[]) {
        var self = this;

        registrations.forEach(function(item : RegoDefinitionsModule.IRegistrationBase) {

            self.registerImpl(item);
        });
    }

    private registerImpl(registration : RegoDefinitionsModule.IRegistrationBase) : void {

        if(!registration.factory)
            throw new Exceptions.ArgumentNullError("Factory is not defined for: " + registration.service.name);

        registration.container = this;

        this.addEntry(registration);
    }

    private addEntry(registration : RegoDefinitionsModule.IRegistrationBase) : void {

        var entry = this.collection.contains(registration.service) ?
            this.collection.get(registration.service).value : <DefinitionsModule.ICollection>{};

        entry[registration.toNamedKey()] = registration;

        this.collection.add(registration.service, entry, true);
    }

    private getEntry(registration : RegoDefinitionsModule.IRegistrationBase) : RegoDefinitionsModule.IRegistrationBase {

        try {

            var entry = this.collection.get(registration.service);

            if(!entry) return null;

            var storage = <DefinitionsModule.ICollection>entry.value;
            return storage[registration.toNamedKey()];

        } catch(error) {

            var resolutionError : any  = new Exceptions.ResolutionError('Error constructing service key');
            resolutionError.innerError = error;

            throw resolutionError;
        }
    }

    private resolveBase(registration : RegoDefinitionsModule.IRegistrationBase, throwIfNotFound : bool) : any {

        var entry = this.resolveImpl(registration, throwIfNotFound);

        if(!entry && throwIfNotFound === false) return null;
        entry.args = registration.args;

        return this.resolveScope(entry, throwIfNotFound);
    }

    private resolveImpl(registration : RegoDefinitionsModule.IRegistrationBase, throwIfNotFound : bool) : RegoDefinitionsModule.IRegistrationBase {

        var serviceEntry = this.getEntry(registration);

        if(!serviceEntry  && this.parent) {
            return this.parent.resolveImpl(registration, throwIfNotFound);
        }

        if(!serviceEntry  && throwIfNotFound === true) throw new Exceptions.ResolutionError('Could not resolve service');

        return serviceEntry;
    }

    private resolveScope(registration : RegoDefinitionsModule.IRegistrationBase,
                         throwIfNotFound : bool) : any {

        switch(registration.scope) {
            case RegoDefinitionsModule.Scope.None:
                return this.createTrackable(registration);

            case RegoDefinitionsModule.Scope.Container:

                return this.resolveContainerScope(registration);

            case RegoDefinitionsModule.Scope.Hierarchy :

                return this.resolveHierarchyScope(registration, throwIfNotFound);

            default:
                throw new Exceptions.ResolutionError('Unknown scoping');
        }
    }

    private resolveContainerScope(registration : RegoDefinitionsModule.IRegistrationBase) {
        var entry : RegoDefinitionsModule.IRegistrationBase;

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

    private resolveHierarchyScope(registration : RegoDefinitionsModule.IRegistrationBase, throwIfNotFound : bool) {
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

    private createTrackable(registration : RegoDefinitionsModule.IRegistrationBase) : any {

        var instance = registration.invoker();

        if(registration.owner === RegoDefinitionsModule.Owner.Container &&
            Utils.isDisposable(instance)) {

            this.disposables.push(this.weakRef(instance));
        }

        if(registration.initializer) {
            registration.initializer(this, instance);
        }

        return instance;
    }

    private createRegistration(service: any) : RegoDefinitionsModule.IRegistrationBase {
        return new RegistrationBaseModule.RegistrationBase(service);
    }
}