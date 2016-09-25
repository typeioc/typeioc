/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
const baseError_1 = require('./baseError');
class ApplicationError extends baseError_1.default {
    constructor(message) {
        super(message);
        this.name = "ApplicationError";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplicationError;
//# sourceMappingURL=applicationError.js.map