/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var OwnerModule = require('./owner');
var ScopeModule = require('./scope');
exports.Owner = OwnerModule.Owner;
exports.Scope = ScopeModule.Scope;
exports.Defaults = {
    get Scope() {
        return 1 /* None */;
    },
    get Owner() {
        return 1 /* Container */;
    }
};
//# sourceMappingURL=index.js.map