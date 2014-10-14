/*---------------------------------------------------------------------------------------------------
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.5
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE,
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