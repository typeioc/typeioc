'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const scaffold = require("./../scaffold");
const TestData = require("../data/test-data");
var Level18;
(function (Level18) {
    let builder;
    Level18.asSelf = {
        setUp: function (callback) {
            builder = scaffold.createBuilder();
            callback();
        },
        asValueResolvesBasic: (test) => {
            const value = 123;
            builder.register(TestData.Test1).asValue(value);
            const container = builder.build();
            const actual = container.resolve(TestData.Test1);
            test.strictEqual(actual, value);
            test.done();
        },
        asValueResolvesWithArgs: (test) => {
            const value = 123;
            builder.register(TestData.Test1).asValue(value);
            const container = builder.build();
            const actual = container.resolve(TestData.Test1, 1, 2, 3);
            test.strictEqual(actual, value);
            test.done();
        },
        asValueResolvesAsDepandencyForAsType: (test) => {
            const service = function () { };
            const resolution = function (value) { this.name = value; };
            const serviceValue = '';
            const value = '123';
            builder.register(serviceValue).asValue(value);
            builder.register(service).asType(resolution, serviceValue);
            const container = builder.build();
            const actual = container.resolve(service);
            test.ok(actual);
            test.strictEqual(actual.name, value);
            test.done();
        },
        asValueResolvesAsDependencyForAsSelf: (test) => {
            const serviceValue = 'value';
            const value = '123';
            builder.register(TestData.TestModule1.Test1)
                .asSelf(serviceValue);
            builder.register(serviceValue).asValue(value);
            const container = builder.build();
            const actual = container.resolve(TestData.TestModule1.Test1);
            test.ok(actual);
            test.strictEqual(actual.name, value);
            test.done();
        },
        asValueResolvesNamed: (test) => {
            const value = 123;
            builder.register(TestData.Test1).asValue(value);
            builder.register(TestData.Test1).asValue(value).named('A');
            builder.register(TestData.Test1).asValue(value).named('B');
            const container = builder.build();
            const actual1 = container.resolve(TestData.Test1);
            const actual2 = container.resolveNamed(TestData.Test1, 'A');
            const actual3 = container.resolveNamed(TestData.Test1, 'B');
            test.strictEqual(actual1, actual2);
            test.strictEqual(actual2, actual3);
            test.strictEqual(actual1, value);
            test.done();
        },
        asValueResolvesAsDynamicDependency: (test) => {
            const value = 123;
            builder.register(TestData.Test1Base).asValue(value);
            builder.register(TestData.Test2Base)
                .as(c => {
                const v = c.resolve(TestData.Test1Base);
                return v + 5;
            });
            const container = builder.build();
            const actual1 = container.resolve(TestData.Test2Base);
            const actual2 = container.resolveWithDependencies(TestData.Test2Base, [{
                    service: TestData.Test1Base,
                    factoryValue: 3
                }]);
            test.strictEqual(actual1, 123 + 5);
            test.strictEqual(actual2, 3 + 5);
            test.done();
        },
        asValueResolvesAsDynamicDependencyNamed: (test) => {
            const value = 123;
            builder.register(TestData.Test1Base).asValue(value).named('A');
            builder.register(TestData.Test2Base)
                .as(c => {
                const v = c.resolveNamed(TestData.Test1Base, 'A');
                return v + 5;
            });
            const container = builder.build();
            const actual1 = container.resolve(TestData.Test2Base);
            const actual2 = container.resolveWithDependencies(TestData.Test2Base, [{
                    service: TestData.Test1Base,
                    factoryValue: 3,
                    named: 'A'
                }]);
            test.strictEqual(actual1, 123 + 5);
            test.strictEqual(actual2, 3 + 5);
            test.done();
        }
    };
})(Level18 = exports.Level18 || (exports.Level18 = {}));
//# sourceMappingURL=level18.js.map