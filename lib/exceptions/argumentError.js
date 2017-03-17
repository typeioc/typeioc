/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const applicationError_1 = require("./applicationError");
class ArgumentError extends applicationError_1.default {
    constructor(argumentName, message) {
        super(message);
        this.argumentName = argumentName;
        this.name = "ArgumentError";
    }
}
exports.default = ArgumentError;
//# sourceMappingURL=argumentError.js.map