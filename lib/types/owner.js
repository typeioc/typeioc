/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () -
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var Owner = (function () {
    function Owner() {
    }
    Owner.Container = 1;
    Owner.Externals = 2;
    return Owner;
})();
exports.Owner = Owner;
//# sourceMappingURL=owner.js.map