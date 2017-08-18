/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const applicationError_1 = require("./applicationError");
class ProxyError extends applicationError_1.default {
    constructor(message) {
        super(message);
        this.name = "ProxyError";
    }
}
exports.default = ProxyError;
//# sourceMappingURL=proxyError.js.map