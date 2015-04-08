/// <reference path='../d.ts/node.d.ts' />
/// <reference path='../d.ts/typeioc.d.ts' />

'use strict';

var addons = require('../addons');

export var Exceptions = addons.Exceptions;
export var Types = addons.Types;

export function interceptor() {
    return addons.interceptor();
}

export function createBuilder() : Typeioc.IContainerBuilder {
    return <Typeioc.IContainerBuilder>addons.createBuilder();
}