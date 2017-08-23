'use strict';

const scaffold = require('./../../scaffold');
const testData = scaffold.TestModule;
let builder;

exports.api = {
    level16: {
        asType: {
            setUp: function (callback) {
                builder = scaffold.createBuilder();
                callback();
            },
    
            resolves_basic: (test) => {
                
                builder.register(testData.Test1Base)
                    .asType(testData.Test1);
                
                const container = builder.build();
                const actual = container.resolve(testData.Test1Base);
    
                test.ok(actual);
                test.strictEqual(actual.Name, 'test 1');
                test.done();
            },
    
            resolves_with_params: (test) => {
                
                builder.register(testData.Test1Base).asType(testData.Test4);
                const container = builder.build();
                const actual = container.resolve(testData.Test1Base, '---');
    
                test.ok(actual);
                test.strictEqual(actual.Name, '---');
                test.done();
            },
    
            resolves_named: (test) => {
                
                builder.register(testData.Test1Base)
                        .asType(testData.Test1).named('A');
    
                const container = builder.build();
                const actual = container.resolveNamed(testData.Test1Base, 'A');
    
                test.ok(actual);
                test.strictEqual(actual.Name, 'test 1');
                test.done();
            },
    
            resolves_named_with_params: (test) => {
                
                builder.register(testData.Test1Base)
                        .asType(testData.Test4)
                        .named('A');
    
                const container = builder.build();
                const actual = container.resolveNamed(testData.Test1Base, 'A', '---');
    
                test.ok(actual);
                test.strictEqual(actual.Name, '---');
                test.done();
            },
    
            resolves_multiple_registrations: (test) => {
                
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
    
            resolves_with_dependencies: (test) => {
    
                const test4 = function() {
                    this.Name = 'test 4';
                }
    
                const test7 = function() {};
                
                builder.register(testData.Test1Base).asType(testData.Test1);
                builder.register(testData.Test2Base).asType(testData.Test2);
                builder.register(test4).asType(test4);
                builder.register(test7)
                        .asType(testData.Test7, testData.Test1Base, testData.Test2Base, test4);
                
                const container = builder.build();
                const actual = container.resolve(test7);
    
                test.ok(actual);
                test.strictEqual(actual.Name, 'test 1 test 2 test 4');
                test.done();
            },
    
            resolves_named_with_dependencies: (test) => {
    
                const test4 = function() {
                    this.Name = 'test 4';
                }
    
                builder.register(testData.Test1Base).asType(testData.Test1);
                builder.register(testData.Test2Base).asType(testData.Test2);
                builder.register(test4).asType(test4);
                builder.register(testData.Test1Base)
                        .asType(testData.Test7, testData.Test1Base, testData.Test2Base, test4)
                        .named('A');
                
                const container = builder.build();
                const actual = container.resolveNamed(testData.Test1Base, 'A');
    
                test.ok(actual);
                test.strictEqual(actual.Name, 'test 1 test 2 test 4');
                test.done();
            },
    
            throws_when_params_and_arguments : (test) => {
    
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
    
            resolves_with_dynamic_dependencies: (test) => {
                const test4 = function() {}
                const test7 = function() {};
                
                builder.register(testData.Test1Base).asType(testData.Test1);
                builder.register(testData.Test2Base).asType(testData.Test2);
                builder.register(test4).asType(test4);
                builder.register(test7)
                        .asType(testData.Test7, testData.Test1Base, testData.Test2Base, test4);
                
                const container = builder.build();
                const actual = container.resolveWith(test7).dependencies([{
                    service: testData.Test1Base,
                    factoryType: function() {
                        this.Name = 'test dep 1'
                    }
                }, {
                    service: testData.Test2Base,
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
    
            resolves_with_dynamic_named_dependencies: (test) => {
                const test4 = function() { }
                const test7 = function() { }
    
                builder.register(testData.Test1Base)
                    .asType(testData.Test1)
                    .named('Test1');
                builder.register(testData.Test2Base)
                    .asType(testData.Test2)
                    .named('Test2');
                builder.register(test4).asType(test4)
                    .named('Test4');
                builder.register(test7)
                        .asType(testData.Test7, testData.Test1Base, testData.Test2Base, test4);
                
                const container = builder.build();
                const actual = container.resolveWith(test7)
                .dependencies([{
                        service: testData.Test1Base,
                        factoryType: function() {
                            this.Name = 'test dep 1'
                        },
                        named: 'Test1'
                    }, {
                        service: testData.Test2Base,
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
    
            try_resolves_with_dynamic_dependencies: (test) => {
                
                builder.register(testData.Test1Base)
                    .asType(testData.Test1)
                    .named('A');
                
                const container = builder.build();
                const actual = container.resolveWith(testData.Test1Base)
                .attempt()
                .dependencies([{
                    service: testData.Test1Base,
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
}