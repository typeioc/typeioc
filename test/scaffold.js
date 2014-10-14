/// <reference path='../d.ts/node.d.ts' />
/// <reference path='../d.ts/typeioc.d.ts' />
'use strict';
var typeioc = require('../');
var ConfigModule = require('./data/config');
var ConfigProvider = ConfigModule.Config;
exports.Exceptions = typeioc.Exceptions;
exports.Types = typeioc.Types;
exports.RegistrationBase = require('../lib/registration/base/registrationBase');
exports.ExceptionBase = require('../lib/exceptions/baseError');
exports.TestModule = require('./data/test-data');
exports.TestModule2 = require('./data/test-data2');
ConfigProvider.TestModule = exports.TestModule;
ConfigProvider.TestModule2 = exports.TestModule2;
exports.Config = ConfigProvider;
exports.Utils = require('../lib/utils/index');
exports.Mockery = require('sinon');
function createBuilder() {
    return typeioc.createBuilder();
}
exports.createBuilder = createBuilder;
//# sourceMappingURL=scaffold.js.map