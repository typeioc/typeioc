/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const argumentError_1 = require("./argumentError");
class ArgumentNullError extends argumentError_1.default {
    constructor(argumentName, message) {
        super(argumentName, message);
        this.name = "ArgumentNullError";
    }
}
exports.default = ArgumentNullError;
//# sourceMappingURL=argumentNullError.js.map