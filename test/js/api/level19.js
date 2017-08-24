'use strict';

const scaffold = require('./../../scaffold');
const testData = scaffold.TestModule;
const TestDataDecorators = scaffold.TestDataDecorators;
const Integration = TestDataDecorators.Integration;
const decorator = TestDataDecorators.decorator;'Dep name 1'
let builder1;
let builder2;

exports.api = {
    level19: {

        container_builder: {
            setUp: function (callback) {
                builder1 = scaffold.createBuilder();
                builder2 = scaffold.createBuilder();
                callback();
            },

            copy_copies_registrations(test) {

                builder1.register('testData.TestBase1').asType(testData.Test1);
                builder1.register(testData.Test1).asSelf();
                builder1.register(testData.Test2Base).as(() => 123);
                builder1.register('value').asValue('test - value');

                builder2.copy(builder1);

                const container = builder2.build();

                test.strictEqual(container.resolve('testData.TestBase1').Name, 'test 1');
                test.strictEqual(container.resolve(testData.Test1).Name, 'test 1');
                test.strictEqual(container.resolve(testData.Test2Base), 123);
                test.strictEqual(container.resolve('value'), 'test - value');

                test.done();
            },

            copy_keeps_source_registrations(test) {
                
                builder1.register('testData.TestBase1').asType(testData.Test1);
                builder1.register(testData.Test1).asSelf();
                builder1.register(testData.Test2Base).as(() => 123);
                builder1.register('value').asValue('test - value');

                builder2.copy(builder1);

                const container1 = builder1.build();
                const container2 = builder2.build();

                test.strictEqual(container1.resolve('testData.TestBase1').Name, 'test 1');
                test.strictEqual(container1.resolve(testData.Test1).Name, 'test 1');
                test.strictEqual(container1.resolve(testData.Test2Base), 123);
                test.strictEqual(container1.resolve('value'), 'test - value');

                test.strictEqual(container2.resolve('testData.TestBase1').Name, 'test 1');
                test.strictEqual(container2.resolve(testData.Test1).Name, 'test 1');
                test.strictEqual(container2.resolve(testData.Test2Base), 123);
                test.strictEqual(container2.resolve('value'), 'test - value');

                test.done();
            },

            copy_keeps_destination_registrations(test) {
                
                builder1.register('testData.TestBase1').asType(testData.Test1);
                builder1.register(testData.Test1).asSelf();
                builder2.register(testData.Test2Base).as(() => 123);
                builder2.register('value').asValue('test - value');

                builder2.copy(builder1);

                const container2 = builder2.build();

                test.strictEqual(container2.resolve('testData.TestBase1').Name, 'test 1');
                test.strictEqual(container2.resolve(testData.Test1).Name, 'test 1');
                test.strictEqual(container2.resolve(testData.Test2Base), 123);
                test.strictEqual(container2.resolve('value'), 'test - value');
                test.done();
            }
        },

        decorators: {
            setUp: function (callback) {
                builder1 = scaffold.createBuilder();
                callback();
            },
            
            resolve_basic_registration: (test) => {
                decorator.register(Integration.TestBase1).as(() => ({
                    get name() {
                        return 'Dep name 1';    
                    }
                }));

                decorator.register(Integration.valueKey).asValue(1234567);
                decorator.register(Integration.valueKey1).asType(Integration.Test1);

                const container = decorator.build();
                const actual = container.resolve(Integration.TestBase);

                test.strictEqual(actual.name, 'test Dep name 1 1234567 test 1');                
                test.done();
            },

            resove_with_import: (test) => {
                
                builder1.register(Integration.valueKey2).asValue(2);
                builder1.register(Integration.valueKey3).asValue(3);
                decorator.import(builder1);

                const container = decorator.build();
                const actual = container.resolve(Integration.Test2);

                test.strictEqual(actual.name, 'test 2 3');
                test.done();
            },

            resove_with_import_keeps_registrations: (test) => {
                
                let test1Copis = 0;
                let test2Copis = 0;

                class Test1 {
                    constructor() {
                        test1Copis++;
                    }
                }

                class Test2 {
                    constructor() {
                        test2Copis++;
                    }
                }
                
                builder1.register(Integration.valueKey2)
                .asType(Test1)
                .singleton();
                builder1.register(Integration.valueKey3)
                .asType(Test2)
                .singleton();
                decorator.import(builder1);

                const containerDecortor = decorator.build();
                const actualDecorator = containerDecortor.resolve(Integration.Test2);

                const containerBuilder = builder1.build();
                const actualBuilder1 = containerBuilder.resolve(Integration.valueKey2);
                const actualBuilder2 = containerBuilder.resolve(Integration.valueKey3);

                test.strictEqual(actualDecorator.name, 'test [object Object] [object Object]');
                test.strictEqual(test1Copis, 2);
                test.strictEqual(test2Copis, 2);

                test.done();
            }
        }
    }
}