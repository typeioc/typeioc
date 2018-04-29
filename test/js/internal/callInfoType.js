
'use strict';

exports.internal = {

    callInfoType : (function() {

        const ScaffoldAddons = require('../scaffoldAddons');
        const CallInfoType = ScaffoldAddons.Interceptors.CallInfoType;

        return {

            owner_has_Method_property: function(test) {

                test.equal(1, CallInfoType.Method);

                test.done();
            },

            owner_has_Getter_property: function(test) {

                test.equal(2, CallInfoType.Getter);

                test.done();
            },

            owner_has_Setter_property: function(test) {

                test.equal(3, CallInfoType.Setter);

                test.done();
            },

            owner_has_GetterSetter_property: function(test) {

                test.equal(4, CallInfoType.GetterSetter);

                test.done();
            },

            owner_has_Any_property: function(test) {

                test.equal(5, CallInfoType.Any);

                test.done();
            },

            owner_has_Field_property: function(test) {

                test.equal(6, CallInfoType.Field);

                test.done();
            },

            owner_has_no_more_properties: function(test) {

                var properties = [];

                for(var key in CallInfoType) {
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



















