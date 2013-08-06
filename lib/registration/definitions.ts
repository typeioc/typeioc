"use strict";

import ContainerDefinitionsModule = require('../container/definitions');

export enum Scope {
    None,
    Container,
    Hierarchy
};

export enum Owner {
    Container,
    Externals
};

export interface IInvoker {
    () : any;
}

export interface IFactory<T> {
    (c: ContainerDefinitionsModule.IContainer, ...args: any[]) : T;
};

export interface IInitializer<T> {
    (c: ContainerDefinitionsModule.IContainer, item : T) : void;
}

export interface IOwned {
    ownedBy : (owner : Owner) => void;
}

export interface IReused {
    within : (scope: Scope) => IOwned;
}

export interface IReusedOwned extends IReused, IOwned { }

export interface INamed {
    named : (name: string) => IReusedOwned;
}

export interface INamedReusedOwned extends INamed, IReusedOwned {}

export interface IInitialized<T> {
    initializeBy : (action : IInitializer<T>) => INamedReusedOwned;
}

export interface IInitializedNamedReusedOwned extends IInitialized, INamedReusedOwned {}

export interface IAs<T> {
    as : (factory: IFactory<T>) => IInitializedNamedReusedOwned<T>;
}

export interface IRegistrationBase {
    service : any;
    factory : IFactory<any>;
    name : string;
    scope : Scope;
    owner : Owner;
    initializer : IInitializer<any>;
    args : any[];
    container : ContainerDefinitionsModule.IContainer;
    instance : any;
    invoker : IInvoker;
    toNamedKey : () => string;
    cloneFor : (container: ContainerDefinitionsModule.IContainer) => IRegistrationBase;
}

export interface IRegistration<T> extends IAs<T> { }

export interface IModuleReusedOwned extends IReusedOwned {
    for<R>(service: any, factory : IFactory<R>) : IModuleReusedOwned;
    forArgs(service: any, ...args:any[]) : IModuleReusedOwned;
    named(service: any, name : string) : IModuleReusedOwned;
}

export interface IAsModuleRegistration {
    as : (asModule : Object) => IModuleReusedOwned;
}

export interface IModuleRegistration {
    getAsModuleRegistration : () => IAsModuleRegistration;
    registrations : IRegistrationBase[];
}

export interface IModuleItemRegistrationOptions {
    factory : IFactory<any>;
    name : string;
}