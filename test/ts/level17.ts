'use strict';

import scaffold = require('./../scaffold');
import TestData = require('../data/test-data');

export module Level17 {
    let builder: Typeioc.IContainerBuilder;

    export const asSelf = {
        setUp: function (callback) {
            builder = scaffold.createBuilder();
            callback();
        },

        resolvesBasic: (test) => {
            
            builder.register(TestData.Test1).asSelf();
            
            const container = builder.build();
            const actual = container.resolve<TestData.Test1>(TestData.Test1);

            test.ok(actual);
            test.strictEqual(actual.Name, 'test 1');
            test.done();
        },

        asSelfResolvesWithParams: (test) => {
            
            builder.register(TestData.Test4).asSelf();
            const container = builder.build();
            const actual = container.resolve<TestData.Test4>(TestData.Test4, '---');

            test.ok(actual);
            test.strictEqual(actual.Name, '---');
            test.done();
        },
        
        asSelfResolvesWithMultipleParams: (test) => {
            
            const service = function(arg1, arg2, arg3) {
                this.name = `${arg1} ${arg2} ${arg3}`;
            } 

            builder.register(service).asSelf();
            const container = builder.build();
            const actual = container.resolve<{name: string}>(service, 1, 2, 3);

            test.ok(actual);
            test.strictEqual(actual.name, '1 2 3');
            test.done();
        },

        asSelfResolvesWithDependencies: (test) => {

            const test4 = function() {
                this.Name = 'test 4';
            }

            const test7 = function(arg1, arg2, arg3) {
                this.Name = `${arg1.Name} ${arg2.Name} ${arg3.Name}`;
            };
            
            builder.register(TestData.Test1).asSelf();
            builder.register(TestData.Test2Base).asType(TestData.Test2);
            builder.register(test4).asSelf();
            builder.register(test7)
                    .asSelf(TestData.Test1, TestData.Test2Base, test4);
            
            const container = builder.build();
            const actual = container.resolve<{Name: string}>(test7);

            test.ok(actual);
            test.strictEqual(actual.Name, 'test 1 test 2 test 4');
            test.done();
        }
    }
}