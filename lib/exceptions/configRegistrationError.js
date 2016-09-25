/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
const applicationError_1 = require('./applicationError');
class ConfigurationError extends applicationError_1.default {
    constructor(message) {
        super(message);
        this.name = "ConfigError";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConfigurationError;
//# sourceMappingURL=configRegistrationError.js.map