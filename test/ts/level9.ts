
'use strict';

import scaffold = require('./../scaffold');
import TestData = require('../data/test-data');


var mockery = scaffold.Mockery;


export module Level9 {

    var containerBuilder : Typeioc.IContainerBuilder;

    export function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }

    export function resolvesWithDependency (test) {

        containerBuilder.register(TestData.Test2Base)
            .as(() =>  new TestData.Test2());
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

        var actualDynamic = container.resolveWithDependencies<TestData.Test1Base>(TestData.Test1Base, dependencies);

        test.strictEqual(actualDynamic.Name, 'Test 3 name from dependency');

        test.done();
    }

    export function resolveWithDependencyUsesDynamicContainer(test) {

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

    export function resolvesWithNoDependencyIsTheSame(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();
        var actualNative = container.resolve<TestData.Test1Base>(TestData.Test1Base);

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

    export function resolutionErrorWhenUndefinedDependencies(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, undefined);

        test.throws(delegate, error => {
            test.strictEqual(error.message, 'No dependencies provided');
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(2);

        test.done();
    }

    export function resolutionErrorWhenNullDependencies(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, null);

        test.throws(delegate, error => {
            test.strictEqual(error.message, 'No dependencies provided');
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(2);

        test.done();
    }

    export function resolutionErrorWhenEmptyDependencies(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(() => new TestData.Test2());
        containerBuilder.register(TestData.Test1Base)
            .as(c => {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, []);

        test.throws(delegate, error => {
            test.strictEqual(error.message, 'No dependencies provided');
            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(2);

        test.done();
    }

    export function resolutionErrorWhenNoRegistrationWithDependencies(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(() =>  new TestData.Test2());

        var container = containerBuilder.build();

        var dependencies = [{
            service : TestData.Test2Base,
            factory : () => {

                return {
                    get Name() {
                        return 'name from dependency';
                    }
                };
            }
        }];

        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, dependencies);

        test.throws(delegate, error => {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test1Base);

            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(3);

        test.done();
    }

    export function resolutionErrorWhenNoDependenciesRegistration (test) {

        containerBuilder.register(TestData.Test1Base)
            .as(c => {
                var test2 = c.resolve(TestData.Test2Base);

                return new TestData.Test3(test2);
            });

        var container = containerBuilder.build();

        var dependencies = [{
            service : TestData.Test2Base,
            factory : () => {

                return {
                    get Name() {
                        return 'name from dependency';
                    }
                };
            }
        }];

        var delegate = () => container.resolveWithDependencies(TestData.Test1Base, dependencies);

        test.throws(delegate, error => {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test2Base);

            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(3);

        test.done();
    }

    export function resolveWithMultipleDependencies(test) {

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

        var dynamicService = function () {};
        containerBuilder.register(dynamicService)
            .as(c => {

                var test1 = c.resolve(TestData.Test1Base);
                var test2 = c.resolve(TestData.Test2Base);
                var test4 = c.resolveNamed(TestData.Test1Base, "Test 4");

                return new TestData.Test7(test1, test2, test4);
            });

        var container = containerBuilder.build();

        var dependencies : Array<Typeioc.IDynamicDependency> = [{
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
            factory : c => {
                return {
                    get Name () {
                        return 'test 4 base'
                    }
                };
            }
        }];

        var actual = container.resolveWithDependencies<TestData.Test7>(dynamicService, dependencies);
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');

        test.done();
    }

    export function resolveWithDependencyThrowsWhenNamedRegistration(test) {

        containerBuilder.register(TestData.Test2Base)
            .as(() =>  new TestData.Test2());
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

        test.throws(delegate, error => {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test1Base);

            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(3);

        test.done();
    }

    export function resolveWithDependencyThrowsWhenRegistrationWithParams(test) {

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

        test.throws(delegate, error => {
            test.strictEqual(error.message, 'Could not resolve service');
            test.strictEqual(error.data, TestData.Test1Base);

            return (error instanceof scaffold.Exceptions.ResolutionError);
        });

        test.expect(3);

        test.done();
    }

    export function resolveWithDependencyInitializerIsInvoked(test) {

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
            initializer : dependencyInitializer
        }];

        container.resolveWithDependencies(TestData.Test1Base, dependencies);

        test.ok(resolutionInitializer.calledOnce);
        test.ok(resolutionInitializer.calledWithExactly(mockery.match.any, resolveItem));

        test.ok(dependencyInitializer.calledOnce);
        test.ok(dependencyInitializer.calledWithExactly(mockery.match.any, item));

        test.done();
    }

    export function resolveWithPartialUniqueDependencies(test) {

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

        var dynamicService = function () {};
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

        var actual = container.resolveWithDependencies<TestData.Test7>(dynamicService, dependencies);
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 test 4 base');

        test.expect(4);

        test.done();
    }

    export function resolveWithPartialNonNamedDependencies(test) {

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

        var dynamicService = function () {};
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
            service : TestData.Test2Base,
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

        var actual = container.resolveWithDependencies<TestData.Test7>(dynamicService, dependencies);
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'Test 3 test 2 test 2 base test 4 base');

        test.expect(4);

        test.done();
    }

    export function resolveWithPartialNamedDependencies(test) {

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

        var dynamicService = function () {};
        containerBuilder.register(dynamicService)
            .as(c=> {

                var test1 = c.resolve(TestData.Test1Base);
                var test2 = c.resolve(TestData.Test2Base);
                var test4 = c.resolveNamed(TestData.Test1Base, "Test 4");

                test.ok(test4 instanceof TestData.Test4);

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
            factory : () => {

                return {
                    get Name() {
                        return 'test 2 base';
                    }
                }
            }
        }];

        var actual = container.resolveWithDependencies<TestData.Test7>(dynamicService, dependencies);
        test.ok(actual);
        test.ok(actual instanceof TestData.Test7);
        test.strictEqual(actual.Name, 'test 1 base test 2 base test 4');

        test.expect(4);

        test.done();
    }
}