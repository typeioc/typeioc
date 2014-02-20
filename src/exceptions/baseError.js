'use strict';
var BaseError = (function () {
    function BaseError(message) {
        this.innerError = null;
        this.message = message;
    }
    return BaseError;
})();
exports.BaseError = BaseError;
//# sourceMappingURL=baseError.js.map
