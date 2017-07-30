'use strict';

import scaffold = require('./../scaffold');
import TestData = require('../data/test-data');

export module Level15 {

    var containerBuilder: Typeioc.IContainerBuilder;
    
    export var async_default_behavior = {

        setUp: function (callback) {
            containerBuilder = scaffold.createBuilder();
            callback();
        },

        resolveWithResolvesService: function (test) {

            containerBuilder.register(TestData.Test2Base)
                .as(() => new TestData.Test2());

            var container = containerBuilder.build();

            container.resolveWith<TestData.Test2Base>(TestData.Test2Base)
                .execAsync()
                .then(actual => {

                    test.ok(actual);
                    test.ok(actual instanceof TestData.Test2);
                    test.strictEqual(actual.Name, 'test 2');

                    test.done();
                });
        },

        resolveWithThrowsErrorWhenNotFound: function (test) {

            containerBuilder.register(TestData.Test2Base)
                .as(() => new TestData.Test2());

            var container = containerBuilder.build();
            var result = <any>container.resolveWith(TestData.Test1Base)
                .execAsync();

            result.catch(error => {
                test.strictEqual(error.message, 'Could not resolve service');
                test.strictEqual(error.data, TestData.Test1Base);
                test.ok(error instanceof scaffold.Exceptions.ResolutionError);

                test.done();
            });
        },

        resolveWithResolvesServiceWithArgs: function (test) {

            var arg1 = 'arg 1';
            var arg2 = 'arg 2';
            var expected = arg1 + ' ' + arg2;

            containerBuilder.register(TestData.Test1Base)
                .as(function (c, name1, name2) {
                    return new TestData.Test4(expected);
                });

            var container = containerBuilder.build();

            container
                .resolveWith<TestData.Test1Base>(TestData.Test1Base)
                .args(arg1, arg2)
                .execAsync()
                .then(actual => {
                    test.ok(actual);
                    test.ok(actual instanceof TestData.Test4);
                    test.strictEqual(actual.Name, expected);

                    test.done();
                });
        },

        resolveWithAttemptsResolvesService: function (test) {

            containerBuilder.register(TestData.Test2Base)
                .as(() => new TestData.Test2());

            var container = containerBuilder.build();

            var actual = container
                .resolveWith<TestData.Test2Base>(TestData.Test2Base)
                .attempt()
                .execAsync()
                .then(actual => {
                    test.ok(actual);
                    test.ok(actual instanceof TestData.Test2);
                    test.strictEqual(actual.Name, 'test 2');

                    test.done();
                });
        },

        resolveWithResolvesNamedService: function (test) {

            var testName = 'testName';

            containerBuilder.register(TestData.Test2Base)
                .as(() => new TestData.Test2())
                .named(testName);

            var container = containerBuilder.build();

            var actual = container
                .resolveWith<TestData.Test2Base>(TestData.Test2Base)
                .name(testName)
                .execAsync()
                .then(actual => {
                    test.ok(actual);
                    test.ok(actual instanceof TestData.Test2);
                    test.strictEqual(actual.Name, 'test 2');

                    test.done();
                });
        },

        resolvesWithResolvesDependency: function (test) {

            containerBuilder.register(TestData.Test2Base)
                .as(() => new TestData.Test2());

            containerBuilder.register(TestData.Test1Base)
                .as(c => {
                    var test2 = c.resolve<TestData.Test2>(TestData.Test2Base);

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
                .execAsync()
                .then(actual => {
                    test.ok(actual);
                    test.ok(actual instanceof TestData.Test1Base);
                    test.strictEqual(actual.Name, 'Test 3 name from dependency');

                    test.done();
                });
        },
        
        resolvesWithResolvesNamedDependency: function (test) {

            containerBuilder.register(TestData.Test2Base)
                .as(() => new TestData.Test2())
                .named('A');

            containerBuilder.register(TestData.Test1Base)
                .as(c => {
                    var test2 = c.resolveNamed<TestData.Test2>(TestData.Test2Base, 'A');
                    return new TestData.Test3(test2);
                });

            var container = containerBuilder.build();

            var dependencies = [{
                named: 'A',
                service: TestData.Test2Base,
                factory: () => ({
                    get Name() {
                        return 'name from dependency';
                    }
                })
            }];

            var actual = container
                .resolveWith<TestData.Test1Base>(TestData.Test1Base)
                .dependencies(dependencies)
                .execAsync()
                .then(actual => {
                    test.ok(actual);
                    test.ok(actual instanceof TestData.Test1Base);
                    test.strictEqual(actual.Name, 'Test 3 name from dependency');

                    test.done();
                });
        },

        resolveWithResolvesCacheDefault: function (test) {

            containerBuilder.register(TestData.Test2Base)
                .as(() => new TestData.Test2());

            var container = containerBuilder.build();

            container
                .resolveWith<TestData.Test2Base>(TestData.Test2Base)
                .cache()
                .execAsync()
                .then(() => {
                    var cache = container.cache;
                    var actual = cache.Test2Base;
                    var actual2 = cache.Test2Base;

                    test.ok(actual);
                    test.ok(actual instanceof TestData.Test2);
                    test.strictEqual(actual.Name, 'test 2');

                    test.strictEqual(actual, actual2);

                    test.done();
                });
        }
    }
}