'use strict';

import scaffold = require('./../scaffold');
import TestData = require('../data/test-data');


export module Level9 {

    var containerBuilder:Typeioc.IContainerBuilder;

    export function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }

    export function resolveWithResolvesService(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function () {
                return new TestData.Test2();
            });

        var container = containerBuilder.build();

        var actual = container.resolveWith<TestData.Test2Base>(TestData.Test2Base)
            .exec();

        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');

        test.done();
    }

    export function resolveWithThrowsErrorWhenNotFound(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function () {
                return new TestData.Test2();
            });

        var container = containerBuilder.build();

        var delegate = function() {
            container.resolveWith(TestData.Test1Base)
                .exec();
        };

        test.throws(delegate, function(error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test1Base);

            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(3);

        test.done();
    }

    export function resolveWithResolvesServiceWithArgs(test) {

        var arg1 = 'arg 1';
        var arg2 = 'arg 2';
        var expected = arg1 + ' ' + arg2;

        containerBuilder.register(TestData.Test1Base)
            .as(function (c, name1, name2) {
                return new TestData.Test4(expected);
            });

        var container = containerBuilder.build();

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .args(arg1, arg2)
            .exec();

        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, expected);

        test.done();
    }

    export function resolveWithAttemptsResolvesService(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function () {
                return new TestData.Test2();
            });

        var container = containerBuilder.build();

        var actual = container
            .resolveWith<TestData.Test2Base>(TestData.Test2Base)
            .attempt()
            .exec();

        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');

        test.done();
    }

    export function resolveWithAttemptsFalseService(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function () {
                return new TestData.Test2();
            });

        var container = containerBuilder.build();

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .attempt()
            .exec();

        test.ok(actual === null);

        test.done();
    }

    export function resolveWithResolvesNamedService(test) {

        var testName = 'testName';

        containerBuilder.register(TestData.Test2Base)
            .as(function () {
                return new TestData.Test2();
            })
            .named(testName);

        var container = containerBuilder.build();

        var actual = container
            .resolveWith<TestData.Test2Base>(TestData.Test2Base)
            .name(testName)
            .exec();

        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');

        test.done();
    }

    export function resolveWithThrowsWhenNoName(test) {

        var testName = 'testName';

        containerBuilder.register(TestData.Test2Base)
            .as(function () {
                return new TestData.Test2();
            })
            .named(testName);

        var container = containerBuilder.build();

        var delegate = function() {
            container
                .resolveWith<TestData.Test2Base>(TestData.Test2Base)
                .exec();
        };

        test.throws(delegate, function(error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test2Base);

            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(3);

        test.done();
    }

    export function resolvesWithResolvesDependency(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function (c) {
                return new TestData.Test2();
            });
        containerBuilder.register(TestData.Test1Base)
            .as(function (c) {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var dependencies = [{
            service: TestData.Test2Base,
            factory: function () {

                return {
                    get Name() {
                        return 'name from dependency';
                    }
                };
            }
        }];

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .dependencies(dependencies)
            .exec();

        test.ok(actual);
        test.ok(actual instanceof TestData.Test1Base);
        test.strictEqual(actual.Name, 'Test 3 name from dependency');

        test.done();
    }

    export function resolveWithResolvesCacheDefault (test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function () {
                return new TestData.Test2();
            });

        var container = containerBuilder.build();

        container
            .resolveWith<TestData.Test2Base>(TestData.Test2Base)
            .cache()
            .exec();

        var cache = container.cache;

        var actual = cache.Test2Base;
        var actual2 = cache.Test2Base;

        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');

        test.strictEqual(actual, actual2);

        test.done();
    }

    export function resolveWithResolvesCacheWithName(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function () {
                return new TestData.Test2();
            });

        var container = containerBuilder.build();

        container.resolveWith(TestData.Test2Base)
            .cache('TestName111')
            .exec();

        var cache = container.cache;

        var actual = cache.TestName111;

        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');

        test.done();
    }

    export function resolveWithResolvesCacheWithServiceNamedResolution(test) {

        var named : any = function AAAAA() {};

        containerBuilder.register(TestData.Test2Base)
            .as(function () {
                return new TestData.Test2();
            }).named(named.name);

        var container = containerBuilder.build();

        container.resolveWith(TestData.Test2Base)
            .name(named.name)
            .cache()
            .exec();

        var cache = container.cache;

        var actual = cache.AAAAA;

        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');

        test.done();
    }

    export function resolveWithResolvesCacheWithServiceValueName(test) {

        var name = "AAAAAA";

        containerBuilder.register(name)
            .as(function () {
                return new TestData.Test2();
            });

        var container = containerBuilder.build();

        container.resolveWith(name)
            .cache()
            .exec();

        var cache = container.cache;

        var actual = cache[name];
        var actual2 = cache.AAAAAA;

        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');

        test.strictEqual(actual, actual2);

        test.done();
    }

    export function resolveWithCacheThrowsWhenNoName(test) {

        var service = {};

        containerBuilder.register(service)
            .as(function () {
                return new TestData.Test2();
            });

        var container = containerBuilder.build();

        var delegate = function() {
            container.resolveWith(service)
                .cache()
                .exec();
        };

        test.throws(delegate, function(error) {
            test.strictEqual(error.message, 'Missing cache name');
            test.strictEqual(error.data, undefined);

            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(3);

        test.done();
    }

    export function resolveWithCacheFromChildContainer(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function () {
                return new TestData.Test2();
            });

        var container = containerBuilder.build();
        var child = container.createChild();

        var actual = child
            .resolveWith<TestData.Test2Base>(TestData.Test2Base)
            .cache()
            .exec();

        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');


        test.done();
    }

    export function resolveWithArgsAttempt(test) {

        var name = 'AAAAA';

        containerBuilder.register(TestData.Test1Base)
            .as(function (c, name) {
                return new TestData.Test4(name);
            });

        var container = containerBuilder.build();

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .args(name)
            .attempt()
            .exec();

        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, name);

        test.done();
    }

    export function resolveWithArgsAttemptThrows(test) {

        var name = 'AAAAA';

        containerBuilder.register(TestData.Test1Base)
            .as(function (c, name) {
                return new TestData.Test4(name);
            });

        var container = containerBuilder.build();

        var actual = container
            .resolveWith<TestData.Test2Base>(TestData.Test2Base)
            .args(name)
            .attempt()
            .exec();

        test.strictEqual(actual, null);

        test.done();
    }

    export function resolveWithArgsNamed(test) {

        var argName = 'AAAAA';
        var resolutionName = 'Test name';

        containerBuilder.register(TestData.Test1Base)
            .as(function (c, name) {
                return new TestData.Test4(name);
            })
            .named(resolutionName);

        var container = containerBuilder.build();

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .args(argName)
            .name(resolutionName)
            .exec();

        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);

        test.done();
    }

    export function resolveWithArgsDependencies(test) {

        var param = 'Some name';

        containerBuilder.register(TestData.Test2Base)
            .as(function (c) {
                return new TestData.Test2();
            });
        containerBuilder.register(TestData.Test1Base)
            .as(function (c, arg) {
                var test2 = c.resolve(TestData.Test2Base);

                var result = new TestData.Test3(test2);

                return {
                    get Name() {
                        return [result.Name, arg].join(' ');
                    }
                };
            });

        var container = containerBuilder.build();

        var dependencies = [{
            service: TestData.Test2Base,
            factory: function () {

                return {
                    get Name() {
                        return 'name from dependency';
                    }
                };
            }
        }];

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .args(param)
            .dependencies(dependencies)
            .exec();

        test.ok(actual);
        test.strictEqual(actual.Name, 'Test 3 name from dependency Some name');

        test.done();
    }

    export function resolveWithArgsParamsDependencies(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function (_, a, b, d) {
                return {
                    get Name() {
                        return [a, b, d].join(' ');
                    }
                }
            });
        containerBuilder.register(TestData.Test1Base)
            .as(function (c, a, b, d) {
                var test2 = c.resolve(TestData.Test2Base, a, b, d);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var dependencies = [{
            service: TestData.Test2Base,
            factory: function (c, a, b, d) {

                return {
                    get Name() {
                        return [a, b, d,].join(' - ');
                    }
                };
            }
        }];

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .args('4', '5', '6')
            .dependencies(dependencies)
            .exec();

        test.strictEqual(actual.Name, 'Test 3 4 - 5 - 6');

        test.done();
    }

    export function resolveWithArgsParamsDependenciesThrowsWhenWrongArgsCount(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function (_, a, b, d) {
                return {
                    get Name() {
                        return [a, b, d].join(' ');
                    }
                }
            });
        containerBuilder.register(TestData.Test1Base)
            .as(function (c, a, b, d) {
                var test2 = c.resolve(TestData.Test2Base, a, b, d);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var dependencies = [{
            service: TestData.Test2Base,
            factory: function (c, a, b) {

                return {
                    get Name() {
                        return [a, b].join(' - ');
                    }
                };
            }
        }];

        var delegate = function() {
            container.resolveWith<TestData.Test1Base>(TestData.Test1Base)
                .args('4', '5', '6')
                .dependencies(dependencies)
                .exec();
        };

        test.throws(delegate, function(error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test2Base);

            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(3);

        test.done();
    }

    export function resolveWithArgsCacheNoName(test) {

        var argName = 'AAAAA';

        containerBuilder.register(TestData.Test1Base)
            .as(function (c, name) {
                return new TestData.Test4(name);
            });

        var container = containerBuilder.build();

        container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .args(argName)
            .cache()
            .exec();

        var actual = container.cache.Test1Base;

        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);

        test.done();
    }

    export function resolveWithAttemptWithName(test) {

        var argName = 'AAAAA';
        var resolutionName = 'Test';

        containerBuilder.register(TestData.Test1Base)
            .as(function () {
                return new TestData.Test4(argName);
            })
            .named(resolutionName);

        var container = containerBuilder.build();

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .attempt()
            .name(resolutionName)
            .exec();


        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);

        test.done();
    }

    export function resolveWithAttemptDependencies(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function (_) {
                return {
                    get Name() {
                        return 'Test2Base';
                    }
                }
            });
        containerBuilder.register(TestData.Test1Base)
            .as(function (c) {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var dependencies = [{
            service: TestData.Test2Base,
            factory: function (c) {

                return {
                    get Name() {
                        return 'Test2 substitute';
                    }
                };
            }
        }];

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .attempt()
            .dependencies(dependencies)
            .exec();

        test.strictEqual(actual.Name, 'Test 3 Test2 substitute');

        test.done();
    }

    export function resolveWithAttemptDependenciesMissingResolution(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(() => {
                return {
                    get Name() {
                        return 'Test2Base';
                    }
                }
            });
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var dependencies = [{
            service: {},
            factory: () => {

                return {
                    get Name() {
                        return 'Test2 substitute';
                    }
                };
            }
        }];

        var actual = container.resolveWith(TestData.Test1Base)
            .attempt()
            .dependencies(dependencies)
            .exec();

        test.strictEqual(actual, null);

        test.done();
    }

    export function resolveWithAttemptDependenciesMissingNonRequiredResolution(test) {

        containerBuilder.register(TestData.Test1Base)
            .as(c => {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var dependencies = [{
            service : TestData.Test2Base,
            required : false,
            factory : () => {

                return {
                    get Name() {
                        return 'name from dependency';
                    }
                };
            }
        }];

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .attempt()
            .dependencies(dependencies)
            .exec();

        test.ok(actual);
        test.strictEqual(actual.Name, 'Test 3 name from dependency');

        test.done();
    }

    export function resolveWithAttemptPartialMissingNonRequiredDependencies(test) {

        containerBuilder.register(TestData.Test1Base)
            .as(c => {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .named("Test 4");

        var dynamicService = function () {};
        containerBuilder.register(dynamicService)
            .as(c => {

                var test1 = c.resolve(TestData.Test1Base);
                var test2 = c.resolve(TestData.Test2Base);

                var test4 = c.resolveNamed(TestData.Test1Base, "Test 4");

                return new TestData.Test7(test1, test2, test4);
            });

        var container = containerBuilder.build();

        var dependencies = [{
            service : TestData.Test1Base,
            factory : () => {

                return {
                    get Name() {
                        return 'test 1 base';
                    }
                }
            }
        },
        {
            service : TestData.Test2Base,
            required : false,
            factory : () => {

                return {
                    get Name() {
                        return 'test 2 base';
                    }
                }
            }
        },
        {
            service : TestData.Test1Base,
            named : "Test 4",
            factory : () => {

                return {
                    get Name () {
                        return 'test 4 base'
                    }
                };
            }
        }];

        var actual = container
            .resolveWith<{Name : string}>(dynamicService)
            .attempt()
            .dependencies(dependencies)
            .exec();

        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');

        test.expect(3);

        test.done();
    }

    export function resolveWithAttemptCache(test) {
        var argName = 'AAAAA';

        containerBuilder.register(TestData.Test1Base)
            .as(function (c) {
                return new TestData.Test4(argName);
            });

        var container = containerBuilder.build();

        container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .attempt()
            .cache()
            .exec();

        var actual = container.cache.Test1Base;

        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);

        test.done();
    }

    export function resolveWithNameDependencies(test) {

        var resolutionName = 'AAAAA';

        containerBuilder.register(TestData.Test2Base)
            .as(function (_) {
                return {
                    get Name() {
                        return 'Test2Base';
                    }
                }
            });

        containerBuilder.register(TestData.Test1Base)
            .as(function (c) {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            })
            .named(resolutionName);

        var container = containerBuilder.build();

        var dependencies = [{
            service: TestData.Test2Base,
            factory: function (c) {

                return {
                    get Name() {
                        return 'Test2 substitute';
                    }
                };
            }
        }];

        var actual = container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .name(resolutionName)
            .dependencies(dependencies)
            .exec();

        test.strictEqual(actual.Name, 'Test 3 Test2 substitute');

        test.done();
    }

    export function resolutionWithNameCache(test) {
        var argName = 'ArgName';
        var resolutionName = 'AAAAA';

        containerBuilder.register(TestData.Test1Base)
            .as(function () {
                return new TestData.Test4(argName);
            })
            .named(resolutionName);

        var container = containerBuilder.build();

        container
            .resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .name(resolutionName)
            .cache()
            .exec();

        var actual = container.cache.AAAAA;

        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);

        test.done();
    }

    export function resolveWithDependenciesCache(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(function (_) {
                return {
                    get Name() {
                        return 'Test2Base';
                    }
                }
            });

        containerBuilder.register(TestData.Test1Base)
            .as(function (c) {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var dependencies = [{
            service: TestData.Test2Base,
            factory: function (c) {

                return {
                    get Name() {
                        return 'Test2 substitute';
                    }
                };
            }
        }];

        container.resolveWith<TestData.Test1Base>(TestData.Test1Base)
            .dependencies(dependencies)
            .cache()
            .exec();

        var actual = container.cache.Test1Base;

        test.ok(actual);
        test.ok(actual instanceof TestData.Test3);

        test.strictEqual(actual.Name, 'Test 3 Test2 substitute');

        test.done();
    }

    export function fluentApiResolveWith(test) {

        var container = containerBuilder.build();
        var registration = container.resolveWith(TestData.Test1Base);

        test.notEqual(registration['args'], undefined);
        test.notEqual(registration['args'], null);
        test.notEqual(registration['attempt'], undefined);
        test.notEqual(registration['attempt'], null);
        test.notEqual(registration['name'], undefined);
        test.notEqual(registration['name'], null);
        test.notEqual(registration['dependencies'], undefined);
        test.notEqual(registration['dependencies'], null);
        test.notEqual(registration['cache'], undefined);
        test.notEqual(registration['cache'], null);
        test.notEqual(registration['exec'], undefined);
        test.notEqual(registration['exec'], null);

        test.done();
    }

    export function fluentApiResolveWithArgs(test) {

        var container = containerBuilder.build();
        var registration = container
            .resolveWith(TestData.Test1Base)
            .args([]);

        test.strictEqual(registration['args'], undefined);
        test.notEqual(registration['attempt'], undefined);
        test.notEqual(registration['attempt'], null);
        test.notEqual(registration['name'], undefined);
        test.notEqual(registration['name'], null);
        test.notEqual(registration['dependencies'], undefined);
        test.notEqual(registration['dependencies'], null);
        test.notEqual(registration['cache'], undefined);
        test.notEqual(registration['cache'], null);
        test.notEqual(registration['exec'], undefined);
        test.notEqual(registration['exec'], null);

        test.done();
    }

    export function fluentApiResolveWithArgsAttempt(test) {

        var container = containerBuilder.build();
        var registration = container
            .resolveWith(TestData.Test1Base)
            .args([])
            .attempt();

        test.strictEqual(registration['args'], undefined);
        test.strictEqual(registration['attempt'], undefined);
        test.notEqual(registration['name'], undefined);
        test.notEqual(registration['name'], null);
        test.notEqual(registration['dependencies'], undefined);
        test.notEqual(registration['dependencies'], null);
        test.notEqual(registration['cache'], undefined);
        test.notEqual(registration['cache'], null);
        test.notEqual(registration['exec'], undefined);
        test.notEqual(registration['exec'], null);

        test.done();
    }

    export function fluentApiResolveWithArgsAttemptName(test) {

        var container = containerBuilder.build();
        var registration = container
            .resolveWith(TestData.Test1Base)
            .args([])
            .attempt()
            .name('');

        test.strictEqual(registration['args'], undefined);
        test.strictEqual(registration['attempt'], undefined);
        test.strictEqual(registration['name'], undefined);
        test.notEqual(registration['dependencies'], undefined);
        test.notEqual(registration['dependencies'], null);
        test.notEqual(registration['cache'], undefined);
        test.notEqual(registration['cache'], null);
        test.notEqual(registration['exec'], undefined);
        test.notEqual(registration['exec'], null);

        test.done();
    }

    export function fluentApiResolveWithArgsAttemptNameDependencies(test) {

        var container = containerBuilder.build();
        var registration = container
            .resolveWith(TestData.Test1Base)
            .args([])
            .attempt()
            .name('')
            .dependencies([]);

        test.strictEqual(registration['args'], undefined);
        test.strictEqual(registration['attempt'], undefined);
        test.strictEqual(registration['name'], undefined);
        test.strictEqual(registration['dependencies'], undefined);
        test.notEqual(registration['cache'], undefined);
        test.notEqual(registration['cache'], null);
        test.notEqual(registration['exec'], undefined);
        test.notEqual(registration['exec'], null);

        test.done();
    }

    export function fluentApiResolveWithArgsAttemptNameDependenciesCache(test) {

        var container = containerBuilder.build();
        var registration = container
            .resolveWith(TestData.Test1Base)
            .args([])
            .attempt()
            .name('')
            .dependencies([])
            .cache();

        test.strictEqual(registration['args'], undefined);
        test.strictEqual(registration['attempt'], undefined);
        test.strictEqual(registration['name'], undefined);
        test.strictEqual(registration['dependencies'], undefined);
        test.strictEqual(registration['cache'], undefined);
        test.notEqual(registration['exec'], undefined);
        test.notEqual(registration['exec'], null);

        test.done();
    }
}

