/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
class BaseError {
    constructor(message) {
        this.innerError = null;
        this.nativeError = new Error(message);
        this.name = "BaseError";
    }
    get stack() {
        return this.nativeError.stack;
    }
    get message() {
        return this.nativeError.message;
    }
    get name() {
        return this.nativeError.name;
    }
    set name(value) {
        this.nativeError.name = value;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseError;
//# sourceMappingURL=baseError.js.map