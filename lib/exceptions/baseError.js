/*---------------------------------------------------------------------------------------------------
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE,
 * --------------------------------------------------------------------------------------------------*/

'use strict';
var BaseError = (function () {
    function BaseError(message) {
        this.innerError = null;
        this.nativeError = new Error(message);
        this.name = "BaseError";
    }
    Object.defineProperty(BaseError.prototype, "stack", {
        get: function () {
            return this.nativeError.stack;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseError.prototype, "message", {
        get: function () {
            return this.nativeError.message;
        },
        set: function (value) {
            this.nativeError.message = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseError.prototype, "name", {
        get: function () {
            return this.nativeError.name;
        },
        set: function (value) {
            this.nativeError.name = value;
        },
        enumerable: true,
        configurable: true
    });
    return BaseError;
})();
exports.BaseError = BaseError;
//# sourceMappingURL=baseError.js.map