/// <reference path='../d.ts/node.d.ts' />
/// <reference path='../d.ts/typeioc.d.ts' />

'use strict';

var typeioc = require('../');
var BError = require('../lib/exceptions/baseError').default;

export var Exceptions = typeioc.Exceptions;
export var Types = typeioc.Types;
export var RegistrationBase = require('../lib/registration/base/registrationBase');
export var BaseError = BError;
export var TestModule = require('./data/test-data');
export var TestModule2 = require('./data/test-data2');
export var TestModuleInterceptors = require('./data/test-data-intercept');

export var Utils = require('../lib/utils/index');
export var Mockery = require('sinon');


export function createBuilder() : Typeioc.IContainerBuilder {
    return <Typeioc.IContainerBuilder>typeioc.createBuilder();
}

export function createDecorator() : Typeioc.Decorators.IDecorator {
    return <Typeioc.Decorators.IDecorator>typeioc.createDecorator();
}