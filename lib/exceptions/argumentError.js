/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () -
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseApplicationErrorModule = require('./applicationError');
var ArgumentError = (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(argumentName, message) {
        _super.call(this, message);
        this.argumentName = argumentName;
        this.name = "ArgumentError";
    }
    return ArgumentError;
})(BaseApplicationErrorModule.ApplicationError);
exports.ArgumentError = ArgumentError;
//# sourceMappingURL=argumentError.js.map