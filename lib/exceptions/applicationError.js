/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const baseError_1 = require("./baseError");
class ApplicationError extends baseError_1.default {
    constructor(message) {
        super(message);
        this.name = "ApplicationError";
    }
}
exports.default = ApplicationError;
//# sourceMappingURL=applicationError.js.map