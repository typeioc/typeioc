/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
const argumentError_1 = require('./argumentError');
class ArgumentNullError extends argumentError_1.default {
    constructor(argumentName, message) {
        super(argumentName, message);
        this.name = "ArgumentNullError";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArgumentNullError;
//# sourceMappingURL=argumentNullError.js.map