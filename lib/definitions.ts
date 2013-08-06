"use strict";

import RegoDefinitionsModule = require('registration/definitions');
import ContainerDefinitionsModule = require('container/definitions');

export interface ICollection {
    [name: string]: any;
};

export interface IResolveOptions {
    throwIfNotFound : boolean;
    registration : RegoDefinitionsModule.IRegistrationBase;
};

