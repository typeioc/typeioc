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
var BaseArgumentErrorModule = require('./argumentError');
var ArgumentNullError = (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(argumentName, message) {
        _super.call(this, argumentName, message);
        this.name = "ArgumentNullError";
    }
    return ArgumentNullError;
})(BaseArgumentErrorModule.ArgumentError);
exports.ArgumentNullError = ArgumentNullError;
//# sourceMappingURL=argumentNullError.js.map