'use strict';

const scaffold = require('./../../scaffold');
const testData = scaffold.TestModule;
let builder;

exports.api = {
    level18: {
        setUp: function (callback) {
            builder = scaffold.createBuilder();
            callback();
        },

        asValue_resolves_basic: (test) => {
            
            const value = 123;
            builder.register(testData.Test1).asValue(value);
            
            const container = builder.build();
            const actual = container.resolve(testData.Test1);
            
            test.strictEqual(actual, value);
            test.done();
        },

        asValue_resolves_falsy: (test) => {
            const zero = 0;
            const f = false;
            const empty = '';
            const nl = null;
            const undef = undefined;
          
            builder.register('zero').asValue(zero);
            builder.register('false').asValue(f);
            builder.register('empty').asValue(empty);
            builder.register('null').asValue(nl);
            builder.register('undefined').asValue(undef);
            builder.register('NaN').asValue(NaN);
            
            const container = builder.build();
            const actualZero = container.resolve('zero');
            const actualFalse = container.resolve('false');
            const actualEmpty = container.resolve('empty');
            const actualNull = container.resolve('null');
            const actualUndefined = container.resolve('undefined');
            const actualNaN = container.resolve('NaN');
            
            test.strictEqual(actualZero, zero);
            test.strictEqual(actualFalse, f);
            test.strictEqual(actualEmpty, empty);
            test.strictEqual(actualNull, nl);
            test.strictEqual(actualUndefined, undef);
            test.strictEqual(isNaN(actualNaN), true);
            test.done();
        },

        asValue_resolves_with_args: (test) => {
            
            const value = 123;
            builder.register(testData.Test1).asValue(value);
            
            const container = builder.build();
            const actual = container.resolve(testData.Test1, 1, 2, 3);
            
            test.strictEqual(actual, value);
            test.done();
        },

        asValue_resolves_as_depandency_for_asType: (test) => {
            
            const service = function() {}
            const resolution = function(value) { this.name = value};
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

        asValue_resolves_as_dependency_for_asSelf: (test) => {
            
            const serviceValue = 'value';
            const value = '123';

            builder.register(testData.TestModule1.Test1)
                .asSelf(serviceValue);
            builder.register(serviceValue).asValue(value);
            
            const container = builder.build();
            const actual = container.resolve(testData.TestModule1.Test1);
            
            test.ok(actual);
            test.strictEqual(actual.name, value);
            test.done();
        },

        asValue_resolves_named: (test) => {
            
            const value = 123;
            builder.register(testData.Test1).asValue(value);
            builder.register(testData.Test1).asValue(value).named('A');
            builder.register(testData.Test1).asValue(value).named('B');
            
            const container = builder.build();
            const actual1 = container.resolve(testData.Test1);
            const actual2 = container.resolveNamed(testData.Test1, 'A');
            const actual3 = container.resolveNamed(testData.Test1, 'B');
            
            test.strictEqual(actual1, actual2);
            test.strictEqual(actual2, actual3);
            test.strictEqual(actual1, value);
            test.done();
        },

        asValue_resolves_as_dynamic_dependency: (test) => {
            
            const value = 123;
            builder.register(testData.Test1Base).asValue(value);

            builder.register(testData.Test2Base)
            .as(c => {
                const v = c.resolve(testData.Test1Base);
                return v + 5;
            });

            const container = builder.build();
            const actual1 = container.resolve(testData.Test2Base);
            const actual2 = container.resolveWithDependencies(testData.Test2Base, [{
                service: testData.Test1Base,
                factoryValue: 3 
            }]);

            test.strictEqual(actual1, 123 + 5);
            test.strictEqual(actual2, 3 + 5);
            
            test.done();
        },

        asValue_resolves_as_dynamic_dependency_named: (test) => {
            
            const value = 123;
            builder.register(testData.Test1Base).asValue(value).named('A');

            builder.register(testData.Test2Base)
            .as(c => {
                const v = c.resolveNamed(testData.Test1Base, 'A');
                return v + 5;
            });

            const container = builder.build();
            const actual1 = container.resolve(testData.Test2Base);
            const actual2 = container.resolveWithDependencies(testData.Test2Base, [{
                service: testData.Test1Base,
                factoryValue: 3,
                named: 'A'
            }]);

            test.strictEqual(actual1, 123 + 5);
            test.strictEqual(actual2, 3 + 5);
            
            test.done();
        }
    }
}