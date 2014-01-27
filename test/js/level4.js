'use strict';
var testData = require('./../test-data');
var scaffold = require('./../scaffold');

var containerBuilder;

exports.Level4 = {

    setUp: function (callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    },

    serviceRegisteredOnParentResolveOnChildContainer : function(test) {
        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test1();
        }).within(scaffold.Types.Scope.Hierarchy);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");

        test.done();
    },

    serviceRegisteredOnParentResolveOnChildContainerNoHierarchy : function (test) {
        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test1();
        });

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");

        test.done();
    },

    hierarchyScopedInstanceIsReusedOnSameContainer : function (test) {

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test4("test 4");
        }).within(scaffold.Types.Scope.Hierarchy);

        var container = containerBuilder.build();
        var test1 = container.resolve(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");

        test.done();
    },

    hierarchyScopedInstanceIsReusedOnSameContainerChildFirst : function (test) {

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test4("test 4");
        }).within(scaffold.Types.Scope.Hierarchy);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");

        test.done();
    },

    containerScopedInstanceIsNotReusedOnChild : function (test) {

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test4("test 4");
        }).within(scaffold.Types.Scope.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = container.resolve(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = child.resolve(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");

        test.done();
    },

    unknownScopeError : function (test) {
        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test4("test 4");
        }).within(5);

        var container = containerBuilder.build();
        var child = container.createChild();

        var delegate = function () {
            return child.resolve(testData.Test1Base);
        };

        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ResolutionError) && /Unknown scoping/.test(err.message);
        });

        test.done();
    }
}
