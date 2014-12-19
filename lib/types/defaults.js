/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2014 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.d.ts" />
'use strict';
var Defaults = (function () {
    function Defaults() {
    }
    Defaults.Scope = 3 /* Hierarchy */;
    Defaults.Owner = 2 /* Externals */;
    return Defaults;
})();
exports.Defaults = Defaults;
//# sourceMappingURL=defaults.js.map