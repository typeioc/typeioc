'use strict';
const scaffold = require('../scaffold');
const TestData = require('../data/test-data');
var Level1;
(function (Level1) {
    var containerBuilder;
    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level1.setUp = setUp;
    function containerConstruction(test) {
        var container = containerBuilder.build();
        test.notEqual(container, null);
        test.done();
    }
    Level1.containerConstruction = containerConstruction;
    function errorWhenNoServiceProvided(test) {
        var delegate = function () {
            containerBuilder.register(null);
        };
        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ArgumentNullError);
        });
        test.done();
    }
    Level1.errorWhenNoServiceProvided = errorWhenNoServiceProvided;
    function parameterlessResolution(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test1());
        var container = containerBuilder.build();
        var actual = container.resolve(TestData.Test1Base);
        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");
        test.done();
    }
    Level1.parameterlessResolution = parameterlessResolution;
    function multipleParameterlessResolutions(test) {
        containerBuilder.register(TestData.Test1Base).as(() => new TestData.Test1());
        containerBuilder.register(TestData.Test2Base).as(() => new TestData.Test2());
        var container = containerBuilder.build();
        var actual1 = container.resolve(TestData.Test1Base);
        var actual2 = container.resolve(TestData.Test2Base);
        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 2");
        test.done();
    }
    Level1.multipleParameterlessResolutions = multipleParameterlessResolutions;
    function overridingResolutions(test) {
        containerBuilder.register(TestData.Test1Base).as(() => new TestData.Test1());
        containerBuilder.register(TestData.Test1Base).as(() => new TestData.Test1());
        var container = containerBuilder.build();
        var actual1 = container.resolve(TestData.Test1Base);
        var actual2 = container.resolve(TestData.Test1Base);
        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 1");
        test.done();
    }
    Level1.overridingResolutions = overridingResolutions;
    function overridingParameterContainerResolutions(test) {
        containerBuilder.register(TestData.Test1Base).as(() => new TestData.Test1());
        containerBuilder.register(TestData.Test1Base).as((c) => new TestData.Test1());
        var container = containerBuilder.build();
        var actual1 = container.resolve(TestData.Test1Base);
        var actual2 = container.resolve(TestData.Test1Base);
        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 1");
        test.done();
    }
    Level1.overridingParameterContainerResolutions = overridingParameterContainerResolutions;
    function parameterContainerResolution(test) {
        containerBuilder.register(TestData.Test1Base).as((c) => new TestData.Test1());
        var container = containerBuilder.build();
        var actual1 = container.resolve(TestData.Test1Base);
        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.done();
    }
    Level1.parameterContainerResolution = parameterContainerResolution;
    function errorNoExistingResolution(test) {
        var container = containerBuilder.build();
        var delegate = () => container.resolve(TestData.Test1Base);
        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ResolutionError) &&
                /Could not resolve service/.test(err.message);
        });
        test.done();
    }
    Level1.errorNoExistingResolution = errorNoExistingResolution;
    function attemptResolution(test) {
        var container = containerBuilder.build();
        var actual = container.tryResolve(TestData.Test1Base);
        test.equal(null, actual);
        test.done();
    }
    Level1.attemptResolution = attemptResolution;
    function attemptNamedResolution(test) {
        var container = containerBuilder.build();
        var actual = container.tryResolveNamed(TestData.Test1Base, "Test Name");
        test.equal(null, actual);
        test.done();
    }
    Level1.attemptNamedResolution = attemptNamedResolution;
    function attemptNamedExistingResolution(test) {
        containerBuilder.register(TestData.Test1Base).as(() => new TestData.Test1());
        var container = containerBuilder.build();
        var actual = container.tryResolveNamed(TestData.Test1Base, "Test Name");
        test.equal(null, actual);
        test.done();
    }
    Level1.attemptNamedExistingResolution = attemptNamedExistingResolution;
    function dependenciesResolution(test) {
        containerBuilder.register(TestData.Test2Base).as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base).as((c) => {
            var test2 = c.resolve(TestData.Test2Base);
            var n = test2.Name;
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var actual = container.resolve(TestData.Test1Base);
        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "Test 3 test 2");
        test.done();
    }
    Level1.dependenciesResolution = dependenciesResolution;
})(Level1 = exports.Level1 || (exports.Level1 = {}));
//# sourceMappingURL=level01.js.map