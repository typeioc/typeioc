'use strict';
var testData = require('./../test-data');
var scaffold = require('./../scaffold');

(function (Level2) {
    function customParametersResolution(test) {
        var containerBuilder = scaffold.createBuilder();
        containerBuilder.register(testData.Test1Base).as(function (c, name) {
            return new testData.Test4(name);
        });

        var container = containerBuilder.build();
        var test1 = container.resolve(testData.Test1Base, "test 4");

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 4");

        test.done();
    }
    Level2.customParametersResolution = customParametersResolution;
    ;

    function namedServicesResolution(test) {
        var containerBuilder = scaffold.createBuilder();

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
    }
    Level2.namedServicesResolution = namedServicesResolution;
    ;

    function namedServicesResolutionWithParams(test) {
        var containerBuilder = scaffold.createBuilder();
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
    }
    Level2.namedServicesResolutionWithParams = namedServicesResolutionWithParams;
    ;

    function namedServicesResolutionWithParamsError(test) {
        var containerBuilder = scaffold.createBuilder();
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
    }
    Level2.namedServicesResolutionWithParamsError = namedServicesResolutionWithParamsError;
    ;

    function namedServicesParametersResolution(test) {
        var containerBuilder = scaffold.createBuilder();
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
    }
    Level2.namedServicesParametersResolution = namedServicesParametersResolution;
    ;

    function attemptNamedServicesParametersResolution(test) {
        var containerBuilder = scaffold.createBuilder();
        containerBuilder.register(testData.Test1Base).as(function (c, name) {
            return new testData.Test4(name);
        }).named("A");

        var container = containerBuilder.build();
        var actual = container.tryResolveNamed(testData.Test1Base, "A");
        test.equal(null, actual);

        test.done();
    }
    Level2.attemptNamedServicesParametersResolution = attemptNamedServicesParametersResolution;
    ;

    function collidingResolution(test) {
        var containerBuilder = scaffold.createBuilder();
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
    Level2.collidingResolution = collidingResolution;
    ;
})(exports.Level2 || (exports.Level2 = {}));
var Level2 = exports.Level2;
//# sourceMappingURL=level2.js.map
