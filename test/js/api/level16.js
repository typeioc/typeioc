'use strict';

const scaffold = require('./../../scaffold');
const testData = scaffold.TestModule;
let builder;

exports.api = {
    level16: {
        setUp: function (callback) {
            builder = scaffold.createBuilder();
            callback();
        },

        asTypeResolvesBasic: (test) => {
            
            builder.register(testData.Test1Base).asType(testData.Test1);
            const container = builder.build();
            const actual = container.resolve(testData.Test1Base);

            test.ok(actual);
            test.strictEqual(actual.Name, 'test 1');
            test.done();
        },

        asTypeResolvesWithParams: (test) => {
            
            builder.register(testData.Test1Base).asType(testData.Test4);
            const container = builder.build();
            const actual = container.resolve(testData.Test1Base, '---');

            test.ok(actual);
            test.strictEqual(actual.Name, '---');
            test.done();
        },

        asTypeResolvesNamed: (test) => {
            
            builder.register(testData.Test1Base)
                    .asType(testData.Test1).named('A');

            const container = builder.build();
            const actual = container.resolveNamed(testData.Test1Base, 'A');

            test.ok(actual);
            test.strictEqual(actual.Name, 'test 1');
            test.done();
        },

        asTypeResolvesNamedWithParams: (test) => {
            
            builder.register(testData.Test1Base)
                    .asType(testData.Test4)
                    .named('A');

            const container = builder.build();
            const actual = container.resolveNamed(testData.Test1Base, 'A', '---');

            test.ok(actual);
            test.strictEqual(actual.Name, '---');
            test.done();
        },

        asTypeResolvesMultipeRegistrations: (test) => {
            
            builder.register(testData.Test1Base)
                    .asType(testData.Test1);
            builder.register(testData.Test1Base)
                    .asType(testData.Test1).named('A');
            builder.register(testData.Test1Base)
                    .asType(testData.Test1).named('B');

            const container = builder.build();
            const actual = container.resolve(testData.Test1Base);
            const actualA = container.resolveNamed(testData.Test1Base, 'A');
            const actualB = container.resolveNamed(testData.Test1Base, 'B');

            test.strictEqual(actual.Name, 'test 1');
            test.strictEqual(actualA.Name, 'test 1');
            test.strictEqual(actualB.Name, 'test 1');
            test.done();
        },

        asTypeResolvesWithDependancies: (test) => {

            

            test.done();
        }
    }
}