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

var Owner = (function () {
    function Owner() {
    }
    Owner.Container = 1;
    Owner.Externals = 2;
    return Owner;
})();
exports.Owner = Owner;

var Defaults = (function () {
    function Defaults() {
    }
    Defaults.Scope = Scope.Hierarchy;
    Defaults.Owner = Owner.Externals;
    return Defaults;
})();
exports.Defaults = Defaults;
