
'use strict';

exports.api = {

    level2 : (function() {

        var scaffold = require('../../scaffold');
        var testData = scaffold.TestModule;

        var containerBuilder;

        return  {

            setUp: function (callback) {
                containerBuilder = scaffold.createBuilder();
                callback();
            },


            customParametersResolution : function (test) {

                containerBuilder.register(testData.Test1Base).as(function (c, name) {
                    return new testData.Test4(name);
                });

                var container = containerBuilder.build();
                var test1 = container.resolve(testData.Test1Base, "test 4");

                test.notEqual(test1, null);
                test.strictEqual(test1.Name, "test 4");

                test.done();
            },

            namedServicesResolution : function (test) {

                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("null");
                });
                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("a");
                }).named("A");
                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("b");
                }).named("B");

                var container = containerBuilder.build();
                var actual1 = container.resolveNamed(testData.Test1Base, "A");
                var actual2 = container.resolveNamed(testData.Test1Base, "B");
                var actual3 = container.resolve(testData.Test1Base);

                test.notEqual(actual1, null);
                test.notEqual(actual2, null);
                test.notEqual(actual3, null);
                test.strictEqual(actual1.Name, "a");
                test.strictEqual(actual2.Name, "b");
                test.strictEqual(actual3.Name, "null");

                test.done();
            },


            namedServicesResolutionWithParams : function (test) {

                containerBuilder.register(testData.Test1Base).as(function (c, name) {
                    return new testData.Test4(name);
                }).named("A");
                containerBuilder.register(testData.Test1Base).as(function (c, name) {
                    return new testData.Test4(name);
                }).named("B");

                var container = containerBuilder.build();
                var actual1 = container.resolveNamed(testData.Test1Base, "A", "a");
                var actual2 = container.resolveNamed(testData.Test1Base, "B", "b");

                test.notEqual(actual1, null);
                test.notEqual(actual2, null);
                test.strictEqual(actual1.Name, "a");
                test.strictEqual(actual2.Name, "b");

                test.done();
            },


            namedServicesResolutionWithParamsError : function (test) {

                containerBuilder.register(testData.Test1Base).as(function (c, name) {
                    return new testData.Test4(name);
                }).named("A");

                var container = containerBuilder.build();
                var delegate = function () {
                    return container.resolveNamed(testData.Test1Base, "A");
                };

                test.throws(delegate, function (err) {
                    return (err instanceof scaffold.Exceptions.ResolutionError) && /Could not resolve service/.test(err.message);
                });

                test.done();
            },

            namedServicesParametersResolution : function (test) {

                containerBuilder.register(testData.Test1Base).as(function (c, name) {
                    return new testData.Test4(name);
                }).named("A");

                var container = containerBuilder.build();
                var delegate = function () {
                    return container.resolveNamed(testData.Test1Base, "A");
                };

                test.throws(delegate, function (err) {
                    return (err instanceof scaffold.Exceptions.ResolutionError) && /Could not resolve service/.test(err.message);
                });

                test.done();
            },


            attemptNamedServicesParametersResolution : function (test) {

                containerBuilder.register(testData.Test1Base).as(function (c, name) {
                    return new testData.Test4(name);
                }).named("A");

                var container = containerBuilder.build();
                var actual = container.tryResolveNamed(testData.Test1Base, "A");
                test.equal(null, actual);

                test.done();
            },


            collidingResolution : function (test) {

                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("a");
                });
                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("b");
                });

                var container = containerBuilder.build();
                var actual1 = container.resolve(testData.Test1Base);
                var actual2 = container.resolve(testData.Test1Base);

                test.notEqual(actual1, null);
                test.notEqual(actual2, null);
                test.strictEqual(actual1.Name, "b");
                test.strictEqual(actual2.Name, "b");

                test.done();
            }
        }
    })()
}