
'use strict';

var Scaffold = require('../../scaffold');
var Types = Scaffold.Types;

exports.internal = {};
exports.internal.Defaults = (function() {

    return {
        defaults_has_Scope_property: function(test) {
            test.equal(Types.Scope.Hierarchy, Types.Defaults.Scope);

            test.done();
        },

        defaults_has_Owner_property: function(test) {
            test.equal(Types.Owner.Externals, Types.Defaults.Owner);

            test.done();
        },

        owner_has_no_more_properties: function(test) {

            var properties = [];

            for(var key in Types.Defaults) {
                properties.push(key);
            }

            test.equal(2, properties.length);
            test.equal('Scope', properties[0]);
            test.equal('Owner', properties[1]);

            test.done();
        }
    };

})();

