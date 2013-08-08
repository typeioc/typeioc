/// <reference path="../t.d.ts/enums.d.ts" />
"use strict";

(function (Scope) {
    Scope[Scope["None"] = 1] = "None";
    Scope[Scope["Container"] = 2] = "Container";
    Scope[Scope["Hierarchy"] = 3] = "Hierarchy";
})(exports.Scope || (exports.Scope = {}));
var Scope = exports.Scope;

(function (Owner) {
    Owner[Owner["Container"] = 1] = "Container";
    Owner[Owner["Externals"] = 2] = "Externals";
})(exports.Owner || (exports.Owner = {}));
var Owner = exports.Owner;

var Defaults = (function () {
    function Defaults() {
    }
    Defaults.Scope = Scope.Hierarchy;
    Defaults.Owner = Owner.Externals;
    return Defaults;
})();
exports.Defaults = Defaults;

//# sourceMappingURL=defaults.js.map
