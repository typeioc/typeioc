'use strict';

const scaffold = require('./../../scaffold');
const testData = scaffold.TestModule;
let builder;

exports.api = {
    level17: {

        asSelf:{
            setUp: function (callback) {
                builder = scaffold.createBuilder();
                callback();
            },
    
            resolves_basic: (test) => {
                
                builder.register(testData.Test1).asSelf();
                
                const container = builder.build();
                const actual = container.resolve(testData.Test1);
    
                test.ok(actual);
                test.strictEqual(actual.Name, 'test 1');
                test.done();
            },
    
            resolves_with_params: (test) => {
                
                builder.register(testData.Test4).asSelf();
                const container = builder.build();
                const actual = container.resolve(testData.Test4, '---');
    
                test.ok(actual);
                test.strictEqual(actual.Name, '---');
                test.done();
            },
            
            resolves_with_multiple_params: (test) => {
                
                const service = function(arg1, arg2, arg3) {
                    this.name = `${arg1} ${arg2} ${arg3}`;
                } 
    
                builder.register(service).asSelf();
                const container = builder.build();
                const actual = container.resolve(service, 1, 2, 3);
    
                test.ok(actual);
                test.strictEqual(actual.name, '1 2 3');
                test.done();
            },
    
            resolves_with_dependencies: (test) => {
    
                const test4 = function() {
                    this.Name = 'test 4';
                }
    
                const test7 = function(arg1, arg2, arg3) {
                    this.Name = `${arg1.Name} ${arg2.Name} ${arg3.Name}`;
                };
                
                builder.register(testData.Test1).asSelf();
                builder.register(testData.Test2Base).asType(testData.Test2);
                builder.register(test4).asSelf();
                builder.register(test7)
                        .asSelf(testData.Test1, testData.Test2Base, test4);
                
                const container = builder.build();
                const actual = container.resolve(test7);
    
                test.ok(actual);
                test.strictEqual(actual.Name, 'test 1 test 2 test 4');
                test.done();
            }
        }
    }
}