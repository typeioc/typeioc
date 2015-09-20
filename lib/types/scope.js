/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
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