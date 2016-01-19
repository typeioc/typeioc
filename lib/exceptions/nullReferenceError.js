/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseApplicationErrorModule = require('./applicationError');
var NullReferenceError = (function (_super) {
    __extends(NullReferenceError, _super);
    function NullReferenceError(message) {
        _super.call(this, message);
        this.name = 'NullReferenceError';
    }
    return NullReferenceError;
})(BaseApplicationErrorModule.ApplicationError);
exports.NullReferenceError = NullReferenceError;
//# sourceMappingURL=nullReferenceError.js.map