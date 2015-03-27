
'use strict';

exports.internal = {

    callInfoType : (function() {

        var Scaffold = require('../../scaffold');
        var Types = Scaffold.Types;

        return {

            callInfoType_is_instantiable_function: function(test) {

                var type = new Types.CallInfoType();
                test.ok(type);
                test.equal("function", typeof Types.CallInfoType);

                test.done();
            },

            owner_has_Method_property: function(test) {

                test.equal(1, Types.CallInfoType.Method);

                test.done();
            },

            owner_has_Getter_property: function(test) {

                test.equal(2, Types.CallInfoType.Getter);

                test.done();
            },

            owner_has_Setter_property: function(test) {

                test.equal(3, Types.CallInfoType.Setter);

                test.done();
            },

            owner_has_GetterSetter_property: function(test) {

                test.equal(4, Types.CallInfoType.GetterSetter);

                test.done();
            },

            owner_has_Any_property: function(test) {

                test.equal(5, Types.CallInfoType.Any);

                test.done();
            },

            owner_has_Field_property: function(test) {

                test.equal(6, Types.CallInfoType.Field);

                test.done();
            },

            owner_has_no_more_properties: function(test) {

                var properties = [];

                for(var key in Types.CallInfoType) {
                    properties.push(key);
                }

                test.equal(6, properties.length);

                test.equal('Method', properties[0]);
                test.equal('Getter', properties[1]);

                test.equal('Setter', properties[2]);
                test.equal('GetterSetter', properties[3]);

                test.equal('Any', properties[4]);
                test.equal('Field', properties[5]);

                test.done();
            }
        };
    })()
}



















