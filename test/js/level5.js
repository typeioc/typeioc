'use strict';
var testData = require('./../test-data');
var scaffold = require('./../scaffold');

var containerBuilder;

exports.Level5 = {

    setUp: function (callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    },

    containerOwnedInstancesAreDisposed : function (test) {

        containerBuilder.register(testData.Test1Base)
            .as(function () { return new testData.Test5(); })
            .dispose(function (item) { item.Dispose(); })
            .within(scaffold.Types.Scope.None)
            .ownedBy(scaffold.Types.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    },

    containerOwnedAndContainerReusedInstancesAreDisposed : function (test) {

        containerBuilder.register(testData.Test1Base)
            .as(function () { return new testData.Test5(); })
            .dispose(function (item) { item.Dispose(); })
            .within(scaffold.Types.Scope.Container)
            .ownedBy(scaffold.Types.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    },

    containerOwnedAndHierarchyReusedInstancesAreDisposed : function(test) {

        containerBuilder.register(testData.Test1Base)
            .as(function () { return new testData.Test5(); })
            .dispose(function (item) { item.Dispose(); })
            .within(scaffold.Types.Scope.Hierarchy)
            .ownedBy(scaffold.Types.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    },

    childContainerInstanceWithParentRegistrationIsNotDisposed : function (test) {

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).within(scaffold.Types.Scope.Hierarchy).ownedBy(scaffold.Types.Owner.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve(testData.Test1Base);

        child.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, false);

        test.done();
    },

    disposingParentContainerDisposesChildContainerInstances : function (test) {

        containerBuilder.register(testData.Test1Base)
            .as(function () { return new testData.Test5(); })
            .dispose(function (item) { item.Dispose(); })
            .within(scaffold.Types.Scope.None)
            .ownedBy(scaffold.Types.Owner.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    },

    disposingContainerDoesNotDisposeExternalOwnedInstances : function (test) {

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).within(scaffold.Types.Scope.Hierarchy).ownedBy(scaffold.Types.Owner.Externals);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, false);

        test.done();
    },

    serviceEntryProperlyCloned : function (test) {
        var initializer = function (c, item) { };

        var serviceEntry = new scaffold.RegistrationBase.RegistrationBase(function () {
            return new testData.Test5();
        });
        serviceEntry.initializer = initializer;
        serviceEntry.scope = scaffold.Types.Scope.Hierarchy;

        var containerBuilder = scaffold.createBuilder();
        var container = containerBuilder.build();

        var actual = serviceEntry.cloneFor(container);

        test.strictEqual(actual.factory, serviceEntry.factory);
        test.strictEqual(actual.scope, serviceEntry.scope);
        test.strictEqual(actual.scope, scaffold.Types.Scope.Hierarchy);
        test.strictEqual(actual.container, container);
        test.strictEqual(actual.initializer, initializer);

        test.done();
    },

    initializeIsCalledWhenInstanceIsCreated : function (test) {
        var className = "item";

        var initializer = function(c, item) {
            item.initialize(className);
        };

        containerBuilder.register(testData.Initializable).as(function () {
            return new testData.Initializable2();
        }).initializeBy(initializer);

        var container = containerBuilder.build();

        var i1 = container.resolve(testData.Initializable);
        var i2 = container.resolve(testData.Initializable);

        test.deepEqual(i1, i2);
        test.deepEqual(i1.name, i2.name);
        test.deepEqual(i1.name, className);

        test.done();
    },

    initializeAndResolveDependencies : function (test) {
        var className = "item";

        var initializer = function(c, item) {
            item.initialize(className);
            item.test6 = c.resolve<testData.Test6>(testData.Test6);
        };

        containerBuilder.register(testData.Test6).as(function (c) {
            return new testData.Test6();
        });
        containerBuilder.register(testData.Initializable).as(function (c) {
            return new testData.Initializable();
        }).initializeBy(initializer);

        var container = containerBuilder.build();

        var i1 = container.resolve(testData.Initializable);

        test.notEqual(i1, null);
        test.notEqual(i1, undefined);
        test.deepEqual(i1.name, className);
        test.notEqual(i1.test6, null);

        test.done();
    }
}