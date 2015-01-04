'use strict';
var scaffold = require('./../scaffold');
var TestData = require('../data/test-data');
var Level6;
(function (Level6) {
    var containerBuilder;
    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level6.setUp = setUp;
    function fluentApiInitializeByDisposedNamedWithinOwnedBy(test) {
        containerBuilder.register(TestData.Test1Base).as(function () { return new TestData.Test5(); }).initializeBy(function (c, item) {
        }).dispose(function (item) { return item.Dispose(); }).named("Some Name").within(3 /* Hierarchy */).ownedBy(1 /* Container */);
        test.done();
    }
    Level6.fluentApiInitializeByDisposedNamedWithinOwnedBy = fluentApiInitializeByDisposedNamedWithinOwnedBy;
    function fluentApiAs(test) {
        var registration = containerBuilder.register(TestData.Test1Base).as(function () { return new TestData.Test5(); });
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
        var registration = containerBuilder.register(TestData.Test1Base).as(function () { return new TestData.Test5(); }).initializeBy(function (c, item) {
        });
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
        var registration = containerBuilder.register(TestData.Test1Base).as(function () { return new TestData.Test5(); }).dispose(function (item) { return item.Dispose(); });
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
        var registration = containerBuilder.register(TestData.Test1Base).as(function () { return new TestData.Test5(); }).named("Some Name");
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
        var registration = containerBuilder.register(TestData.Test1Base).as(function () { return new TestData.Test5(); }).within(3 /* Hierarchy */);
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
        var delegate = function () { return containerBuilder.build(); };
        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ArgumentNullError) && /Factory is not defined/.test(err.message) && err.data === TestData.Test1Base;
        });
        test.done();
    }
    Level6.factoryNotDefinedError = factoryNotDefinedError;
})(Level6 = exports.Level6 || (exports.Level6 = {}));
//# sourceMappingURL=level6.js.map