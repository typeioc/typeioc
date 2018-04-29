
'use strict';

exports.internal = {

    scope : (function() {

        const Scaffold = require('../scaffold');
        const Types = Scaffold.Types;


        return {

            scope_is_instantiable_function: function(test) {

                var scope = new Types.Scope();
                test.ok(scope);
                test.equal("function", typeof Types.Scope);

                test.done();
            },

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
        }
    })()
}


