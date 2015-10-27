/// <reference path='../d.ts/node.d.ts' />
/// <reference path='../d.ts/typeioc.d.ts' />

'use strict';

var typeioc = require('../');
var ConfigModule = require('./data/config');
var ConfigProvider = ConfigModule.Config;

export var Exceptions = typeioc.Exceptions;
export var Types = typeioc.Types;
export var RegistrationBase = require('../lib/registration/base/registrationBase');
export var ExceptionBase = require('../lib/exceptions/baseError');
export var TestModule = require('./data/test-data');
export var TestModule2 = require('./data/test-data2');
export var TestModuleInterceptors = require('./data/test-data-intercept');

ConfigProvider.TestModule = TestModule;
ConfigProvider.TestModule2 = TestModule2;

export var Config = ConfigProvider;
export var Utils = require('../lib/utils/index');
export var Mockery = require('sinon');


export function createBuilder() : Typeioc.IContainerBuilder {
    return <Typeioc.IContainerBuilder>typeioc.createBuilder();
}

export function getDecorator() : Typeioc.Decorators.IDecorator {
    return <Typeioc.Decorators.IDecorator>typeioc.getDecorator();
}