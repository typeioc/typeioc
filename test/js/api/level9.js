'use strict';

exports.api = {

    level9: (function () {

        var scaffold = require('./../../scaffold');
        var testData = scaffold.TestModule;

        var containerBuilder;

        return {
            setUp: function (callback) {
                containerBuilder = scaffold.createBuilder();
                callback();
            },

            simpleTest : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();
                var actualNative = container.resolve(testData.Test1Base);


                var dependencies = {
                    service : testData.Test2Base,
                    resolverFactory : function(c) {

                        function Test2Base() {
                        }
                        Object.defineProperty(Test2Base.prototype, "Name", {
                            get: function () {
                                return 'name from dependency';
                            },
                            enumerable: true,
                            configurable: true
                        });
                        return new Test2Base();
                    }
                };

                var actualDynamic = container.resolveWithDep(testData.Test1Base, dependencies);

                test.ok(actualDynamic.Name, actualNative.Name);
                test.strictEqual(actualDynamic.Name, 'Test 3 name from dependency');

                test.done();
            }
        }
    })()
}
