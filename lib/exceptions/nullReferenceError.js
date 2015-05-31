/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.8
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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