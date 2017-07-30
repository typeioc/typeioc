'use strict';

exports.api = {

    level15: (function () {

        var scaffold = require('./../../scaffold');
        var testData = scaffold.TestModule;
     
        var containerBuilder;

        return {

            async_api: {
                setUp: function (callback) {
                    containerBuilder = scaffold.createBuilder();
                    callback();
                },

                fluentApiResolveWith: function (test) {

                    var container = containerBuilder.build();
                    var registration = container.resolveWith(testData.Test1Base);

                    test.notEqual(registration['execAsync'], undefined);
                    test.notEqual(registration['execAsync'], null);

                    test.done();
                },

                fluentApiResolveWithArgs: function (test) {

                    var container = containerBuilder.build();
                    var registration = container
                        .resolveWith(testData.Test1Base)
                        .args([]);

                    test.notEqual(registration['execAsync'], undefined);
                    test.notEqual(registration['execAsync'], null);

                    test.done();
                },

                fluentApiResolveWithArgsAttempt: function (test) {

                    var container = containerBuilder.build();
                    var registration = container
                        .resolveWith(testData.Test1Base)
                        .args([])
                        .attempt();

                    test.notEqual(registration['execAsync'], undefined);
                    test.notEqual(registration['execAsync'], null);

                    test.done();
                },

                fluentApiResolveWithArgsAttemptName: function (test) {

                    var container = containerBuilder.build();
                    var registration = container
                        .resolveWith(testData.Test1Base)
                        .args([])
                        .attempt()
                        .name('');

                    test.notEqual(registration['execAsync'], undefined);
                    test.notEqual(registration['execAsync'], null);

                    test.done();
                },

                fluentApiResolveWithArgsAttemptNameDependencies: function (test) {

                    var container = containerBuilder.build();
                    var registration = container
                        .resolveWith(testData.Test1Base)
                        .args([])
                        .attempt()
                        .name('')
                        .dependencies([]);

                    test.notEqual(registration['execAsync'], undefined);
                    test.notEqual(registration['execAsync'], null);

                    test.done();
                },

                fluentApiResolveWithArgsAttemptNameDependenciesCache: function (test) {

                    var container = containerBuilder.build();
                    var registration = container
                        .resolveWith(testData.Test1Base)
                        .args([])
                        .attempt()
                        .name('')
                        .dependencies([])
                        .cache();

                    test.notEqual(registration['execAsync'], undefined);
                    test.notEqual(registration['execAsync'], null);

                    test.done();
                }
            },

            async_default_behavior: {

                setUp: function (callback) {
                    containerBuilder = scaffold.createBuilder();
                    callback();
                },

                resolveWithResolvesService: function (test) {

                    containerBuilder.register(testData.Test2Base)
                        .as(function () {
                            return new testData.Test2();
                        });

                    var container = containerBuilder.build();

                    container.resolveWith(testData.Test2Base)
                        .execAsync()
                        .then(actual => {
                            test.ok(actual);
                            test.ok(actual instanceof testData.Test2);
                            test.strictEqual(actual.Name, 'test 2');

                            test.done();
                        });
                },

                resolveWithThrowsErrorWhenNotFound: function (test) {

                    containerBuilder.register(testData.Test2Base)
                        .as(() => new testData.Test2());

                    var container = containerBuilder.build();

                    container.resolveWith(testData.Test1Base)
                        .execAsync()
                        .catch(error => {
                            test.strictEqual(error.message, 'Could not resolve service');
                            test.strictEqual(error.data, testData.Test1Base);
                            test.ok(error instanceof scaffold.Exceptions.ResolutionError);

                            test.done();
                        });
                },

                resolveWithResolvesServiceWithArgs: function (test) {

                    var arg1 = 'arg 1';
                    var arg2 = 'arg 2';
                    var expected = arg1 + ' ' + arg2;

                    containerBuilder.register(testData.Test1Base)
                        .as((c, name1, name2) => new testData.Test4(expected));

                    var container = containerBuilder.build();

                    container
                        .resolveWith(testData.Test1Base)
                        .args(arg1, arg2)
                        .execAsync()
                        .then(actual => {
                            test.ok(actual);
                            test.ok(actual instanceof testData.Test4);
                            test.strictEqual(actual.Name, expected);

                            test.done();
                        });
                },

                resolveWithAttemptsResolvesService: function (test) {

                    containerBuilder.register(testData.Test2Base)
                        .as(() => new testData.Test2());

                    var container = containerBuilder.build();

                    var actual = container.resolveWith(testData.Test2Base)
                        .attempt()
                        .execAsync()
                        .then(actual => {
                            test.ok(actual);
                            test.ok(actual instanceof testData.Test2);
                            test.strictEqual(actual.Name, 'test 2');

                            test.done();
                        });
                },

                resolveWithResolvesNamedService: function (test) {

                    var testName = 'testName';

                    containerBuilder.register(testData.Test2Base)
                        .as(() => new testData.Test2())
                        .named(testName);

                    var container = containerBuilder.build();

                    var actual = container.resolveWith(testData.Test2Base)
                        .name(testName)
                        .execAsync()
                        .then(actual => {

                            test.ok(actual);
                            test.ok(actual instanceof testData.Test2);
                            test.strictEqual(actual.Name, 'test 2');

                            test.done();
                        });
                },

                resolvesWithResolvesDependency: function (test) {

                    containerBuilder.register(testData.Test2Base)
                        .as(() => new testData.Test2());

                    containerBuilder.register(testData.Test1Base)
                        .as(function (c) {
                            var test2 = c.resolve(testData.Test2Base);

                            return new testData.Test3(test2);
                        });

                    var container = containerBuilder.build();

                    var dependencies = [{
                        service: testData.Test2Base,
                        factory: function () {

                            return {
                                get Name() {
                                    return 'name from dependency';
                                }
                            };
                        }
                    }];

                    var actual = container.resolveWith(testData.Test1Base)
                        .dependencies(dependencies)
                        .execAsync()
                        .then(actual => {
                            test.ok(actual);
                            test.ok(actual instanceof testData.Test1Base);
                            test.strictEqual(actual.Name, 'Test 3 name from dependency');

                            test.done();
                        });
                },
                
                resolvesWithResolvesNamedDependency: function (test) {

                    containerBuilder.register(testData.Test2Base)
                        .as(() => new testData.Test2())
                        .named('A');

                    containerBuilder.register(testData.Test1Base)
                        .as(c => {
                            var test2 = c.resolveNamed(testData.Test2Base, 'A');
                            return new testData.Test3(test2);
                        });

                    var container = containerBuilder.build();

                    var dependencies = [{
                        named: 'A',
                        service: testData.Test2Base,
                        factory: () => ({
                            get Name() {
                                return 'name from dependency';
                            }
                        })
                    }];

                    var actual = container
                        .resolveWith(testData.Test1Base)
                        .dependencies(dependencies)
                        .execAsync()
                        .then(actual => {
                            test.ok(actual);
                            test.ok(actual instanceof testData.Test1Base);
                            test.strictEqual(actual.Name, 'Test 3 name from dependency');

                            test.done();
                        });
                },

                resolveWithResolvesCacheDefault: function (test) {

                    containerBuilder.register(testData.Test2Base)
                        .as(function () {
                            return new testData.Test2();
                        });

                    var container = containerBuilder.build();

                    container.resolveWith(testData.Test2Base)
                        .cache()
                        .execAsync()
                        .then(() => {
                            var cache = container.cache;
                            var actual = cache.Test2Base;
                            var actual2 = cache.Test2Base;

                            test.ok(actual);
                            test.ok(actual instanceof testData.Test2);
                            test.strictEqual(actual.Name, 'test 2');
                            test.strictEqual(actual, actual2);

                            test.done();
                        });
                }
            }
        }
    })()
}