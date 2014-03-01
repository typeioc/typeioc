
'use strict';
var scaffold = require('../../scaffold');
var testData = scaffold.TestModule;

var containerBuilder = null;

exports.api = {};

exports.api.Level1 = {

    setUp: function (callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    },

    containerConstruction : function (test) {

        var container = containerBuilder.build();

        test.notEqual(container, null);

        test.done();
    },

    parameterlessResolution : function(test) {

        containerBuilder.register(testData.Test1Base).as(function() {
            return new testData.Test1();
        });

        var container = containerBuilder.build();
        var actual = container.resolve(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    },

    multipleParameterlessResolutions : function (test) {

        containerBuilder.register(testData.Test1Base)
            .as(function () {
                return new testData.Test1();
            });
        containerBuilder.register(testData.Test2Base)
            .as(function () {
                return new testData.Test2();
            });

        var container = containerBuilder.build();
        var actual1 = container.resolve(testData.Test1Base);
        var actual2 = container.resolve(testData.Test2Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 2");

        test.done();
    },

    overridingResolutions : function overridingResolutions(test) {

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test1();
        });
        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test1();
        });

        var container = containerBuilder.build();
        var actual1 = container.resolve(testData.Test1Base);
        var actual2 = container.resolve(testData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 1");

        test.done();
    },

    overridingParameterContainerResolutions : function(test) {

        containerBuilder.register(testData.Test1Base)
            .as(function () {
                return new testData.Test1();
            });
        containerBuilder.register(testData.Test1Base)
            .as(function (c) {
                return new testData.Test1();
            });

        var container = containerBuilder.build();
        var actual1 = container.resolve(testData.Test1Base);
        var actual2 = container.resolve(testData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 1");

        test.done();
    },

    parameterContainerResolution : function (test) {

        containerBuilder.register(testData.Test1Base)
            .as(function (c) {
                return new testData.Test1();
            });

        var container = containerBuilder.build();
        var actual1 = container.resolve(testData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");

        test.done();
    },

    errorNoExistingResolution : function errorNoExistingResolution(test) {

        var container = containerBuilder.build();

        var delegate = function () {
            return container.resolve(testData.Test1Base);
        };

        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ResolutionError) && /Could not resolve service/.test(err.message);
        });

        test.done();
    },

    attemptResolution : function (test) {

        var container = containerBuilder.build();

        var actual = container.tryResolve(testData.Test1Base);

        test.equal(null, actual);

        test.done();
    },

    attemptNamedResolution : function (test) {

        var container = containerBuilder.build();

        var actual = container.tryResolveNamed(testData.Test1Base, "Test Name");

        test.equal(null, actual);

        test.done();
    },

    attemptNamedExistingResolution : function (test) {

        containerBuilder.register(testData.Test1Base)
            .as(function () {
                return new testData.Test1();
            });
        var container = containerBuilder.build();

        var actual = container.tryResolveNamed(testData.Test1Base, "Test Name");

        test.equal(null, actual);

        test.done();
    },

    dependenciesResolution : function (test) {

        containerBuilder.register(testData.Test2Base)
            .as(function () {
                return new testData.Test2();
            });
        containerBuilder.register(testData.Test1Base)
            .as(function (c) {
                var test2 = c.resolve(testData.Test2Base);

                return new testData.Test3(test2);
        });

        var container = containerBuilder.build();
        var actual = container.resolve(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "Test 3 test 2");

        test.done();
    }
}