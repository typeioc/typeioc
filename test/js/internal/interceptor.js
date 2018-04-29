'use strict';

exports.internal = {

    interceptor: (function () {

        const Scaffold = require('../scaffold');
        const ScaffoldAddons = require('../scaffoldAddons');
        const InterceptorModule = require('./../../../lib/interceptors/interceptor');
        const mockery = Scaffold.Mockery;
        const CallInfoType = ScaffoldAddons.Interceptors.CallInfoType;

        var proxy;
        var interceptor;

        function setUp(callback) {
            proxy = {
                byPrototype : mockery.stub(),
                byInstance : mockery.stub()
            };

            interceptor = new InterceptorModule.Interceptor(proxy);

            callback();
        }

        return {

            byPrototype : {
                setUp : setUp,

                intercept_throws_when_no_function_no_object: function(test) {

                    var delegate = function() {
                        interceptor.intercept(1, []);
                    };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Subject should be a prototype function or an object');
                        test.strictEqual(error.data, undefined);
                        return error instanceof Scaffold.Exceptions.ArgumentError;
                    });

                    test.expect(3);
                    test.done();
                },

                intercept_throws_when_no_wrapper: function(test) {

                    var substitute = {
                        method : 'test',
                        type: CallInfoType.Method
                    };

                    var delegate = function() {
                        interceptor.intercept(function foo() {}, [ substitute ]);
                    };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Missing interceptor wrapper');
                        test.strictEqual(error.data, substitute);
                        return error instanceof Scaffold.Exceptions.ArgumentError;
                    });

                    test.expect(3);
                    test.done();
                },

                interceptor_should_throw_ArgumentNullError_when_null_subject : function(test) {

                    var delegate = function() { interceptor.intercept(null); };

                    test.throws(delegate, function(error) {
                        test.strictEqual('subject', error.argumentName);
                        return (error instanceof Scaffold.Exceptions.ArgumentNullError);
                    });

                    test.expect(2);

                    test.done();
                },

                interceptor_should_throw_ArgumentNullError_when_undefined_subject : function(test) {

                    var delegate = function() { interceptor.intercept(undefined); };

                    test.throws(delegate, function(error) {
                        test.strictEqual('subject', error.argumentName);
                        return (error instanceof Scaffold.Exceptions.ArgumentNullError);
                    });

                    test.expect(2);

                    test.done();
                }
            },

            byInstance : {
                setUp : setUp,
               
                intercept_throws_when_no_wrapper: function(test) {

                    var substitute = {
                        method : 'test',
                        type: CallInfoType.Method
                    };

                    var subject = function foo() {};

                    var delegate = function() {
                        interceptor.intercept(new subject(), [ substitute ]);
                    };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Missing interceptor wrapper');
                        test.strictEqual(error.data, substitute);
                        return error instanceof Scaffold.Exceptions.ArgumentError;
                    });

                    test.expect(3);
                    test.done();
                }
            }
        };
    })()
}