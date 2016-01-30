/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
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