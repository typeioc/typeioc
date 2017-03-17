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
class ConfigurationError extends applicationError_1.default {
    constructor(message) {
        super(message);
        this.name = "ConfigError";
    }
}
exports.default = ConfigurationError;
//# sourceMappingURL=configRegistrationError.js.map