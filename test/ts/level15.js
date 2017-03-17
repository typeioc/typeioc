'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const scaffold = require("./../scaffold");
const TestData = require("../data/test-data");
var Level15;
(function (Level15) {
    var containerBuilder;
    Level15.async_default_behavior = {
        setUp: function (callback) {
            containerBuilder = scaffold.createBuilder();
            callback();
        },
        resolveWithResolvesService: function (test) {
            containerBuilder.register(TestData.Test2Base)
                .as(() => new TestData.Test2());
            var container = containerBuilder.build();
            container.resolveWith(TestData.Test2Base)
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
            var result = container.resolveWith(TestData.Test1Base)
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
                .resolveWith(TestData.Test1Base)
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
                .resolveWith(TestData.Test2Base)
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
                .resolveWith(TestData.Test2Base)
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
                .resolveWith(TestData.Test2Base)
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
    };
})(Level15 = exports.Level15 || (exports.Level15 = {}));
//# sourceMappingURL=level15.js.map