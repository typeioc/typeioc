'use strict';

exports.api = {

    level14: (function () {

        const scaffold = require('../scaffold');
        const testData = scaffold.TestModule;
       
        let containerBuilder = null;

        function setUpDefaultAsync(callback) {
            containerBuilder = scaffold.createBuilder();
            callback();
        }

        return {

            async_default_behavior: {

                setUp: function (callback) {
                    containerBuilder = scaffold.createBuilder();
                    callback();
                },

                resolveAsync: function (test) {

                    containerBuilder.register(testData.Test1Base).as(() => {
                        return new testData.Test1();
                    });

                    var container = containerBuilder.build();
                    container.resolveAsync(testData.Test1Base)
                        .then(actual => {
                            test.notEqual(actual, null);
                            test.strictEqual(actual.Name, "test 1");

                            test.done();
                        });
                },

                resolveAsyncFails: function (test) {

                    containerBuilder.register(testData.Test1Base).as(() => {
                        throw 'Test Error';
                    });

                    var container = containerBuilder.build();
                    container.resolveAsync(testData.Test1Base)
                        .catch(error => {
                            test.strictEqual(error.message, 'Could not instantiate service');
                            test.ok(error.data === testData.Test1Base);
                            test.ok(error.innerError === 'Test Error');
                            test.ok(error instanceof scaffold.Exceptions.ResolutionError);
                            test.done();
                        });
                },

                resolveAsync_params: function (test) {

                    containerBuilder.register(testData.Test1Base)
                        .as((c, name) => {
                            return new testData.Test4(name);
                        });

                    var container = containerBuilder.build();
                    container.resolveAsync(testData.Test1Base, "test 4")
                        .then(actual => {
                            test.notEqual(actual, null);
                            test.strictEqual(actual.Name, "test 4");

                            test.done();
                        });
                },

                tryResolveAsync: function (test) {

                    var container = containerBuilder.build();

                    container.tryResolveAsync(testData.Test1Base)
                        .then(actual => {
                            test.equal(null, actual);
                            test.done();
                        });
                },

                tryResoveAsync_params: function (test) {

                    containerBuilder.register(testData.Test1Base)
                        .as((c, name) => {
                            return new testData.Test4(name);
                        });

                    var container = containerBuilder.build();
                    container.tryResolveAsync(testData.Test1Base, "test 4")
                        .then(actual => {
                            test.notEqual(actual, null);
                            test.strictEqual(actual.Name, "test 4");

                            test.done();
                        });
                },

                resolveNamedAsync: function (test) {

                    containerBuilder.register(testData.Test1Base)
                        .as((c, name) => new testData.Test4(name)).named("A");

                    containerBuilder.register(testData.Test1Base)
                        .as((c, name) => new testData.Test4(name)).named("B");

                    var container = containerBuilder.build();
                    var p1 = container.resolveNamedAsync(testData.Test1Base, "A", "a");
                    var p2 = container.resolveNamedAsync(testData.Test1Base, "B", "b");

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

                    containerBuilder.register(testData.Test1Base)
                        .as((c, name) => new testData.Test4(name))
                        .named('A');

                    var container = containerBuilder.build();
                    container.tryResolveNamedAsync(testData.Test1Base, 'A', 'test')
                        .then(actual => {
                            test.equal('test', actual.Name);
                            test.done();
                        });
                },

                resolveWithDependencies: function (test) {

                    containerBuilder.register(testData.Test2Base)
                        .as(function (c) {
                            return new testData.Test2();
                        });
                    containerBuilder.register(testData.Test1Base)
                        .as(function (c) {
                            var test2 = c.resolve(testData.Test2Base);

                            return new testData.Test3(test2);
                        });

                    var container = containerBuilder.build();

                    var dependencies = [{
                        service: testData.Test2Base,
                        factory: function (c) {

                            return {
                                get Name() {
                                    return 'name from dependency';
                                }
                            };
                        }
                    }];

                    container.resolveWithDependenciesAsync(testData.Test1Base, dependencies)
                        .then(actual => {
                            test.strictEqual(actual.Name, 'Test 3 name from dependency');
                            test.done();
                        });
                },

                containerOwnedInstancesAreDisposed: function (test) {

                    containerBuilder.register(testData.Test1Base)
                        .as(() => new testData.Test5())
                        .dispose(item => item.Dispose())
                        .within(scaffold.Types.Scope.None)
                        .ownedBy(scaffold.Types.Owner.Container);

                    var container = containerBuilder.build();

                    var test1 = container.resolve(testData.Test1Base);

                    container.disposeAsync()
                    .then(() => {
                        test.notEqual(test1, null);
                        test.strictEqual(test1.Disposed, true);

                        test.done();    
                    });
                }
            }
        }
            
    })()
}