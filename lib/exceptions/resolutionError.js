/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BaseApplicationErrorModule = require('./applicationError');
var ResolutionError = (function (_super) {
    __extends(ResolutionError, _super);
    function ResolutionError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "ResolutionError";
    }
    return ResolutionError;
})(BaseApplicationErrorModule.ApplicationError);
exports.ResolutionError = ResolutionError;
//# sourceMappingURL=resolutionError.js.map