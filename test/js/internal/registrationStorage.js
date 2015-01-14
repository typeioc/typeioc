'use strict';

exports.internal = {

    registrationStorage : (function() {
        var Scaffold = require('../../scaffold');
        var RegistrationStorageModule = require('../../../lib/storage/registrationStorage');
        var mockery = Scaffold.Mockery;

        var registrationStorage;
        var internalStorage;

        return {

            setUp: function (callback) {

                internalStorage =  {
                    register : mockery.stub(),
                    tryGet : mockery.stub()
                };

                registrationStorage = new RegistrationStorageModule.RegistrationStorage(internalStorage);
                callback();
            },

            addEntry_calls_internalStorage_register_method : function(test) {

                var registration = {
                    service : function testService() {},
                    factory : function (c, a, b, d) {}
                };

                var storage = {};

                internalStorage.register.withArgs(registration.service, mockery.match.func).returns(storage);

                registrationStorage.addEntry(registration, function() {return registration;});

                test.ok(internalStorage.register.calledOnce);

                test.done();
            },

            addEntry_adds_numberOfArgs_property_to_storage : function(test) {

                var registration = {
                  service : function testService() {},
                  factory : function (c, a, b, d) {}
                };

                var storage = {};

                internalStorage.register.withArgs(registration.service, mockery.match.func).returns(storage);

                registrationStorage.addEntry(registration, function() {return registration;});

                var actual = storage[3];

                test.ok(actual);
                test.strictEqual(actual, registration);
                test.deepEqual(actual, registration);

                test.done();
            },

            addEntry_adds_named_property_to_storage : function(test) {
                var name = 'test';

                var registration = {
                    service : function testService() {},
                    factory : function (c) {},
                    name : name
                };

                var storage = {};

                internalStorage.register.withArgs(registration.service, mockery.match.func).returns(storage);

                registrationStorage.addEntry(registration, function() {return registration;});

                var actual = storage[name];

                test.ok(actual);

                test.done();
            },

            addEntry_adds_numberOfArgs_to_named_property_to_storage : function(test) {
                var name = 'test';

                var registration = {
                    service : function testService() {},
                    factory : function (c, a, b) {},
                    name : name
                };

                var storage = {};

                internalStorage.register.withArgs(registration.service, mockery.match.func).returns(storage);

                registrationStorage.addEntry(registration, function() {return registration;});

                var resultStorage = storage[name];
                var actual = resultStorage[2];

                test.ok(actual);
                test.strictEqual(actual, registration);

                test.done();
            },

            getEntry_calls_internalStorage_tryGet_method : function(test) {

                var registration = {
                    service : function testService() {}
                };

                internalStorage.tryGet.withArgs(registration.service).returns(undefined);

                registrationStorage.getEntry(registration);

                test.ok(internalStorage.tryGet.calledOnce);

                test.done();
            },

            getEntry_returns_undefined_for_no_service : function(test) {

                var registration = {
                    service : function testService() {}
                };

                internalStorage.tryGet.withArgs(registration.service).returns(undefined);

                var result = registrationStorage.getEntry(registration);

                test.ok(result === undefined);

                test.done();
            },

            getEntry_returns_storage_by_argsCount : function(test) {

                var registration = {
                    service : function testService() {},
                    factory : function (c, a, b) {}
                };

                var storage = {};
                storage[2] = registration;

                internalStorage.tryGet.withArgs(registration.service).returns(storage);

                var result = registrationStorage.getEntry(registration);

                test.ok(result);
                test.deepEqual(result, registration);

                test.done();
            },

            getEntry_returns_storage_by_name_and_argsCount : function(test) {

                var name = 'test';

                var registration = {
                    service : function testService() {},
                    factory : function (c, a, b) {},
                    name : name
                };

                var storage = {};
                var argsStorage = {};
                storage[name] = argsStorage;
                argsStorage[2] = registration;

                internalStorage.tryGet.withArgs(registration.service).returns(storage);

                var result = registrationStorage.getEntry(registration);

                test.ok(result);
                test.deepEqual(result, registration);

                test.done();
            },

            getEntry_returns_null_for_no_name_match : function(test) {

                var name = 'test';
                var name2 = 'test2';

                var registration = {
                    service : function testService() {},
                    factory : function (c, a, b) {},
                    name : name
                };

                var storage = {};
                var argsStorage = {};
                storage[name2] = argsStorage;
                argsStorage[2] = registration;

                internalStorage.tryGet.withArgs(registration.service).returns(storage);

                var result = registrationStorage.getEntry(registration);

                test.ok(result === null);

                test.done();
            }

        };

    })()
}