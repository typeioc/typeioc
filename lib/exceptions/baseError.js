/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () -
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