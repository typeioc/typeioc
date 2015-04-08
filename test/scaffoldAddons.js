/// <reference path='../d.ts/node.d.ts' />
/// <reference path='../d.ts/typeioc.d.ts' />
'use strict';
var addons = require('../addons');
exports.Exceptions = addons.Exceptions;
exports.Types = addons.Types;
function interceptor() {
    return addons.interceptor();
}
exports.interceptor = interceptor;
function createBuilder() {
    return addons.createBuilder();
}
exports.createBuilder = createBuilder;
//# sourceMappingURL=scaffoldAddons.js.map