
'use strict';

exports.internal = {

    owner : (function() {

        var Scaffold = require('../../scaffold');
        var Types = Scaffold.Types;

        return {

            owner_is_instantiable_function: function(test) {

                var owner = new Types.Owner();
                test.ok(owner);
                test.equal("function", typeof Types.Owner);

                test.done();
            },

            owner_has_Container_property: function(test) {

                test.equal(1, Types.Owner.Container);

                test.done();
            },

            owner_has_Externals_property: function(test) {
                test.equal(2, Types.Owner.Externals);

                test.done();
            },

            owner_has_no_more_properties: function(test) {

                var properties = [];

                for(var key in Types.Owner) {
                    properties.push(key);
                }

                test.equal(2, properties.length);
                test.equal('Container', properties[0]);
                test.equal('Externals', properties[1]);

                test.done();
            }
        };
    })()
}



















