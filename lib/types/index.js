/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const owner_1 = require("./owner");
const scope_1 = require("./scope");
exports.Owner = owner_1.default;
exports.Scope = scope_1.default;
exports.Defaults = {
    get Scope() {
        return 1 /* None */;
    },
    get Owner() {
        return 1 /* Container */;
    }
};
//# sourceMappingURL=index.js.map