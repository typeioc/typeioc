
'use strict';

exports.api = {

    level3 : (function() {

        var scaffold = require('../../scaffold');
        var testData = scaffold.TestModule;


        var containerBuilder = null;

        return {

            setUp: function (callback) {
                containerBuilder = scaffold.createBuilder();
                callback();
            },

            defaultScopingNone : function (test) {
                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("test 4");
                });

                var container = containerBuilder.build();
                var test1 = container.resolve(testData.Test1Base);
                test1.Name = "test 1";
                var test2 = container.resolve(testData.Test1Base);

                test.notEqual(test1, null);
                test.strictEqual(test1.Name, "test 1");
                test.notEqual(test2, null);
                test.strictEqual(test2.Name, "test 4");

                test.done();
            },

            defaultScopingChange : function (test) {

                scaffold.Types.Defaults.scope = scaffold.Types.Scope.Hierarchy;
                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("test 4");
                });

                var container = containerBuilder.build();
                var test1 = container.resolve(testData.Test1Base);
                test1.Name = "test 1";
                var test2 = container.resolve(testData.Test1Base);

                test.notEqual(test1, null);
                test.strictEqual(test1.Name, "test 1");
                test.notEqual(test2, null);
                test.strictEqual(test2.Name, "test 1");
                test.strictEqual(test1, test2);

                test.done();
            },

            noScopingReuse : function (test) {
                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("test 4");
                }).within(scaffold.Types.Scope.None);

                var container = containerBuilder.build();
                var test1 = container.resolve(testData.Test1Base);
                test1.Name = "test 1";
                var test2 = container.resolve(testData.Test1Base);

                test.notEqual(test1, null);
                test.strictEqual(test1.Name, "test 1");
                test.notEqual(test2, null);
                test.strictEqual(test2.Name, "test 4");

                test.done();
            },

            containerScoping : function (test) {
                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("test 4");
                }).within(scaffold.Types.Scope.Container);

                var container = containerBuilder.build();
                var test1 = container.resolve(testData.Test1Base);
                test1.Name = "test 1";
                var test2 = container.resolve(testData.Test1Base);

                test.notEqual(test1, null);
                test.strictEqual(test1.Name, "test 1");
                test.notEqual(test2, null);
                test.strictEqual(test2.Name, "test 1");

                test.done();
            }
        }
    })()
}