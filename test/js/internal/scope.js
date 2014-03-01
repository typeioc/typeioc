
'use strict';

var Scaffold = require('../../scaffold');
var Types = Scaffold.Types;

exports.internal = {};
exports.internal.Scope = (function() {
    return {

        scope_has_None_property: function(test) {
            test.equal(1, Types.Scope.None);

            test.done();
        },

        scope_has_Container_property: function(test) {
            test.equal(2, Types.Scope.Container);

            test.done();
        },

        scope_has_Hierarchy_property: function(test) {
            test.equal(3, Types.Scope.Hierarchy);

            test.done();
        },

        owner_has_no_more_properties: function(test) {

            var properties = [];

            for(var key in Types.Scope) {
                properties.push(key);
            }

            test.equal(3, properties.length);
            test.equal('None', properties[0]);
            test.equal('Container', properties[1]);
            test.equal('Hierarchy', properties[2]);

            test.done();
        }
    };
})();


