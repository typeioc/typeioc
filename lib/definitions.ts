"use strict";

import RegoDefinitionsModule = require('registration/definitions');
import ContainerDefinitionsModule = require('container/definitions');

export interface ICollection {
    [name: string]: any;
};

export interface IFactory<T> {
    (c: ContainerDefinitionsModule.IContainer, ...args: any[]) : T;
};

export interface IResolveOptions {
    throwIfNotFound : boolean;
    registration : RegoDefinitionsModule.IRegistrationBase;
};

