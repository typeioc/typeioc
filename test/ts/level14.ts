'use strict';

import scaffold = require('../scaffold');
import TestData = require('../data/test-data');

export module Level14 {

    var containerBuilder: Typeioc.IContainerBuilder;

    export var async_default_behavior = {

        setUp: function (callback) {
            containerBuilder = scaffold.createBuilder();
            callback();
        },

        resolveAsync: function (test) {

            containerBuilder.register(TestData.Test1Base).as(() => {
                return new TestData.Test1();
            });

            var container = containerBuilder.build();
            container.resolveAsync<TestData.Test1Base>(TestData.Test1Base)
                .then(actual => {
                    test.notEqual(actual, null);
                    test.strictEqual(actual.Name, "test 1");
                    test.done();
                });
        },
        
        resolveAsyncFails: function (test) {

            containerBuilder.register(TestData.Test1Base).as(() => {
                throw 'Test Error';
            });

            var container = containerBuilder.build();
            container.resolveAsync(TestData.Test1Base)
                .catch(error => {
                    test.strictEqual(error.message, 'Could not instantiate service');
                    test.ok(error.data === TestData.Test1Base);
                    test.ok(error.innerError === 'Test Error');
                    test.ok(error instanceof scaffold.Exceptions.ResolutionError);
                    test.done();
                });
        },

        resolveAsync_params: function (test) {

            containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).as((c, name) => {
                return new TestData.Test4(name);
            });

            var container = containerBuilder.build();
            container.resolveAsync<TestData.Test1Base>(TestData.Test1Base, "test 4")
                .then(actual => {
                    test.notEqual(actual, null);
                    test.strictEqual(actual.Name, "test 4");

                    test.done();
                });
        },

        tryResolveAsync: function (test) {

            var container = containerBuilder.build();

            container.tryResolveAsync<TestData.Test1Base>(TestData.Test1Base)
                .then(actual => {
                    test.equal(null, actual);
                    test.done();
                });
        },

        tryResoveAsync_params: function (test) {

            containerBuilder.register(TestData.Test1Base).as((c, name) => {
                return new TestData.Test4(name);
            });

            var container = containerBuilder.build();
            container.tryResolveAsync<TestData.Test1Base>(TestData.Test1Base, "test 4")
                .then(actual => {
                    test.notEqual(actual, null);
                    test.strictEqual(actual.Name, "test 4");

                    test.done();
                });
        },

        resolveNamedAsync: function (test) {

            containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
                .as((c, name) => new TestData.Test4(name))
                .named("A");

            containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
                .as((c, name) => new TestData.Test4(name))
                .named("B");

            var container = containerBuilder.build();
            var p1 = container.resolveNamedAsync<TestData.Test1Base>(TestData.Test1Base, "A", "a");
            var p2 = container.resolveNamedAsync<TestData.Test1Base>(TestData.Test1Base, "B", "b");

            Promise.all([p1, p2])
                .then(values => {

                    let actual1 = values[0];
                    let actual2 = values[1];

                    test.notEqual(actual1, null);
                    test.notEqual(actual2, null);
                    test.strictEqual(actual1.Name, "a");
                    test.strictEqual(actual2.Name, "b");

                    test.done();
                });
        },

        tryResolveNamedAsync: function (test) {

            containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
                .as((c, name) => new TestData.Test4(name))
                .named('A');

            var container = containerBuilder.build();
            container.tryResolveNamedAsync<TestData.Test1Base>(TestData.Test1Base, 'A', 'test')
                .then(actual => {
                    test.equal('test', actual.Name);
                    test.done();
                });
        },

        resolveWithDependencies: function (test) {

            containerBuilder.register<TestData.Test2Base>(TestData.Test2Base)
                .as(() => new TestData.Test2());

            containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
                .as(c => {
                    var test2 = c.resolve<TestData.Test2>(TestData.Test2Base);

                    return new TestData.Test3(test2);
                });

            var container = containerBuilder.build();

            var dependencies = [{
                service: TestData.Test2Base,
                factory: function (c) {

                    return {
                        get Name() {
                            return 'name from dependency';
                        }
                    };
                }
            }];

            container.resolveWithDependenciesAsync<TestData.Test1Base>(TestData.Test1Base, dependencies)
                .then(actual => {
                    test.strictEqual(actual.Name, 'Test 3 name from dependency');
                    test.done();
                });
        },

        container_disposed: function (test) {

            containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
                .as(() => new TestData.Test5())
                .dispose((item: TestData.Test5) => item.Dispose())
                .within(scaffold.Types.Scope.None)
                .ownedBy(scaffold.Types.Owner.Container);

            var container = containerBuilder.build();

            var test1 = container.resolve<TestData.Test1Base>(TestData.Test1Base);

            container.disposeAsync()
                .then(() => {
                    test.notEqual(test1, null);
                    test.strictEqual(test1.Disposed, true);
                    test.done();
                });
        }
    }
}