'use strict';

exports.internal = {

    exceptions: (function () {

        var Scaffold = require('../../scaffold');
        var Exceptions = Scaffold.Exceptions;
        var ExceptionBase = Scaffold.ExceptionBase;

        return {

            all_exceptions_loaded: function(test) {

                test.ok(Exceptions.ApplicationError);
                test.ok(Exceptions.ArgumentNullError);
                test.ok(Exceptions.ResolutionError);
                test.ok(Exceptions.StorageKeyNotFoundError);
                test.ok(Exceptions.ConfigurationError);

                test.done();
            },

            baseError_persists_message: function(test) {

                var expected = "the message";

                var baseError = new ExceptionBase.BaseError(expected);

                test.strictEqual(expected, baseError.message);

                test.done();
            },

            baseError_persists_name: function(test) {

                var expected = "the name";

                var baseError = new ExceptionBase.BaseError();
                baseError.name = expected;

                test.strictEqual(expected, baseError.name);

                test.done();
            },

            baseError_has_stack: function(test) {

                var baseError = new ExceptionBase.BaseError();

                test.ok(baseError.stack);

                test.done();
            },

            applicationError_derives_BaseError: function(test) {

                var baseError = new Exceptions.ApplicationError();

                test.ok(baseError instanceof ExceptionBase.BaseError);

                test.done();
            },

            applicationError_has_default_name_as_ApplicationError: function(test) {

                var baseError = new Exceptions.ApplicationError();

                test.strictEqual(baseError.name, "ApplicationError");

                test.done();
            },

            argumentNullError_has_default_name_as_ArgumentNullError: function(test) {

                var baseError = new Exceptions.ArgumentNullError();

                test.strictEqual(baseError.name, "ArgumentNullError");

                test.done();
            },

            argumentNullError_derives_ApplicationError: function(test) {

                var baseError = new Exceptions.ArgumentNullError();

                test.ok(baseError instanceof Exceptions.ApplicationError);

                test.done();
            },

            configRegistrationError_has_default_name_as_ConfigError: function(test) {

                var baseError = new Exceptions.ConfigurationError();

                test.strictEqual(baseError.name, "ConfigError");

                test.done();
            },

            configRegistrationError_derives_ApplicationError: function(test) {

                var baseError = new Exceptions.ConfigurationError();

                test.ok(baseError instanceof Exceptions.ApplicationError);

                test.done();
            },

            resolutionError_has_default_name_as_ResolutionError: function(test) {

                var baseError = new Exceptions.ResolutionError();

                test.strictEqual(baseError.name, "ResolutionError");

                test.done();
            },

            resolutionError_derives_ApplicationError: function(test) {

                var baseError = new Exceptions.ResolutionError();

                test.ok(baseError instanceof Exceptions.ApplicationError);

                test.done();
            },

            storageKeyNotFoundError_has_default_name_as_StorageKeyNotFoundError: function(test) {

                var baseError = new Exceptions.StorageKeyNotFoundError();

                test.strictEqual(baseError.name, "StorageKeyNotFound");

                test.done();
            },

            StorageKeyNotFoundError_derives_ApplicationError: function(test) {

                var baseError = new Exceptions.StorageKeyNotFoundError();

                test.ok(baseError instanceof Exceptions.ApplicationError);

                test.done();
            }
        }

    })()
}