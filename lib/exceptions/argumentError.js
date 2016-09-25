/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
const applicationError_1 = require('./applicationError');
class ArgumentError extends applicationError_1.default {
    constructor(argumentName, message) {
        super(message);
        this.argumentName = argumentName;
        this.name = "ArgumentError";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArgumentError;
//# sourceMappingURL=argumentError.js.map