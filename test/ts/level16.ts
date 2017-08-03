'use strict';

import scaffold = require('./../scaffold');
import TestData = require('../data/test-data');

export module Level16 {
    let builder: Typeioc.IContainerBuilder;

    export const asType = {
        setUp: function (callback) {
            builder = scaffold.createBuilder();
            callback();
        },

        resolvesBasic: (test) => {
            builder.register(TestData.Test1Base).asType(TestData.Test1);
            const container = builder.build();
            const actual = container.resolve<TestData.Test1Base>(TestData.Test1Base);

            test.ok(actual);
            test.strictEqual(actual.Name, 'test 1');
            test.done();
        },

        resolvesWithParams: (test) => {
            
            builder.register(TestData.Test1Base).asType(TestData.Test4);
            const container = builder.build();
            const actual = container.resolve<TestData.Test1Base>(TestData.Test1Base, '---');

            test.ok(actual);
            test.strictEqual(actual.Name, '---');
            test.done();
        },

        resolvesNamed: (test) => {
            
            builder.register(TestData.Test1Base)
                    .asType(TestData.Test1).named('A');

            const container = builder.build();
            const actual = container.resolveNamed<TestData.Test1Base>(TestData.Test1Base, 'A');

            test.ok(actual);
            test.strictEqual(actual.Name, 'test 1');
            test.done();
        },

        resolvesNamedWithParams: (test) => {
            
            builder.register(TestData.Test1Base)
                    .asType(TestData.Test4)
                    .named('A');

            const container = builder.build();
            const actual = container.resolveNamed<TestData.Test1Base>(TestData.Test1Base, 'A', '---');

            test.ok(actual);
            test.strictEqual(actual.Name, '---');
            test.done();
        },

        resolvesMultipeRegistrations: (test) => {
            
            builder.register(TestData.Test1Base)
                    .asType(TestData.Test1);
            builder.register(TestData.Test1Base)
                    .asType(TestData.Test1).named('A');
            builder.register(TestData.Test1Base)
                    .asType(TestData.Test1).named('B');

            const container = builder.build();
            const actual = container.resolve<TestData.Test1Base>(TestData.Test1Base);
            const actualA = container.resolveNamed<TestData.Test1Base>(TestData.Test1Base, 'A');
            const actualB = container.resolveNamed<TestData.Test1Base>(TestData.Test1Base, 'B');

            test.strictEqual(actual.Name, 'test 1');
            test.strictEqual(actualA.Name, 'test 1');
            test.strictEqual(actualB.Name, 'test 1');
            test.done();
        },

        resolvesWithDependencies: (test) => {

            const test4 = function() {
                this.Name = 'test 4';
            }

            const test7 = function() {};
            
            builder.register(TestData.Test1Base).asType(TestData.Test1);
            builder.register(TestData.Test2Base).asType(TestData.Test2);
            builder.register(test4).asType(test4);
            builder.register(test7)
                    .asType(TestData.Test7, TestData.Test1Base, TestData.Test2Base, test4);
            
            const container = builder.build();
            const actual = container.resolve<TestData.Test1Base>(test7);

            test.ok(actual);
            test.strictEqual(actual.Name, 'test 1 test 2 test 4');
            test.done();
        },

        resolvesNamedWithDependencies: (test) => {

            const test4 = function() {
                this.Name = 'test 4';
            }

            builder.register(TestData.Test1Base).asType(TestData.Test1);
            builder.register(TestData.Test2Base).asType(TestData.Test2);
            builder.register(test4).asType(test4);
            builder.register(TestData.Test1Base)
                    .asType(TestData.Test7, TestData.Test1Base, TestData.Test2Base, test4)
                    .named('A');
            
            const container = builder.build();
            const actual = container.resolveNamed<TestData.Test1Base>(TestData.Test1Base, 'A');

            test.ok(actual);
            test.strictEqual(actual.Name, 'test 1 test 2 test 4');
            test.done();
        },

        throwsWhenParamsAndArguments : (test) => {

            const test1 = function() {
                this.name = 'test 1';
            }

            const test2 = function(test1, name) {
                this.name = [test1.name, name].join(' ');
            }

            builder.register(test1).asType(test1);
            builder.register(test2).asType(test2, test1);
            
            const container = builder.build();

            const delegate = () => container.resolve(test2, 'A'); 

            test.throws(delegate, function (err) {
                return (err instanceof scaffold.Exceptions.ResolutionError) &&
                    /Could not instantiate service. Could not instantiate type. Arguments and dependencies are not allowed for simultaneous resolution. Pick dependencies or arguments/
                    .test(err.message);
            });

            test.done();
        },

        resolvesWithDynamicDependencies: (test) => {
            const test4 = function() {}
            const test7 = function() {};
            
            builder.register(TestData.Test1Base).asType(TestData.Test1);
            builder.register(TestData.Test2Base).asType(TestData.Test2);
            builder.register(test4).asType(test4);
            builder.register(test7)
                    .asType(TestData.Test7, TestData.Test1Base, TestData.Test2Base, test4);
            
            const container = builder.build();
            const actual = container.resolveWith<TestData.Test1Base>(test7).dependencies([{
                service: TestData.Test1Base,
                factoryType: function() {
                    this.Name = 'test dep 1'
                }
            }, {
                service: TestData.Test2Base,
                factoryType: function() {
                    this.Name = 'test dep 2'
                }
            }, {
                service: test4,
                factoryType: function() {
                    this.Name = 'test dep 4'
                }
            }])
            .exec();

            test.ok(actual);
            test.strictEqual(actual.Name, 'test dep 1 test dep 2 test dep 4');
            test.done();
        },

        resolvesWithDynamicNamedDependencies: (test) => {
            const test4 = function() { }
            const test7 = function() { }

            builder.register(TestData.Test1Base)
                .asType(TestData.Test1)
                .named('Test1');
            builder.register(TestData.Test2Base)
                .asType(TestData.Test2)
                .named('Test2');
            builder.register(test4).asType(test4)
                .named('Test4');
            builder.register(test7)
                    .asType(TestData.Test7, TestData.Test1Base, TestData.Test2Base, test4);
            
            const container = builder.build();
            const actual = container.resolveWith<TestData.Test1Base>(test7)
            .dependencies([{
                    service: TestData.Test1Base,
                    factoryType: function() {
                        this.Name = 'test dep 1'
                    },
                    named: 'Test1'
                }, {
                    service: TestData.Test2Base,
                    factoryType: function() {
                        this.Name = 'test dep 2'
                    },
                    named: 'Test2'
                }, {
                    service: test4,
                    factoryType: function() {
                        this.Name = 'test dep 4'
                    },
                    named: 'Test4'
                }])
                .exec();

            test.ok(actual);
            test.strictEqual(actual.Name, 'test dep 1 test dep 2 test dep 4');
            test.done();
        },

        tryResolvesWithDynamicDependencies: (test) => {
            
            builder.register(TestData.Test1Base)
                .asType(TestData.Test1)
                .named('A');
            
            const container = builder.build();
            const actual = container.resolveWith(TestData.Test1Base)
            .attempt()
            .dependencies([{
                service: TestData.Test1Base,
                factoryType: function() {
                    this.Name = 'test dep 1'
                }
            }])
            .exec();

            test.ok(actual === null);
            test.done();
        }
    }
}