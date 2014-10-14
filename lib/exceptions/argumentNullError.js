'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BaseApplicationErrorModule = require('./applicationError');
var ArgumentNullError = (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "ArgumentNullError";
    }
    return ArgumentNullError;
})(BaseApplicationErrorModule.ApplicationError);
exports.ArgumentNullError = ArgumentNullError;
//# sourceMappingURL=argumentNullError.js.map