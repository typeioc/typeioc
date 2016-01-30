/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var Scope = (function () {
    function Scope() {
    }
    Scope.None = 1;
    Scope.Container = 2;
    Scope.Hierarchy = 3;
    return Scope;
})();
exports.Scope = Scope;
//# sourceMappingURL=scope.js.map