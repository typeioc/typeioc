"use strict";




(function (Scope) {
    Scope[Scope["None"] = 0] = "None";
    Scope[Scope["Container"] = 1] = "Container";

    Scope[Scope["Hierarchy"] = 2] = "Hierarchy";
})(exports.Scope || (exports.Scope = {}));
var Scope = exports.Scope;
;

(function (Owner) {
    Owner[Owner["Container"] = 0] = "Container";

    Owner[Owner["Externals"] = 1] = "Externals";
})(exports.Owner || (exports.Owner = {}));
var Owner = exports.Owner;
;

//@ sourceMappingURL=definitions.js.map
