'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const scaffold = require("./../scaffold");
const TestData = require("../data/test-data");
var Level6;
(function (Level6) {
    var containerBuilder;
    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level6.setUp = setUp;
    function fluentApiInitializeByDisposedNamedWithinOwnedBy(test) {
        containerBuilder.register(TestData.Test1Base).
            as(() => new TestData.Test5()).
            initializeBy((c, item) => item).
            dispose((item) => item.Dispose()).
            named("Some Name").
            within(3 /* Hierarchy */).
            ownedBy(1 /* Container */);
        test.done();
    }
    Level6.fluentApiInitializeByDisposedNamedWithinOwnedBy = fluentApiInitializeByDisposedNamedWithinOwnedBy;
    function fluentApiAs(test) {
        var registration = containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test5());
        test.equal(registration['as'], undefined);
        test.notEqual(registration['initializeBy'], undefined);
        test.notEqual(registration['initializeBy'], null);
        test.notEqual(registration['dispose'], undefined);
        test.notEqual(registration['dispose'], null);
        test.notEqual(registration['named'], undefined);
        test.notEqual(registration['named'], null);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);
        test.done();
    }
    Level6.fluentApiAs = fluentApiAs;
    function fluentApiInitializeBy(test) {
        var registration = containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .initializeBy((c, item) => item);
        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.notEqual(registration['dispose'], undefined);
        test.notEqual(registration['dispose'], null);
        test.notEqual(registration['named'], undefined);
        test.notEqual(registration['named'], null);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);
        test.done();
    }
    Level6.fluentApiInitializeBy = fluentApiInitializeBy;
    function fluentApiDispose(test) {
        var registration = containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .dispose((item) => item.Dispose());
        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['dispose'], undefined);
        test.notEqual(registration['named'], undefined);
        test.notEqual(registration['named'], null);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);
        test.done();
    }
    Level6.fluentApiDispose = fluentApiDispose;
    function fluentApiNamed(test) {
        var registration = containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .named("Some Name");
        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['dispose'], undefined);
        test.equal(registration['named'], undefined);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);
        test.done();
    }
    Level6.fluentApiNamed = fluentApiNamed;
    function fluentApiWithin(test) {
        var registration = containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .within(3 /* Hierarchy */);
        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['dispose'], undefined);
        test.equal(registration['named'], undefined);
        test.equal(registration['within'], undefined);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.done();
    }
    Level6.fluentApiWithin = fluentApiWithin;
    function factoryNotDefinedError(test) {
        var registration = containerBuilder.register(TestData.Test1Base);
        var delegate = () => containerBuilder.build();
        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.NullReferenceError) &&
                /Factory is not defined/.test(err.message) &&
                err.data === TestData.Test1Base;
        });
        test.done();
    }
    Level6.factoryNotDefinedError = factoryNotDefinedError;
})(Level6 = exports.Level6 || (exports.Level6 = {}));
//# sourceMappingURL=level06.js.map