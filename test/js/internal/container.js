'use strict';

exports.internal = {

    container: (function () {

        const Scaffold = require('../scaffold');
        const ContainerModule = require('../../../lib/build/container');
        const mockery = Scaffold.Mockery;

        const registrationStorageService = mockery.stub();
        const disposableStorageService = mockery.stub();
        const registrationBaseService = mockery.stub();
        const containerApiService = mockery.stub();
        let container;

        return {
            setUp: function (callback) {
               container =
                   new ContainerModule.Container(registrationStorageService,
                       disposableStorageService,
                       registrationBaseService,
                       containerApiService);

                callback();
            },

            resolve_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.resolve(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            resolve_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.resolve(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            tryResolve_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.tryResolve(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            tryResolve_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.tryResolve(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            resolveNamed_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.resolveNamed(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            resolveNamed_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.resolveNamed(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            tryResolveNamed_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.tryResolveNamed(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            tryResolveNamed_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.tryResolveNamed(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            resolveWithDependencies_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.resolveWithDependencies(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            resolveWithDependencies_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.resolveWithDependencies(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            resolveWith_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.resolveWithDependencies(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            },

            resolveWith_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.resolveWithDependencies(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, '');
                    test.strictEqual(error.argumentName, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(3);

                test.done();
            }
        }
    })()
}