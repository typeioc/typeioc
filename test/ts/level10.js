'use strict';
const scaffold = require('./../scaffold');
const TestData = require('../data/test-data');
var Level10;
(function (Level10) {
    var containerBuilder;
    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level10.setUp = setUp;
    function resolveWithResolvesService(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var actual = container.resolveWith(TestData.Test2Base)
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.done();
    }
    Level10.resolveWithResolvesService = resolveWithResolvesService;
    function resolveWithThrowsErrorWhenNotFound(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var delegate = function () {
            container.resolveWith(TestData.Test1Base)
                .exec();
        };
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test1Base);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level10.resolveWithThrowsErrorWhenNotFound = resolveWithThrowsErrorWhenNotFound;
    function resolveWithResolvesServiceWithArgs(test) {
        var arg1 = 'arg 1';
        var arg2 = 'arg 2';
        var expected = arg1 + ' ' + arg2;
        containerBuilder.register(TestData.Test1Base)
            .as(function (c, name1, name2) {
            return new TestData.Test4(expected);
        });
        var container = containerBuilder.build();
        var actual = container
            .resolveWith(TestData.Test1Base)
            .args(arg1, arg2)
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, expected);
        test.done();
    }
    Level10.resolveWithResolvesServiceWithArgs = resolveWithResolvesServiceWithArgs;
    function resolveWithAttemptsResolvesService(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var actual = container
            .resolveWith(TestData.Test2Base)
            .attempt()
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.done();
    }
    Level10.resolveWithAttemptsResolvesService = resolveWithAttemptsResolvesService;
    function resolveWithAttemptsFalseService(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var actual = container
            .resolveWith(TestData.Test1Base)
            .attempt()
            .exec();
        test.ok(actual === null);
        test.done();
    }
    Level10.resolveWithAttemptsFalseService = resolveWithAttemptsFalseService;
    function resolveWithResolvesNamedService(test) {
        var testName = 'testName';
        containerBuilder.register(TestData.Test2Base)
            .as(function () {
            return new TestData.Test2();
        })
            .named(testName);
        var container = containerBuilder.build();
        var actual = container
            .resolveWith(TestData.Test2Base)
            .name(testName)
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.done();
    }
    Level10.resolveWithResolvesNamedService = resolveWithResolvesNamedService;
    function resolveWithThrowsWhenNoName(test) {
        var testName = 'testName';
        containerBuilder.register(TestData.Test2Base)
            .as(function () {
            return new TestData.Test2();
        })
            .named(testName);
        var container = containerBuilder.build();
        var delegate = function () {
            container
                .resolveWith(TestData.Test2Base)
                .exec();
        };
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test2Base);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level10.resolveWithThrowsWhenNoName = resolveWithThrowsWhenNoName;
    function resolvesWithResolvesDependency(test) {
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
            .resolveWith(TestData.Test1Base)
            .dependencies(dependencies)
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test1Base);
        test.strictEqual(actual.Name, 'Test 3 name from dependency');
        test.done();
    }
    Level10.resolvesWithResolvesDependency = resolvesWithResolvesDependency;
    function resolveWithMultipleDependenciesSeparatlyArrays(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .named("Test 4");
        var dynamicService = function () { };
        containerBuilder.register(dynamicService)
            .as(c => {
            var test1 = c.resolve(TestData.Test1Base);
            var test2 = c.resolve(TestData.Test2Base);
            var test4 = c.resolveNamed(TestData.Test1Base, "Test 4");
            return new TestData.Test7(test1, test2, test4);
        });
        var container = containerBuilder.build();
        var actual = container.resolveWith(dynamicService)
            .dependencies([{
                service: TestData.Test1Base,
                factory: () => {
                    return {
                        get Name() {
                            return 'test 1 base';
                        }
                    };
                }
            }])
            .dependencies([{
                service: TestData.Test2Base,
                factory: () => {
                    return {
                        get Name() {
                            return 'test 2 base';
                        }
                    };
                }
            }])
            .dependencies([{
                service: TestData.Test1Base,
                named: "Test 4",
                factory: function (c) {
                    return {
                        get Name() {
                            return 'test 4 base';
                        }
                    };
                }
            }])
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');
        test.done();
    }
    Level10.resolveWithMultipleDependenciesSeparatlyArrays = resolveWithMultipleDependenciesSeparatlyArrays;
    function resolveWithMultipleDependenciesSeparatly(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(c => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        containerBuilder.register(TestData.Test1Base)
            .as(c => new TestData.Test4("test 4"))
            .named("Test 4");
        var dynamicService = function () { };
        containerBuilder.register(dynamicService)
            .as(c => {
            var test1 = c.resolve(TestData.Test1Base);
            var test2 = c.resolve(TestData.Test2Base);
            var test4 = c.resolveNamed(TestData.Test1Base, "Test 4");
            return new TestData.Test7(test1, test2, test4);
        });
        var container = containerBuilder.build();
        var actual = container.resolveWith(dynamicService)
            .dependencies({
            service: TestData.Test1Base,
            factory: () => {
                return {
                    get Name() {
                        return 'test 1 base';
                    }
                };
            }
        })
            .dependencies({
            service: TestData.Test2Base,
            factory: c => {
                return {
                    get Name() {
                        return 'test 2 base';
                    }
                };
            }
        })
            .dependencies([{
                service: TestData.Test1Base,
                named: "Test 4",
                factory: function (c) {
                    return {
                        get Name() {
                            return 'test 4 base';
                        }
                    };
                }
            }])
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');
        test.done();
    }
    Level10.resolveWithMultipleDependenciesSeparatly = resolveWithMultipleDependenciesSeparatly;
    function resolveWithResolvesCacheDefault(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        container
            .resolveWith(TestData.Test2Base)
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
    Level10.resolveWithResolvesCacheDefault = resolveWithResolvesCacheDefault;
    function resolveWithResolvesCacheWithName(test) {
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
    Level10.resolveWithResolvesCacheWithName = resolveWithResolvesCacheWithName;
    function resolveWithResolvesCacheWithServiceNamedResolution(test) {
        var named = function AAAAA() { };
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
    Level10.resolveWithResolvesCacheWithServiceNamedResolution = resolveWithResolvesCacheWithServiceNamedResolution;
    function resolveWithResolvesCacheWithServiceValueName(test) {
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
    Level10.resolveWithResolvesCacheWithServiceValueName = resolveWithResolvesCacheWithServiceValueName;
    function resolveWithCacheThrowsWhenNoName(test) {
        var service = {};
        containerBuilder.register(service)
            .as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var delegate = function () {
            container.resolveWith(service)
                .cache()
                .exec();
        };
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Missing cache name');
            test.strictEqual(error.data, undefined);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level10.resolveWithCacheThrowsWhenNoName = resolveWithCacheThrowsWhenNoName;
    function resolveWithCacheFromChildContainer(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var child = container.createChild();
        var actual = child
            .resolveWith(TestData.Test2Base)
            .cache()
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.done();
    }
    Level10.resolveWithCacheFromChildContainer = resolveWithCacheFromChildContainer;
    function resolveWithArgsAttempt(test) {
        var name = 'AAAAA';
        containerBuilder.register(TestData.Test1Base)
            .as(function (c, name) {
            return new TestData.Test4(name);
        });
        var container = containerBuilder.build();
        var actual = container
            .resolveWith(TestData.Test1Base)
            .args(name)
            .attempt()
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, name);
        test.done();
    }
    Level10.resolveWithArgsAttempt = resolveWithArgsAttempt;
    function resolveWithArgsAttemptThrows(test) {
        var name = 'AAAAA';
        containerBuilder.register(TestData.Test1Base)
            .as(function (c, name) {
            return new TestData.Test4(name);
        });
        var container = containerBuilder.build();
        var actual = container
            .resolveWith(TestData.Test2Base)
            .args(name)
            .attempt()
            .exec();
        test.strictEqual(actual, null);
        test.done();
    }
    Level10.resolveWithArgsAttemptThrows = resolveWithArgsAttemptThrows;
    function resolveWithArgsNamed(test) {
        var argName = 'AAAAA';
        var resolutionName = 'Test name';
        containerBuilder.register(TestData.Test1Base)
            .as(function (c, name) {
            return new TestData.Test4(name);
        })
            .named(resolutionName);
        var container = containerBuilder.build();
        var actual = container
            .resolveWith(TestData.Test1Base)
            .args(argName)
            .name(resolutionName)
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);
        test.done();
    }
    Level10.resolveWithArgsNamed = resolveWithArgsNamed;
    function resolveWithArgsDependencies(test) {
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
            .resolveWith(TestData.Test1Base)
            .args(param)
            .dependencies(dependencies)
            .exec();
        test.ok(actual);
        test.strictEqual(actual.Name, 'Test 3 name from dependency Some name');
        test.done();
    }
    Level10.resolveWithArgsDependencies = resolveWithArgsDependencies;
    function resolveWithArgsParamsDependencies(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(function (_, a, b, d) {
            return {
                get Name() {
                    return [a, b, d].join(' ');
                }
            };
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
            .resolveWith(TestData.Test1Base)
            .args('4', '5', '6')
            .dependencies(dependencies)
            .exec();
        test.strictEqual(actual.Name, 'Test 3 4 - 5 - 6');
        test.done();
    }
    Level10.resolveWithArgsParamsDependencies = resolveWithArgsParamsDependencies;
    function resolveWithArgsParamsDependenciesThrowsWhenWrongArgsCount(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(function (_, a, b, d) {
            return {
                get Name() {
                    return [a, b, d].join(' ');
                }
            };
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
        var delegate = function () {
            container.resolveWith(TestData.Test1Base)
                .args('4', '5', '6')
                .dependencies(dependencies)
                .exec();
        };
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test2Base);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level10.resolveWithArgsParamsDependenciesThrowsWhenWrongArgsCount = resolveWithArgsParamsDependenciesThrowsWhenWrongArgsCount;
    function resolveWithArgsCacheNoName(test) {
        var argName = 'AAAAA';
        containerBuilder.register(TestData.Test1Base)
            .as(function (c, name) {
            return new TestData.Test4(name);
        });
        var container = containerBuilder.build();
        container
            .resolveWith(TestData.Test1Base)
            .args(argName)
            .cache()
            .exec();
        var actual = container.cache.Test1Base;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);
        test.done();
    }
    Level10.resolveWithArgsCacheNoName = resolveWithArgsCacheNoName;
    function resolveWithAttemptWithName(test) {
        var argName = 'AAAAA';
        var resolutionName = 'Test';
        containerBuilder.register(TestData.Test1Base)
            .as(function () {
            return new TestData.Test4(argName);
        })
            .named(resolutionName);
        var container = containerBuilder.build();
        var actual = container
            .resolveWith(TestData.Test1Base)
            .attempt()
            .name(resolutionName)
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);
        test.done();
    }
    Level10.resolveWithAttemptWithName = resolveWithAttemptWithName;
    function resolveWithAttemptDependencies(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(function (_) {
            return {
                get Name() {
                    return 'Test2Base';
                }
            };
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
            .resolveWith(TestData.Test1Base)
            .attempt()
            .dependencies(dependencies)
            .exec();
        test.strictEqual(actual.Name, 'Test 3 Test2 substitute');
        test.done();
    }
    Level10.resolveWithAttemptDependencies = resolveWithAttemptDependencies;
    function resolveWithAttemptDependenciesMissingResolution(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => {
            return {
                get Name() {
                    return 'Test2Base';
                }
            };
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
    Level10.resolveWithAttemptDependenciesMissingResolution = resolveWithAttemptDependenciesMissingResolution;
    function resolveWithAttemptDependenciesMissingNonRequiredResolution(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var dependencies = [{
                service: TestData.Test2Base,
                required: false,
                factory: () => {
                    return {
                        get Name() {
                            return 'name from dependency';
                        }
                    };
                }
            }];
        var actual = container
            .resolveWith(TestData.Test1Base)
            .attempt()
            .dependencies(dependencies)
            .exec();
        test.ok(actual);
        test.strictEqual(actual.Name, 'Test 3 name from dependency');
        test.done();
    }
    Level10.resolveWithAttemptDependenciesMissingNonRequiredResolution = resolveWithAttemptDependenciesMissingNonRequiredResolution;
    function resolveWithAttemptPartialMissingNonRequiredDependencies(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .named("Test 4");
        var dynamicService = function () { };
        containerBuilder.register(dynamicService)
            .as(c => {
            var test1 = c.resolve(TestData.Test1Base);
            var test2 = c.resolve(TestData.Test2Base);
            var test4 = c.resolveNamed(TestData.Test1Base, "Test 4");
            return new TestData.Test7(test1, test2, test4);
        });
        var container = containerBuilder.build();
        var dependencies = [{
                service: TestData.Test1Base,
                factory: () => {
                    return {
                        get Name() {
                            return 'test 1 base';
                        }
                    };
                }
            },
            {
                service: TestData.Test2Base,
                required: false,
                factory: () => {
                    return {
                        get Name() {
                            return 'test 2 base';
                        }
                    };
                }
            },
            {
                service: TestData.Test1Base,
                named: "Test 4",
                factory: () => {
                    return {
                        get Name() {
                            return 'test 4 base';
                        }
                    };
                }
            }];
        var actual = container
            .resolveWith(dynamicService)
            .attempt()
            .dependencies(dependencies)
            .exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');
        test.expect(3);
        test.done();
    }
    Level10.resolveWithAttemptPartialMissingNonRequiredDependencies = resolveWithAttemptPartialMissingNonRequiredDependencies;
    function resolveWithAttemptCache(test) {
        var argName = 'AAAAA';
        containerBuilder.register(TestData.Test1Base)
            .as(function (c) {
            return new TestData.Test4(argName);
        });
        var container = containerBuilder.build();
        container
            .resolveWith(TestData.Test1Base)
            .attempt()
            .cache()
            .exec();
        var actual = container.cache.Test1Base;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);
        test.done();
    }
    Level10.resolveWithAttemptCache = resolveWithAttemptCache;
    function resolveWithNameDependencies(test) {
        var resolutionName = 'AAAAA';
        containerBuilder.register(TestData.Test2Base)
            .as(function (_) {
            return {
                get Name() {
                    return 'Test2Base';
                }
            };
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
            .resolveWith(TestData.Test1Base)
            .name(resolutionName)
            .dependencies(dependencies)
            .exec();
        test.strictEqual(actual.Name, 'Test 3 Test2 substitute');
        test.done();
    }
    Level10.resolveWithNameDependencies = resolveWithNameDependencies;
    function resolutionWithNameCache(test) {
        var argName = 'ArgName';
        var resolutionName = 'AAAAA';
        containerBuilder.register(TestData.Test1Base)
            .as(function () {
            return new TestData.Test4(argName);
        })
            .named(resolutionName);
        var container = containerBuilder.build();
        container
            .resolveWith(TestData.Test1Base)
            .name(resolutionName)
            .cache()
            .exec();
        var actual = container.cache.AAAAA;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);
        test.done();
    }
    Level10.resolutionWithNameCache = resolutionWithNameCache;
    function resolveWithDependenciesCache(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(function (_) {
            return {
                get Name() {
                    return 'Test2Base';
                }
            };
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
        container.resolveWith(TestData.Test1Base)
            .dependencies(dependencies)
            .cache()
            .exec();
        var actual = container.cache.Test1Base;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test3);
        test.strictEqual(actual.Name, 'Test 3 Test2 substitute');
        test.done();
    }
    Level10.resolveWithDependenciesCache = resolveWithDependenciesCache;
    function fluentApiResolveWith(test) {
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
    Level10.fluentApiResolveWith = fluentApiResolveWith;
    function fluentApiResolveWithArgs(test) {
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
    Level10.fluentApiResolveWithArgs = fluentApiResolveWithArgs;
    function fluentApiResolveWithArgsAttempt(test) {
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
    Level10.fluentApiResolveWithArgsAttempt = fluentApiResolveWithArgsAttempt;
    function fluentApiResolveWithArgsAttemptName(test) {
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
    Level10.fluentApiResolveWithArgsAttemptName = fluentApiResolveWithArgsAttemptName;
    function fluentApiResolveWithArgsAttemptNameDependencies(test) {
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
        test.notEqual(registration['dependencies'], undefined);
        test.notEqual(registration['dependencies'], null);
        test.notEqual(registration['cache'], undefined);
        test.notEqual(registration['cache'], null);
        test.notEqual(registration['exec'], undefined);
        test.notEqual(registration['exec'], null);
        test.done();
    }
    Level10.fluentApiResolveWithArgsAttemptNameDependencies = fluentApiResolveWithArgsAttemptNameDependencies;
    function fluentApiResolveWithArgsAttemptNameDependenciesCache(test) {
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
    Level10.fluentApiResolveWithArgsAttemptNameDependenciesCache = fluentApiResolveWithArgsAttemptNameDependenciesCache;
})(Level10 = exports.Level10 || (exports.Level10 = {}));
//# sourceMappingURL=level10.js.map