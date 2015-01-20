'use strict';
var scaffold = require('./../scaffold');
var TestData = require('../data/test-data');
var Level9;
(function (Level9) {
    var containerBuilder;
    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level9.setUp = setUp;
    function resolveWithResolvesService(test) {
        containerBuilder.register(TestData.Test2Base).as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var actual = container.resolveWith(TestData.Test2Base).exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.done();
    }
    Level9.resolveWithResolvesService = resolveWithResolvesService;
    function resolveWithThrowsErrorWhenNotFound(test) {
        containerBuilder.register(TestData.Test2Base).as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var delegate = function () {
            container.resolveWith(TestData.Test1Base).exec();
        };
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test1Base);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level9.resolveWithThrowsErrorWhenNotFound = resolveWithThrowsErrorWhenNotFound;
    function resolveWithResolvesServiceWithArgs(test) {
        var arg1 = 'arg 1';
        var arg2 = 'arg 2';
        var expected = arg1 + ' ' + arg2;
        containerBuilder.register(TestData.Test1Base).as(function (c, name1, name2) {
            return new TestData.Test4(expected);
        });
        var container = containerBuilder.build();
        var actual = container.resolveWith(TestData.Test1Base).args(arg1, arg2).exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, expected);
        test.done();
    }
    Level9.resolveWithResolvesServiceWithArgs = resolveWithResolvesServiceWithArgs;
    function resolveWithAttemptsResolvesService(test) {
        containerBuilder.register(TestData.Test2Base).as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var actual = container.resolveWith(TestData.Test2Base).attempt().exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.done();
    }
    Level9.resolveWithAttemptsResolvesService = resolveWithAttemptsResolvesService;
    function resolveWithAttemptsFalseService(test) {
        containerBuilder.register(TestData.Test2Base).as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var actual = container.resolveWith(TestData.Test1Base).attempt().exec();
        test.ok(actual === null);
        test.done();
    }
    Level9.resolveWithAttemptsFalseService = resolveWithAttemptsFalseService;
    function resolveWithResolvesNamedService(test) {
        var testName = 'testName';
        containerBuilder.register(TestData.Test2Base).as(function () {
            return new TestData.Test2();
        }).named(testName);
        var container = containerBuilder.build();
        var actual = container.resolveWith(TestData.Test2Base).name(testName).exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.done();
    }
    Level9.resolveWithResolvesNamedService = resolveWithResolvesNamedService;
    function resolveWithThrowsWhenNoName(test) {
        var testName = 'testName';
        containerBuilder.register(TestData.Test2Base).as(function () {
            return new TestData.Test2();
        }).named(testName);
        var container = containerBuilder.build();
        var delegate = function () {
            container.resolveWith(TestData.Test2Base).exec();
        };
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test2Base);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level9.resolveWithThrowsWhenNoName = resolveWithThrowsWhenNoName;
    function resolvesWithResolvesDependency(test) {
        containerBuilder.register(TestData.Test2Base).as(function (c) {
            return new TestData.Test2();
        });
        containerBuilder.register(TestData.Test1Base).as(function (c) {
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
        var actual = container.resolveWith(TestData.Test1Base).dependencies(dependencies).exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test1Base);
        test.strictEqual(actual.Name, 'Test 3 name from dependency');
        test.done();
    }
    Level9.resolvesWithResolvesDependency = resolvesWithResolvesDependency;
    function resolveWithResolvesCacheDefault(test) {
        containerBuilder.register(TestData.Test2Base).as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        container.resolveWith(TestData.Test2Base).cache().exec();
        var cache = container.cache;
        var actual = cache.Test2Base;
        var actual2 = cache.Test2Base;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.strictEqual(actual, actual2);
        test.done();
    }
    Level9.resolveWithResolvesCacheDefault = resolveWithResolvesCacheDefault;
    function resolveWithResolvesCacheWithName(test) {
        containerBuilder.register(TestData.Test2Base).as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        container.resolveWith(TestData.Test2Base).cache('TestName111').exec();
        var cache = container.cache;
        var actual = cache.TestName111;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.done();
    }
    Level9.resolveWithResolvesCacheWithName = resolveWithResolvesCacheWithName;
    function resolveWithResolvesCacheWithServiceNamedResolution(test) {
        var named = function AAAAA() {
        };
        containerBuilder.register(TestData.Test2Base).as(function () {
            return new TestData.Test2();
        }).named(named.name);
        var container = containerBuilder.build();
        container.resolveWith(TestData.Test2Base).name(named.name).cache().exec();
        var cache = container.cache;
        var actual = cache.AAAAA;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.done();
    }
    Level9.resolveWithResolvesCacheWithServiceNamedResolution = resolveWithResolvesCacheWithServiceNamedResolution;
    function resolveWithResolvesCacheWithServiceValueName(test) {
        var name = "AAAAAA";
        containerBuilder.register(name).as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        container.resolveWith(name).cache().exec();
        var cache = container.cache;
        var actual = cache[name];
        var actual2 = cache.AAAAAA;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.strictEqual(actual, actual2);
        test.done();
    }
    Level9.resolveWithResolvesCacheWithServiceValueName = resolveWithResolvesCacheWithServiceValueName;
    function resolveWithCacheThrowsWhenNoName(test) {
        var service = {};
        containerBuilder.register(service).as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var delegate = function () {
            container.resolveWith(service).cache().exec();
        };
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Missing cache name');
            test.strictEqual(error.data, undefined);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level9.resolveWithCacheThrowsWhenNoName = resolveWithCacheThrowsWhenNoName;
    function resolveWithCacheFromChildContainer(test) {
        containerBuilder.register(TestData.Test2Base).as(function () {
            return new TestData.Test2();
        });
        var container = containerBuilder.build();
        var child = container.createChild();
        var actual = child.resolveWith(TestData.Test2Base).cache().exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test2);
        test.strictEqual(actual.Name, 'test 2');
        test.done();
    }
    Level9.resolveWithCacheFromChildContainer = resolveWithCacheFromChildContainer;
    function resolveWithArgsAttempt(test) {
        var name = 'AAAAA';
        containerBuilder.register(TestData.Test1Base).as(function (c, name) {
            return new TestData.Test4(name);
        });
        var container = containerBuilder.build();
        var actual = container.resolveWith(TestData.Test1Base).args(name).attempt().exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, name);
        test.done();
    }
    Level9.resolveWithArgsAttempt = resolveWithArgsAttempt;
    function resolveWithArgsAttemptThrows(test) {
        var name = 'AAAAA';
        containerBuilder.register(TestData.Test1Base).as(function (c, name) {
            return new TestData.Test4(name);
        });
        var container = containerBuilder.build();
        var actual = container.resolveWith(TestData.Test2Base).args(name).attempt().exec();
        test.strictEqual(actual, null);
        test.done();
    }
    Level9.resolveWithArgsAttemptThrows = resolveWithArgsAttemptThrows;
    function resolveWithArgsNamed(test) {
        var argName = 'AAAAA';
        var resolutionName = 'Test name';
        containerBuilder.register(TestData.Test1Base).as(function (c, name) {
            return new TestData.Test4(name);
        }).named(resolutionName);
        var container = containerBuilder.build();
        var actual = container.resolveWith(TestData.Test1Base).args(argName).name(resolutionName).exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);
        test.done();
    }
    Level9.resolveWithArgsNamed = resolveWithArgsNamed;
    function resolveWithArgsDependencies(test) {
        var param = 'Some name';
        containerBuilder.register(TestData.Test2Base).as(function (c) {
            return new TestData.Test2();
        });
        containerBuilder.register(TestData.Test1Base).as(function (c, arg) {
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
        var actual = container.resolveWith(TestData.Test1Base).args(param).dependencies(dependencies).exec();
        test.ok(actual);
        test.strictEqual(actual.Name, 'Test 3 name from dependency Some name');
        test.done();
    }
    Level9.resolveWithArgsDependencies = resolveWithArgsDependencies;
    function resolveWithArgsParamsDependencies(test) {
        containerBuilder.register(TestData.Test2Base).as(function (_, a, b, d) {
            return {
                get Name() {
                    return [a, b, d].join(' ');
                }
            };
        });
        containerBuilder.register(TestData.Test1Base).as(function (c, a, b, d) {
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
        var actual = container.resolveWith(TestData.Test1Base).args('4', '5', '6').dependencies(dependencies).exec();
        test.strictEqual(actual.Name, 'Test 3 4 - 5 - 6');
        test.done();
    }
    Level9.resolveWithArgsParamsDependencies = resolveWithArgsParamsDependencies;
    function resolveWithArgsParamsDependenciesThrowsWhenWrongArgsCount(test) {
        containerBuilder.register(TestData.Test2Base).as(function (_, a, b, d) {
            return {
                get Name() {
                    return [a, b, d].join(' ');
                }
            };
        });
        containerBuilder.register(TestData.Test1Base).as(function (c, a, b, d) {
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
            container.resolveWith(TestData.Test1Base).args('4', '5', '6').dependencies(dependencies).exec();
        };
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test2Base);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level9.resolveWithArgsParamsDependenciesThrowsWhenWrongArgsCount = resolveWithArgsParamsDependenciesThrowsWhenWrongArgsCount;
    function resolveWithArgsCacheNoName(test) {
        var argName = 'AAAAA';
        containerBuilder.register(TestData.Test1Base).as(function (c, name) {
            return new TestData.Test4(name);
        });
        var container = containerBuilder.build();
        container.resolveWith(TestData.Test1Base).args(argName).cache().exec();
        var actual = container.cache.Test1Base;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);
        test.done();
    }
    Level9.resolveWithArgsCacheNoName = resolveWithArgsCacheNoName;
    function resolveWithAttemptWithName(test) {
        var argName = 'AAAAA';
        var resolutionName = 'Test';
        containerBuilder.register(TestData.Test1Base).as(function () {
            return new TestData.Test4(argName);
        }).named(resolutionName);
        var container = containerBuilder.build();
        var actual = container.resolveWith(TestData.Test1Base).attempt().name(resolutionName).exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);
        test.done();
    }
    Level9.resolveWithAttemptWithName = resolveWithAttemptWithName;
    function resolveWithAttemptDependencies(test) {
        containerBuilder.register(TestData.Test2Base).as(function (_) {
            return {
                get Name() {
                    return 'Test2Base';
                }
            };
        });
        containerBuilder.register(TestData.Test1Base).as(function (c) {
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
        var actual = container.resolveWith(TestData.Test1Base).attempt().dependencies(dependencies).exec();
        test.strictEqual(actual.Name, 'Test 3 Test2 substitute');
        test.done();
    }
    Level9.resolveWithAttemptDependencies = resolveWithAttemptDependencies;
    function resolveWithAttemptDependenciesMissingResolution(test) {
        containerBuilder.register(TestData.Test2Base).as(function () {
            return {
                get Name() {
                    return 'Test2Base';
                }
            };
        });
        containerBuilder.register(TestData.Test1Base).as(function (c) {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var dependencies = [{
            service: {},
            factory: function () {
                return {
                    get Name() {
                        return 'Test2 substitute';
                    }
                };
            }
        }];
        var actual = container.resolveWith(TestData.Test1Base).attempt().dependencies(dependencies).exec();
        test.strictEqual(actual, null);
        test.done();
    }
    Level9.resolveWithAttemptDependenciesMissingResolution = resolveWithAttemptDependenciesMissingResolution;
    function resolveWithAttemptDependenciesMissingNonRequiredResolution(test) {
        containerBuilder.register(TestData.Test1Base).as(function (c) {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var dependencies = [{
            service: TestData.Test2Base,
            required: false,
            factory: function () {
                return {
                    get Name() {
                        return 'name from dependency';
                    }
                };
            }
        }];
        var actual = container.resolveWith(TestData.Test1Base).attempt().dependencies(dependencies).exec();
        test.ok(actual);
        test.strictEqual(actual.Name, 'Test 3 name from dependency');
        test.done();
    }
    Level9.resolveWithAttemptDependenciesMissingNonRequiredResolution = resolveWithAttemptDependenciesMissingNonRequiredResolution;
    function resolveWithAttemptPartialMissingNonRequiredDependencies(test) {
        containerBuilder.register(TestData.Test1Base).as(function (c) {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        containerBuilder.register(TestData.Test1Base).as(function () { return new TestData.Test4("test 4"); }).named("Test 4");
        var dynamicService = function () {
        };
        containerBuilder.register(dynamicService).as(function (c) {
            var test1 = c.resolve(TestData.Test1Base);
            var test2 = c.resolve(TestData.Test2Base);
            var test4 = c.resolveNamed(TestData.Test1Base, "Test 4");
            return new TestData.Test7(test1, test2, test4);
        });
        var container = containerBuilder.build();
        var dependencies = [{
            service: TestData.Test1Base,
            factory: function () {
                return {
                    get Name() {
                        return 'test 1 base';
                    }
                };
            }
        }, {
            service: TestData.Test2Base,
            required: false,
            factory: function () {
                return {
                    get Name() {
                        return 'test 2 base';
                    }
                };
            }
        }, {
            service: TestData.Test1Base,
            named: "Test 4",
            factory: function () {
                return {
                    get Name() {
                        return 'test 4 base';
                    }
                };
            }
        }];
        var actual = container.resolveWith(dynamicService).attempt().dependencies(dependencies).exec();
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');
        test.expect(3);
        test.done();
    }
    Level9.resolveWithAttemptPartialMissingNonRequiredDependencies = resolveWithAttemptPartialMissingNonRequiredDependencies;
    function resolveWithAttemptCache(test) {
        var argName = 'AAAAA';
        containerBuilder.register(TestData.Test1Base).as(function (c) {
            return new TestData.Test4(argName);
        });
        var container = containerBuilder.build();
        container.resolveWith(TestData.Test1Base).attempt().cache().exec();
        var actual = container.cache.Test1Base;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);
        test.done();
    }
    Level9.resolveWithAttemptCache = resolveWithAttemptCache;
    function resolveWithNameDependencies(test) {
        var resolutionName = 'AAAAA';
        containerBuilder.register(TestData.Test2Base).as(function (_) {
            return {
                get Name() {
                    return 'Test2Base';
                }
            };
        });
        containerBuilder.register(TestData.Test1Base).as(function (c) {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        }).named(resolutionName);
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
        var actual = container.resolveWith(TestData.Test1Base).name(resolutionName).dependencies(dependencies).exec();
        test.strictEqual(actual.Name, 'Test 3 Test2 substitute');
        test.done();
    }
    Level9.resolveWithNameDependencies = resolveWithNameDependencies;
    function resolutionWithNameCache(test) {
        var argName = 'ArgName';
        var resolutionName = 'AAAAA';
        containerBuilder.register(TestData.Test1Base).as(function () {
            return new TestData.Test4(argName);
        }).named(resolutionName);
        var container = containerBuilder.build();
        container.resolveWith(TestData.Test1Base).name(resolutionName).cache().exec();
        var actual = container.cache.AAAAA;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test4);
        test.strictEqual(actual.Name, argName);
        test.done();
    }
    Level9.resolutionWithNameCache = resolutionWithNameCache;
    function resolveWithDependenciesCache(test) {
        containerBuilder.register(TestData.Test2Base).as(function (_) {
            return {
                get Name() {
                    return 'Test2Base';
                }
            };
        });
        containerBuilder.register(TestData.Test1Base).as(function (c) {
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
        container.resolveWith(TestData.Test1Base).dependencies(dependencies).cache().exec();
        var actual = container.cache.Test1Base;
        test.ok(actual);
        test.ok(actual instanceof TestData.Test3);
        test.strictEqual(actual.Name, 'Test 3 Test2 substitute');
        test.done();
    }
    Level9.resolveWithDependenciesCache = resolveWithDependenciesCache;
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
    Level9.fluentApiResolveWith = fluentApiResolveWith;
    function fluentApiResolveWithArgs(test) {
        var container = containerBuilder.build();
        var registration = container.resolveWith(TestData.Test1Base).args([]);
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
    Level9.fluentApiResolveWithArgs = fluentApiResolveWithArgs;
    function fluentApiResolveWithArgsAttempt(test) {
        var container = containerBuilder.build();
        var registration = container.resolveWith(TestData.Test1Base).args([]).attempt();
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
    Level9.fluentApiResolveWithArgsAttempt = fluentApiResolveWithArgsAttempt;
    function fluentApiResolveWithArgsAttemptName(test) {
        var container = containerBuilder.build();
        var registration = container.resolveWith(TestData.Test1Base).args([]).attempt().name('');
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
    Level9.fluentApiResolveWithArgsAttemptName = fluentApiResolveWithArgsAttemptName;
    function fluentApiResolveWithArgsAttemptNameDependencies(test) {
        var container = containerBuilder.build();
        var registration = container.resolveWith(TestData.Test1Base).args([]).attempt().name('').dependencies([]);
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
    Level9.fluentApiResolveWithArgsAttemptNameDependencies = fluentApiResolveWithArgsAttemptNameDependencies;
    function fluentApiResolveWithArgsAttemptNameDependenciesCache(test) {
        var container = containerBuilder.build();
        var registration = container.resolveWith(TestData.Test1Base).args([]).attempt().name('').dependencies([]).cache();
        test.strictEqual(registration['args'], undefined);
        test.strictEqual(registration['attempt'], undefined);
        test.strictEqual(registration['name'], undefined);
        test.strictEqual(registration['dependencies'], undefined);
        test.strictEqual(registration['cache'], undefined);
        test.notEqual(registration['exec'], undefined);
        test.notEqual(registration['exec'], null);
        test.done();
    }
    Level9.fluentApiResolveWithArgsAttemptNameDependenciesCache = fluentApiResolveWithArgsAttemptNameDependenciesCache;
})(Level9 = exports.Level9 || (exports.Level9 = {}));
//# sourceMappingURL=level10.js.map