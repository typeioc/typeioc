'use strict';
const scaffold = require('./../scaffold');
const TestData = require('../data/test-data');
var mockery = scaffold.Mockery;
var Level9;
(function (Level9) {
    var containerBuilder;
    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level9.setUp = setUp;
    function resolvesWithDependency(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var dependencies = [{
                service: TestData.Test2Base,
                factory: () => {
                    return {
                        get Name() {
                            return 'name from dependency';
                        }
                    };
                }
            }];
        var actualDynamic = container.resolveWithDependencies(TestData.Test1Base, dependencies);
        test.strictEqual(actualDynamic.Name, 'Test 3 name from dependency');
        test.done();
    }
    Level9.resolvesWithDependency = resolvesWithDependency;
    function resolveWithDependencyUsesDynamicContainer(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var dependencies = [{
                service: TestData.Test2Base,
                factory: c => {
                    test.notStrictEqual(container, c);
                    return {
                        get Name() {
                            return 'name from dependency';
                        }
                    };
                }
            }];
        container.resolveWithDependencies(TestData.Test1Base, dependencies);
        test.expect(1);
        test.done();
    }
    Level9.resolveWithDependencyUsesDynamicContainer = resolveWithDependencyUsesDynamicContainer;
    function resolvesWithNoDependencyIsTheSame(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var actualNative = container.resolve(TestData.Test1Base);
        var dependencies = [{
                service: TestData.Test2Base,
                factory: () => {
                    return {
                        get Name() {
                            return 'name from dependency';
                        }
                    };
                }
            }];
        var actualDynamic = container.resolveWithDependencies(TestData.Test1Base, dependencies);
        test.notStrictEqual(actualDynamic, actualNative);
        test.ok(actualNative instanceof TestData.Test3);
        test.strictEqual(actualNative.Name, 'Test 3 test 2');
        test.done();
    }
    Level9.resolvesWithNoDependencyIsTheSame = resolvesWithNoDependencyIsTheSame;
    function resolutionErrorWhenUndefinedDependencies(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, undefined);
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'No dependencies provided');
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(2);
        test.done();
    }
    Level9.resolutionErrorWhenUndefinedDependencies = resolutionErrorWhenUndefinedDependencies;
    function resolutionErrorWhenNullDependencies(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, null);
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'No dependencies provided');
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(2);
        test.done();
    }
    Level9.resolutionErrorWhenNullDependencies = resolutionErrorWhenNullDependencies;
    function resolutionErrorWhenEmptyDependencies(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, []);
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'No dependencies provided');
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(2);
        test.done();
    }
    Level9.resolutionErrorWhenEmptyDependencies = resolutionErrorWhenEmptyDependencies;
    function resolutionErrorWhenNoRegistrationWithDependencies(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        var container = containerBuilder.build();
        var dependencies = [{
                service: TestData.Test2Base,
                factory: () => {
                    return {
                        get Name() {
                            return 'name from dependency';
                        }
                    };
                }
            }];
        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, dependencies);
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test1Base);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level9.resolutionErrorWhenNoRegistrationWithDependencies = resolutionErrorWhenNoRegistrationWithDependencies;
    function resolutionErrorWhenNoDependenciesRegistration(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var dependencies = [{
                service: TestData.Test2Base,
                factory: () => {
                    return {
                        get Name() {
                            return 'name from dependency';
                        }
                    };
                }
            }];
        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, dependencies);
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test2Base);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level9.resolutionErrorWhenNoDependenciesRegistration = resolutionErrorWhenNoDependenciesRegistration;
    function resolveWithMissingDependency(test) {
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
        var actual = container.resolveWithDependencies(TestData.Test1Base, dependencies);
        test.ok(actual);
        test.strictEqual(actual.Name, 'Test 3 name from dependency');
        test.done();
    }
    Level9.resolveWithMissingDependency = resolveWithMissingDependency;
    function resolveWithPartialMissingDependencies(test) {
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
                factory: c => {
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
        var actual = container.resolveWithDependencies(dynamicService, dependencies);
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');
        test.expect(3);
        test.done();
    }
    Level9.resolveWithPartialMissingDependencies = resolveWithPartialMissingDependencies;
    function resolveWithMultipleDependencies(test) {
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
                factory: c => {
                    return {
                        get Name() {
                            return 'test 4 base';
                        }
                    };
                }
            }];
        var actual = container.resolveWithDependencies(dynamicService, dependencies);
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');
        test.done();
    }
    Level9.resolveWithMultipleDependencies = resolveWithMultipleDependencies;
    function resolveWithDependencyThrowsWhenNamedRegistration(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        }).named('Test');
        var container = containerBuilder.build();
        var dependencies = [{
                service: TestData.Test2Base,
                factory: () => {
                    return {
                        get Name() {
                            return 'name from dependency';
                        }
                    };
                }
            }];
        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, dependencies);
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test1Base);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level9.resolveWithDependencyThrowsWhenNamedRegistration = resolveWithDependencyThrowsWhenNamedRegistration;
    function resolveWithDependencyThrowsWhenRegistrationWithParams(test) {
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as((c, _, __, ___) => {
            var test2 = c.resolve(TestData.Test2Base);
            return new TestData.Test3(test2);
        });
        var container = containerBuilder.build();
        var dependencies = [{
                service: TestData.Test2Base,
                factory: () => {
                    return {
                        get Name() {
                            return 'name from dependency';
                        }
                    };
                }
            }];
        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, dependencies);
        test.throws(delegate, function (error) {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test1Base);
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });
        test.expect(3);
        test.done();
    }
    Level9.resolveWithDependencyThrowsWhenRegistrationWithParams = resolveWithDependencyThrowsWhenRegistrationWithParams;
    function resolveWithDependencyInitializerIsInvoked(test) {
        var resolutionInitializer = mockery.stub();
        var dependencyInitializer = mockery.stub();
        var resolveItem = new TestData.Test3(null);
        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
            c.resolve(TestData.Test2Base);
            return resolveItem;
        })
            .initializeBy(resolutionInitializer);
        var container = containerBuilder.build();
        var item = {
            get Name() {
                return 'name from dependency';
            }
        };
        var dependencies = [{
                service: TestData.Test2Base,
                factory: () => item,
                initializer: dependencyInitializer
            }];
        container.resolveWithDependencies(TestData.Test1Base, dependencies);
        test.ok(resolutionInitializer.calledOnce);
        test.ok(resolutionInitializer.calledWithExactly(mockery.match.any, resolveItem));
        test.ok(dependencyInitializer.calledOnce);
        test.ok(dependencyInitializer.calledWithExactly(mockery.match.any, item));
        test.done();
    }
    Level9.resolveWithDependencyInitializerIsInvoked = resolveWithDependencyInitializerIsInvoked;
    function resolveWithPartialUniqueDependencies(test) {
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
            test.ok(test2 instanceof TestData.Test2);
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
        var actual = container.resolveWithDependencies(dynamicService, dependencies);
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 test 4 base');
        test.expect(4);
        test.done();
    }
    Level9.resolveWithPartialUniqueDependencies = resolveWithPartialUniqueDependencies;
    function resolveWithPartialNonNamedDependencies(test) {
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
            test.ok(test1 instanceof TestData.Test3);
            var test2 = c.resolve(TestData.Test2Base);
            var test4 = c.resolveNamed(TestData.Test1Base, "Test 4");
            return new TestData.Test7(test1, test2, test4);
        });
        var container = containerBuilder.build();
        var dependencies = [{
                service: TestData.Test2Base,
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
        var actual = container.resolveWithDependencies(dynamicService, dependencies);
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'Test 3 test 2 test 2 base test 4 base');
        test.expect(4);
        test.done();
    }
    Level9.resolveWithPartialNonNamedDependencies = resolveWithPartialNonNamedDependencies;
    function resolveWithPartialNamedDependencies(test) {
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
            test.ok(test4 instanceof TestData.Test4);
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
                factory: () => {
                    return {
                        get Name() {
                            return 'test 2 base';
                        }
                    };
                }
            }];
        var actual = container.resolveWithDependencies(dynamicService, dependencies);
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 base test 4');
        test.expect(4);
        test.done();
    }
    Level9.resolveWithPartialNamedDependencies = resolveWithPartialNamedDependencies;
})(Level9 = exports.Level9 || (exports.Level9 = {}));
//# sourceMappingURL=level09.js.map