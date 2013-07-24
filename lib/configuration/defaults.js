"use strict";

var RegoDefinitionsModule = require('../registration/definitions');

var Defaults = (function () {
    function Defaults() {
    }
    Defaults.Scope = RegoDefinitionsModule.Scope.Hierarchy;
    Defaults.Owner = RegoDefinitionsModule.Owner.Externals;
    return Defaults;
})();
exports.Defaults = Defaults;

//@ sourceMappingURL=defaults.js.map
