'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BaseApplicationErrorModule = require('./applicationError');

var ConfigRegistrationError = (function (_super) {
    __extends(ConfigRegistrationError, _super);
    function ConfigRegistrationError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "ConfigError";
    }
    return ConfigRegistrationError;
})(BaseApplicationErrorModule.ApplicationError);
exports.ConfigRegistrationError = ConfigRegistrationError;
