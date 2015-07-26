'use strict';

exports.api = {

    level5 : (function() {

        var scaffold = require('../../scaffold');
        var testData = scaffold.TestModule;


        var containerBuilder;

        return {

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

            containerOwnedInstancesAreDisposedDefaultSetting : function (test) {

                scaffold.Types.Defaults.owner = scaffold.Types.Owner.Container;

                containerBuilder.register(testData.Test1Base)
                    .as(function () { return new testData.Test5(); })
                    .dispose(function (item) { item.Dispose(); });

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
            },

            instancesFromDifferentContainersDisposedDifferently : function (test) {
                var secondContainerBuilder = scaffold.createBuilder();

                containerBuilder.register(testData.Test1Base)
                    .as(function () {  return new testData.Test5();  })
                    .dispose(function (item) { item.Dispose(); })
                    .within(scaffold.Types.Scope.None)
                    .ownedBy(scaffold.Types.Owner.Container);

                secondContainerBuilder.register(testData.Test1Base)
                    .as(function () { return new testData.Test5(); })
                    .dispose(function (item) { item.Dispose(); })
                    .within(scaffold.Types.Scope.None)
                    .ownedBy(scaffold.Types.Owner.Container);

                var container = containerBuilder.build();
                var secondContainer = secondContainerBuilder.build();

                var test1 = container.resolve(testData.Test1Base);
                var test2 = secondContainer.resolve(testData.Test1Base);

                test.strictEqual(test1.Disposed, false);
                test.strictEqual(test2.Disposed, false);

                container.dispose();

                test.strictEqual(test1.Disposed, true);
                test.strictEqual(test2.Disposed, false);

                secondContainer.dispose();

                test.strictEqual(test1.Disposed, true);
                test.strictEqual(test2.Disposed, true);

                test.done();
            }
        }
    })()
}