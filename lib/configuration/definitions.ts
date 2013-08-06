"use strict";

import RegoDefinitionsModule = require('../registration/definitions');

export interface IInstanceLocation {
    instanceModule? : Object;
    name : string;
}

export interface IInstantiationItem {
    isDependency : boolean;
    location? : IInstanceLocation;
    instance? : any;
}

export interface IComponent {
    service : IInstanceLocation;
    resolver? : IInstanceLocation;
    parameters? : IInstantiationItem[];
    factory? : RegoDefinitionsModule.IFactory<any>;
    named? : string;
    within? : RegoDefinitionsModule.Scope;
    ownedBy? : RegoDefinitionsModule.Owner;
    initializeBy ? : RegoDefinitionsModule.IInitializer<any>;
}

export interface IForInstance {
    resolver : IInstanceLocation;
    parameters? : IInstantiationItem[];
    factory? : RegoDefinitionsModule.IFactory<any>;
}

export interface IModule {
    forModule? : boolean;
    serviceModule? : Object;
    resolverModule? : Object;
    within? : RegoDefinitionsModule.Scope;
    ownedBy? : RegoDefinitionsModule.Owner;
    forInstances? : IForInstance[];
    components? : IComponent[];
}

export interface IConfig {
    components? : IComponent[];
    modules? : IModule[];
}
