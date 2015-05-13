/// <reference path='../d.ts/node.d.ts' />
/// <reference path='../d.ts/typeioc.addons.d.ts' />
'use strict';
var addons = require('../addons/index');
function interceptor() {
    return addons.Interceptors.create();
}
exports.interceptor = interceptor;
//# sourceMappingURL=scaffoldAddons.js.map