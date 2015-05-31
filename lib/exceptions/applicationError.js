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
var BaseErrorModule = require('./baseError');
var ApplicationError = (function (_super) {
    __extends(ApplicationError, _super);
    function ApplicationError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "ApplicationError";
    }
    return ApplicationError;
})(BaseErrorModule.BaseError);
exports.ApplicationError = ApplicationError;
//# sourceMappingURL=applicationError.js.map