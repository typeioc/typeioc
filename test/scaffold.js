/// <reference path='../d.ts/node.d.ts' />
/// <reference path='../d.ts/typeioc.d.ts' />
'use strict';
var typeioc = require('../');

exports.Exceptions = typeioc.Exceptions;
exports.Types = typeioc.Types;
exports.RegistrationBase = require('../lib/registrationBase');

function createBuilder() {
    return typeioc.createBuilder();
}
exports.createBuilder = createBuilder;
//# sourceMappingURL=scaffold.js.map
