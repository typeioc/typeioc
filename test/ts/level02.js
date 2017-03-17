'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const scaffold = require("./../scaffold");
const TestData = require("../data/test-data");
var Level2;
(function (Level2) {
    var containerBuilder;
    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level2.setUp = setUp;
    function customParametersResolution(test) {
        containerBuilder.register(TestData.Test1Base)
            .as((c, name) => new TestData.Test4(name));
        var container = containerBuilder.build();
        var test1 = container.resolve(TestData.Test1Base, "test 4");
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 4");
        test.done();
    }
    Level2.customParametersResolution = customParametersResolution;
    function namedServicesResolution(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("null"));
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("a")).named("A");
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("b")).named("B");
        var container = containerBuilder.build();
        var actual1 = container.resolveNamed(TestData.Test1Base, "A");
        var actual2 = container.resolveNamed(TestData.Test1Base, "B");
        var actual3 = container.resolve(TestData.Test1Base);
        test.notEqual(actual1, null);
        test.notEqual(actual2, null);
        test.notEqual(actual3, null);
        test.strictEqual(actual1.Name, "a");
        test.strictEqual(actual2.Name, "b");
        test.strictEqual(actual3.Name, "null");
        test.done();
    }
    Level2.namedServicesResolution = namedServicesResolution;
    function namedServicesResolutionWithParams(test) {
        containerBuilder.register(TestData.Test1Base)
            .as((c, name) => new TestData.Test4(name)).named("A");
        containerBuilder.register(TestData.Test1Base)
            .as((c, name) => new TestData.Test4(name)).named("B");
        var container = containerBuilder.build();
        var actual1 = container.resolveNamed(TestData.Test1Base, "A", "a");
        var actual2 = container.resolveNamed(TestData.Test1Base, "B", "b");
        test.notEqual(actual1, null);
        test.notEqual(actual2, null);
        test.strictEqual(actual1.Name, "a");
        test.strictEqual(actual2.Name, "b");
        test.done();
    }
    Level2.namedServicesResolutionWithParams = namedServicesResolutionWithParams;
    function namedServicesResolutionWithParamsError(test) {
        containerBuilder.register(TestData.Test1Base)
            .as((c, name) => new TestData.Test4(name)).named("A");
        var container = containerBuilder.build();
        var delegate = () => container.resolveNamed(TestData.Test1Base, "A");
        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ResolutionError) &&
                /Could not resolve service/.test(err.message);
        });
        test.done();
    }
    Level2.namedServicesResolutionWithParamsError = namedServicesResolutionWithParamsError;
    function namedServicesParametersResolution(test) {
        containerBuilder.register(TestData.Test1Base)
            .as((c, name) => new TestData.Test4(name)).named("A");
        var container = containerBuilder.build();
        var delegate = () => container.resolveNamed(TestData.Test1Base, "A");
        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ResolutionError) &&
                /Could not resolve service/.test(err.message);
        });
        test.done();
    }
    Level2.namedServicesParametersResolution = namedServicesParametersResolution;
    function attemptServicesParametersResolution(test) {
        containerBuilder.register(TestData.Test1Base)
            .as((c, name) => new TestData.Test4(name));
        var container = containerBuilder.build();
        var actual = container.tryResolve(TestData.Test1Base, 'test');
        test.equal("test", actual.Name);
        test.done();
    }
    Level2.attemptServicesParametersResolution = attemptServicesParametersResolution;
    function attemptNamedServicesParametersResolution(test) {
        containerBuilder.register(TestData.Test1Base)
            .as((c, name) => new TestData.Test4(name)).named('A');
        var container = containerBuilder.build();
        var actual = container.tryResolveNamed(TestData.Test1Base, 'A', 'test');
        test.equal("test", actual.Name);
        test.done();
    }
    Level2.attemptNamedServicesParametersResolution = attemptNamedServicesParametersResolution;
    function collidingResolution(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("a"));
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("b"));
        var container = containerBuilder.build();
        var actual1 = container.resolve(TestData.Test1Base);
        var actual2 = container.resolve(TestData.Test1Base);
        test.notEqual(actual1, null);
        test.notEqual(actual2, null);
        test.strictEqual(actual1.Name, "b");
        test.strictEqual(actual2.Name, "b");
        test.done();
    }
    Level2.collidingResolution = collidingResolution;
})(Level2 = exports.Level2 || (exports.Level2 = {}));
//# sourceMappingURL=level02.js.map