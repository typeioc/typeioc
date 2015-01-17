'use strict';

exports.internal = {

    configRegistration : (function() {

        var Scaffold = require('../../scaffold');
        var ConfigRegistrationModule = require('../../../lib/registration/config/configRegistration');

        var configRegistration;

        return {

            setUp: function (callback) {
                configRegistration = new ConfigRegistrationModule.ConfigRegistration();
                callback();
            },

            apply_throws_when_null_config : function(test) {

                var delegate = function() {
                    configRegistration.apply(null);
                };

                test.throws(delegate, function(error) {
                    test.strictEqual('config', error.message);
                    return (error instanceof Scaffold.Exceptions.ArgumentNullError);
                });

                test.expect(2);
                test.done();
            },

            apply_throws_when_undefined_config : function(test) {

                var delegate = function() {
                    configRegistration.apply(undefined);
                };

                test.throws(delegate, function(error) {
                    test.strictEqual('config', error.message);
                    return (error instanceof Scaffold.Exceptions.ArgumentNullError);
                });

                test.expect(2);
                test.done();
            }
        }
    })()
}