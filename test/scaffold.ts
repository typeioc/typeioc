/// <reference path='../d.ts/node.d.ts' />
/// <reference path='../d.ts/typeioc.d.ts' />

'use strict';

var typeioc = require('../');
var ConfigModule = require('./data/config');
var ConfigProvider = ConfigModule.Config;

export var Exceptions = typeioc.Exceptions;
export var Types = typeioc.Types;
export var RegistrationBase = require('../lib/registration/base/registrationBase');
export var TestModule = require('./data/test-data');
export var TestModule2 = require('./data/test-data2');

ConfigProvider.TestModule = TestModule;
ConfigProvider.TestModule2 = TestModule2;

export var Config = ConfigProvider;


export function createBuilder() : Typeioc.IContainerBuilder {
    return <Typeioc.IContainerBuilder>typeioc.createBuilder();
}