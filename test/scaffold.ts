/// <reference path='../d.ts/node.d.ts' />
/// <reference path='../d.ts/typeioc.d.ts' />

'use strict';

var typeioc = require('../');

export var Exceptions = typeioc.Exceptions;
export var Types = typeioc.Types;
export var RegistrationBase = require('../lib/registrationBase');

export function createBuilder() : Typeioc.IContainerBuilder {
    return <Typeioc.IContainerBuilder>typeioc.createBuilder();
}
