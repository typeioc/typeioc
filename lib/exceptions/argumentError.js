'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BaseApplicationErrorModule = require('./applicationError');
var ArgumentError = (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(argumentName, message) {
        _super.call(this, message);
        this.argumentName = argumentName;
        this.name = "ArgumentError";
    }
    return ArgumentError;
})(BaseApplicationErrorModule.ApplicationError);
exports.ArgumentError = ArgumentError;
//# sourceMappingURL=argumentError.js.map