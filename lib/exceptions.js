var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
"use strict";

var ErrorClass = (function () {
    function ErrorClass(message) {
        this.innerError = null;
        this.message = message;
    }
    return ErrorClass;
})();
exports.ErrorClass = ErrorClass;

var ApplicationError = (function (_super) {
    __extends(ApplicationError, _super);
    function ApplicationError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "ApplicationError";
    }
    return ApplicationError;
})(ErrorClass);
exports.ApplicationError = ApplicationError;

var ArgumentNullError = (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "ArgumentNullError";
    }
    return ArgumentNullError;
})(ApplicationError);
exports.ArgumentNullError = ArgumentNullError;

var ResolutionError = (function (_super) {
    __extends(ResolutionError, _super);
    function ResolutionError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "ResolutionError";
    }
    return ResolutionError;
})(ApplicationError);
exports.ResolutionError = ResolutionError;

var ConfigError = (function (_super) {
    __extends(ConfigError, _super);
    function ConfigError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "ConfigError";
    }
    return ConfigError;
})(ApplicationError);
exports.ConfigError = ConfigError;

//@ sourceMappingURL=exceptions.js.map
