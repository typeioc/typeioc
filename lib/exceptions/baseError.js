/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = BaseError;
//# sourceMappingURL=baseError.js.map