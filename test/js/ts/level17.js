'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const scaffold = require("./../scaffold");
const TestData = require("../data/test-data");
var Level17;
(function (Level17) {
    let builder;
    Level17.asSelf = {
        setUp: function (callback) {
            builder = scaffold.createBuilder();
            callback();
        },
        asSelfResolvesBasic: (test) => {
            builder.register(TestData.Test1).asSelf();
            const container = builder.build();
            const actual = container.resolve(TestData.Test1);
            test.ok(actual);
            test.strictEqual(actual.Name, 'test 1');
            test.done();
        },
        asSelfResolvesWithParams: (test) => {
            builder.register(TestData.Test4).asSelf();
            const container = builder.build();
            const actual = container.resolve(TestData.Test4, '---');
            test.ok(actual);
            test.strictEqual(actual.Name, '---');
            test.done();
        },
        asSelfResolvesWithMultipleParams: (test) => {
            const service = function (arg1, arg2, arg3) {
                this.name = `${arg1} ${arg2} ${arg3}`;
            };
            builder.register(service).asSelf();
            const container = builder.build();
            const actual = container.resolve(service, 1, 2, 3);
            test.ok(actual);
            test.strictEqual(actual.name, '1 2 3');
            test.done();
        },
        asSelfResolvesWithDependencies: (test) => {
            const test4 = function () {
                this.Name = 'test 4';
            };
            const test7 = function (arg1, arg2, arg3) {
                this.Name = `${arg1.Name} ${arg2.Name} ${arg3.Name}`;
            };
            builder.register(TestData.Test1).asSelf();
            builder.register(TestData.Test2Base).asType(TestData.Test2);
            builder.register(test4).asSelf();
            builder.register(test7)
                .asSelf(TestData.Test1, TestData.Test2Base, test4);
            const container = builder.build();
            const actual = container.resolve(test7);
            test.ok(actual);
            test.strictEqual(actual.Name, 'test 1 test 2 test 4');
            test.done();
        }
    };
})(Level17 = exports.Level17 || (exports.Level17 = {}));
//# sourceMappingURL=level17.js.map