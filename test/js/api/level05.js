'use strict';

exports.api = {

    level5 : (function() {

        const scaffold = require('../scaffold');
        const testData = scaffold.TestModule;

        let containerBuilder;

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

            internallyOwnedInstancesAreDisposed : function (test) {

                containerBuilder.register(testData.Test1Base)
                    .as(function () { return new testData.Test5(); })
                    .dispose(function (item) { item.Dispose(); })
                    .within(scaffold.Types.Scope.None)
                    .ownedInternally();

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

                containerBuilder.register(testData.Test1Base)
                .as(function () {
                    return new testData.Test5();
                })
                .within(scaffold.Types.Scope.Hierarchy)
                .ownedBy(scaffold.Types.Owner.Container);

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

                containerBuilder.register(testData.Test1Base)
                .as(function () {
                    return new testData.Test5();
                })
                .within(scaffold.Types.Scope.Hierarchy)
                .ownedBy(scaffold.Types.Owner.Externals);

                var container = containerBuilder.build();
                var child = container.createChild();

                var test1 = child.resolve(testData.Test1Base);

                container.dispose();

                test.notEqual(test1, null);
                test.strictEqual(test1.Disposed, false);

                test.done();
            },

            disposingContainerDoesNotDisposeExternallyOwnedInstances : function (test) {

                containerBuilder.register(testData.Test1Base)
                .as(function () {
                    return new testData.Test5();
                })
                .within(scaffold.Types.Scope.Hierarchy)
                .ownedExternally();

                var container = containerBuilder.build();
                var child = container.createChild();

                var test1 = child.resolve(testData.Test1Base);

                container.dispose();

                test.notEqual(test1, null);
                test.strictEqual(test1.Disposed, false);

                test.done();
            },

            disposingContainerRemovesAllRegistrations: function(test) {
                containerBuilder.register(testData.Test1Base)
                .as(function () {
                    return new testData.Test1();
                })
                .named('A');

                containerBuilder.register(testData.Test1Base)
                .as(function () {
                    return new testData.Test5();
                })
                .within(scaffold.Types.Scope.Hierarchy)
                .ownedExternally();

                const container = containerBuilder.build();
                const first = container.resolveNamed(testData.Test1Base, 'A');
                const second = container.resolve(testData.Test1Base);
               
                container.dispose();

                const first2 = container.tryResolveNamed(testData.Test1Base, 'A');
                const second2 = container.tryResolve(testData.Test1Base);
               
                const delegate1 = () => container.resolveNamed(testData.Test1Base, 'A');
                const delegate2 = () => container.resolve(testData.Test1Base);

                test.ok(first);
                test.ok(second);
                test.strictEqual(first2, null);
                test.strictEqual(second2, null);

                test.throws(delegate1, function(err) {
                    return (err instanceof scaffold.Exceptions.ResolutionError);
                });

                test.throws(delegate2, function(err) {
                    return (err instanceof scaffold.Exceptions.ResolutionError);
                });

                test.done();
            },

            disposingContainerRemovesAllChildRegistrations: (test) => {

                containerBuilder.register(testData.Test1Base)
                    .as(() => new testData.Test5())
                    .within(scaffold.Types.Scope.Container)
                    .ownedInternally();
            
                const container = containerBuilder.build();
                const child = container.createChild();

                const first = child.resolve(testData.Test1Base);

                container.dispose();

                const delegate1 = () => child.resolve(testData.Test1Base);
            
                test.ok(first);

                test.throws(delegate1, function(err) {
                    return (err instanceof scaffold.Exceptions.ResolutionError);
                });
                
                test.done();
            },

            initializeIsCalledWhenInstanceIsCreated : function (test) {
                var className = "item";

                var initializer = function(c, item) {
                    item.initialize(className);
                    return item;
                };

                containerBuilder.register(testData.Initializable)
                .as(function () {
                    return new testData.Initializable2();
                })
                .initializeBy(initializer);

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
                    item.test6 = c.resolve(testData.Test6);
                    return item;
                };

                containerBuilder.register(testData.Test6)
                .as(function (c) {
                    return new testData.Test6();
                });

                containerBuilder.register(testData.Initializable)
                .as(function (c) {
                    return new testData.Initializable();
                })
                .initializeBy(initializer);

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