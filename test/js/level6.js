'use strict';
var testData = require('./../test-data');
var scaffold = require('./../scaffold');

var containerBuilder;

exports.Level6 = {

    setUp: function (callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    },

    fluentApiInitializeByNamedWithinOwnedBy : function (test) {

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).initializeBy(function (c, item) {
        }).named("Some Name")
          .within(scaffold.Types.Scope.Hierarchy)
          .ownedBy(scaffold.Types.Owner.Container);

        test.done();
    },

    fluentApiAs : function (test) {

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
    },

    fluentApiInitializeBy : function (test) {

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
    },

    fluentApiNamed : function (test) {

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
    },

    fluentApiWithin : function (test) {

        var registration = containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).within(scaffold.Types.Scope.Hierarchy);

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['named'], undefined);
        test.equal(registration['within'], undefined);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);

        test.done();
    },

    factoryNotDefinedError : function (test) {

        var registration = containerBuilder.register(testData.Test1Base);

        var delegate = function () {
            return containerBuilder.build();
        };

        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ArgumentNullError) && /Factory is not defined for: Test1Base/.test(err.message);
        });

        test.done();
    }
}
