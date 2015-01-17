'use strict';

exports.internal = {

    container: (function () {

        var Scaffold = require('../../scaffold');
        var ContainerModule = require('../../../lib/build/container');
        var mockery = Scaffold.Mockery;

        var registrationStorageService = mockery.stub();
        var disposableStorageService = mockery.stub();
        var registrationBaseService = mockery.stub();
        var containerApiService = mockery.stub();
        var container;

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
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            resolve_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.resolve(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            tryResolve_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.tryResolve(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            tryResolve_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.tryResolve(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            resolveNamed_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.resolveNamed(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            resolveNamed_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.resolveNamed(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            tryResolveNamed_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.tryResolveNamed(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            tryResolveNamed_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.tryResolveNamed(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            resolveWithDependencies_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.resolveWithDependencies(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            resolveWithDependencies_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.resolveWithDependencies(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            resolveWith_throws_when_null_service: function(test) {

                var delegate = function() {
                    container.resolveWithDependencies(null);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            },

            resolveWith_throws_when_undefined_service: function(test) {

                var delegate = function() {
                    container.resolveWithDependencies(undefined);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'service');
                    return error instanceof Scaffold.Exceptions.ArgumentNullError;
                });

                test.expect(2);

                test.done();
            }
        }
    })()
}