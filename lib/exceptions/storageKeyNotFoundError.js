/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseApplicationErrorModule = require('./applicationError');
var StorageKeyNotFoundError = (function (_super) {
    __extends(StorageKeyNotFoundError, _super);
    function StorageKeyNotFoundError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "StorageKeyNotFound";
    }
    return StorageKeyNotFoundError;
})(BaseApplicationErrorModule.ApplicationError);
exports.StorageKeyNotFoundError = StorageKeyNotFoundError;
//# sourceMappingURL=storageKeyNotFoundError.js.map