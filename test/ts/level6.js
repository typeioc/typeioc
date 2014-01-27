'use strict';
var testData = require('./../test-data');
var scaffold = require('./../scaffold');

(function (Level6) {
    function fluentApiInitializeByNamedWithinOwnedBy(test) {
        var containerBuilder = scaffold.createBuilder();
        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).initializeBy(function (c, item) {
        }).named("Some Name").within(3 /* Hierarchy */).ownedBy(1 /* Container */);

        test.done();
    }
    Level6.fluentApiInitializeByNamedWithinOwnedBy = fluentApiInitializeByNamedWithinOwnedBy;
    ;

    function fluentApiAs(test) {
        var containerBuilder = scaffold.createBuilder();
        var registration = containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        });

        test.equal(registration['as'], undefined);
        test.notEqual(registration['initializeBy'], undefined);
        test.notEqual(registration['initializeBy'], null);
        test.notEqual(registration['named'], undefined);
        test.notEqual(registration['named'], null);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);

        test.done();
    }
    Level6.fluentApiAs = fluentApiAs;
    ;

    function fluentApiInitializeBy(test) {
        var containerBuilder = scaffold.createBuilder();
        var registration = containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).initializeBy(function (c, item) {
        });

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.notEqual(registration['named'], undefined);
        test.notEqual(registration['named'], null);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);

        test.done();
    }
    Level6.fluentApiInitializeBy = fluentApiInitializeBy;
    ;

    function fluentApiNamed(test) {
        var containerBuilder = scaffold.createBuilder();
        var registration = containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).named("Some Name");

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['named'], undefined);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);

        test.done();
    }
    Level6.fluentApiNamed = fluentApiNamed;
    ;

    function fluentApiWithin(test) {
        var containerBuilder = scaffold.createBuilder();
        var registration = containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).within(3 /* Hierarchy */);

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['named'], undefined);
        test.equal(registration['within'], undefined);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);

        test.done();
    }
    Level6.fluentApiWithin = fluentApiWithin;
    ;

    function factoryNotDefinedError(test) {
        var containerBuilder = scaffold.createBuilder();
        var registration = containerBuilder.register(testData.Test1Base);

        var delegate = function () {
            return containerBuilder.build();
        };

        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ArgumentNullError) && /Factory is not defined for: Test1Base/.test(err.message);
        });

        test.done();
    }
    Level6.factoryNotDefinedError = factoryNotDefinedError;
    ;
})(exports.Level6 || (exports.Level6 = {}));
var Level6 = exports.Level6;
//# sourceMappingURL=level6.js.map
