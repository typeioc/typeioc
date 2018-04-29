/// <reference path='../d.ts/typeioc.d.ts' />
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var typeioc = require('../../');
var BError = require('../../lib/exceptions/baseError').default;
exports.Exceptions = typeioc.Exceptions;
exports.Types = typeioc.Types;
exports.RegistrationBase = require('../../lib/registration/base/registrationBase');
exports.BaseError = BError;
exports.TestModule = require('./data/test-data');
exports.TestModule2 = require('./data/test-data2');
exports.TestModuleInterceptors = require('./data/test-data-intercept');
exports.Utils = require('../../lib/utils/index');
exports.Mockery = require('sinon');
function createBuilder() {
    return typeioc.createBuilder();
}
exports.createBuilder = createBuilder;
function createDecorator() {
    return typeioc.createDecorator();
}
exports.createDecorator = createDecorator;
exports.TestDataDecorators = require('./data/decorators');
//# sourceMappingURL=scaffold.js.map