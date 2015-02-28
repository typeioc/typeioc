'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BaseApplicationErrorModule = require('./applicationError');
var ProxyError = (function (_super) {
    __extends(ProxyError, _super);
    function ProxyError(message) {
        _super.call(this, message);
        this.name = "ProxyError";
    }
    return ProxyError;
})(BaseApplicationErrorModule.ApplicationError);
exports.ProxyError = ProxyError;
//# sourceMappingURL=proxyError.js.map