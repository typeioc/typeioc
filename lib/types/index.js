/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () -
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var OwnerModule = require('./owner');
var ScopeModule = require('./scope');
exports.Owner = OwnerModule.Owner;
exports.Scope = ScopeModule.Scope;
exports.Defaults = {
    scope: 1 /* None */,
    owner: 1 /* Container */
};
//# sourceMappingURL=index.js.map