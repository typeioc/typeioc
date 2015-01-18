/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BaseApplicationErrorModule = require('./applicationError');
var ConfigurationError = (function (_super) {
    __extends(ConfigurationError, _super);
    function ConfigurationError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "ConfigError";
    }
    return ConfigurationError;
})(BaseApplicationErrorModule.ApplicationError);
exports.ConfigurationError = ConfigurationError;
//# sourceMappingURL=configRegistrationError.js.map