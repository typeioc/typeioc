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
var ApplicationErrorModule = require('./applicationError');
var DecoratorError = (function (_super) {
    __extends(DecoratorError, _super);
    function DecoratorError(message) {
        _super.call(this, message);
        this.name = "DecoratorError";
    }
    return DecoratorError;
})(ApplicationErrorModule.ApplicationError);
exports.DecoratorError = DecoratorError;
//# sourceMappingURL=decoratorError.js.map