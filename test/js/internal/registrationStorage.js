'use strict';

exports.internal = {

    registrationStorage : (function() {
        const Scaffold = require('../scaffold');
        const RegistrationStorageModule = require('../../../lib/storage/registrationStorage');
        const mockery = Scaffold.Mockery;

        var registrationStorage;
        var internalStorage;

        return {

            setUp: function (callback) {

                internalStorage =  {
                    register : mockery.stub(),
                    tryGet : mockery.stub()
                };

                var service = {
                    create : function() {
                        return internalStorage;
                    }
                };

                registrationStorage = new RegistrationStorageModule.RegistrationStorage(service);
                callback();
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
            }
        };

    })()
}