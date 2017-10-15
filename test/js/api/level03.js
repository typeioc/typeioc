
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

            transientReturnsNewInstance: function(test) {
                containerBuilder.register(testData.Test1Base)
                .as(() => new testData.Test4("test 4"))
                .transient();

                const container = containerBuilder.build();
                const child1 = container.createChild();
                const child2 = child1.createChild();

                const actual1 = container.resolve(testData.Test1Base);
                const actual2 = container.resolve(testData.Test1Base);
                const actual3 = child1.resolve(testData.Test1Base);
                const actual4 = child2.resolve(testData.Test1Base);

                test.strictEqual(actual1.Name, "test 4");
                test.strictEqual(actual2.Name, "test 4");
                test.strictEqual(actual3.Name, "test 4");
                test.strictEqual(actual4.Name, "test 4");
                test.ok(actual1 !== actual2);
                test.ok(actual1 !== actual3);
                test.ok(actual1 !== actual4);
                test.ok(actual2 !== actual3)
                test.ok(actual2 !== actual4);
                test.ok(actual3 !== actual4);
                
                test.done();
            },

            containerScoping_same_container : function (test) {
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
                test.strictEqual(test1, test2);

                test.done();
            },

            containerScoping_different_containers : function (test) {
                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("test 4");
                }).within(scaffold.Types.Scope.Container);

                var container = containerBuilder.build();
                var test1 = container.resolve(testData.Test1Base);
                test1.Name = "test 1";

                var child = container.createChild();

                var test2 = child.resolve(testData.Test1Base);

                test.notEqual(test1, null);
                test.strictEqual(test1.Name, "test 1");
                test.notEqual(test2, null);
                test.strictEqual(test2.Name, "test 4");
                test.notStrictEqual(test1, test2);

                test.done();
            },

            instancePerContainerReturnsInstancePerContainer: function(test) {
                containerBuilder.register(testData.Test1Base)
                .as(() => new testData.Test4("test 4"))
                .instancePerContainer();

                const container = containerBuilder.build();
                const child = container.createChild();

                const actual11 = container.resolve(testData.Test1Base);
                const actual12 = container.resolve(testData.Test1Base);
                const actual21 = child.resolve(testData.Test1Base);
                const actual22 = child.resolve(testData.Test1Base);
            
                test.strictEqual(actual11, actual12);
                test.strictEqual(actual21, actual22);
                test.ok(actual11 !== actual21);
                test.ok(actual11 !== actual22);
                test.ok(actual12 !== actual21)
                test.ok(actual12 !== actual22);
                
                test.done();
            },

            hierarchyScoping : function (test) {

                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("test 4");
                })
                .within(scaffold.Types.Scope.Hierarchy);

                var container = containerBuilder.build();
                var test1 = container.resolve(testData.Test1Base);
                test1.Name = "test 1";

                var child = container.createChild();

                var test2 = child.resolve(testData.Test1Base);

                test.notEqual(test1, null);
                test.strictEqual(test1.Name, "test 1");
                test.notEqual(test2, null);
                test.strictEqual(test2.Name, "test 1");
                test.strictEqual(test1, test2);

                test.done();
            },

            singletonReturnsSameInstance: function(test) {
                containerBuilder.register(testData.Test1Base)
                .as(() => new testData.Test4("test 4"))
                .singleton();

                const container = containerBuilder.build();
                const child1 = container.createChild();
                const child2 = child1.createChild();

                const actual1 = container.resolve(testData.Test1Base);
                const actual2 = container.resolve(testData.Test1Base);
                const actual3 = child1.resolve(testData.Test1Base);
                const actual4 = child2.resolve(testData.Test1Base);

                test.strictEqual(actual1.Name, "test 4");
                test.strictEqual(actual1, actual2);
                test.strictEqual(actual1, actual3);
                test.strictEqual(actual1, actual4);
                test.strictEqual(actual2, actual3);
                test.strictEqual(actual2, actual4);
                test.strictEqual(actual3, actual4);
                
                test.done();
            },

            hierarchyMultiLevelScoping : function (test) {

                containerBuilder.register(testData.Test1Base).as(function () {
                    return new testData.Test4("test 4");
                }).within(scaffold.Types.Scope.Hierarchy);

                var container = containerBuilder.build();
                var test1 = container.resolve(testData.Test1Base);
                test1.Name = "test 1";

                var child = container.createChild();
                child = child.createChild();
                child = child.createChild();
                child = child.createChild();

                var test2 = child.resolve(testData.Test1Base);

                test.notEqual(test1, null);
                test.strictEqual(test1.Name, "test 1");
                test.notEqual(test2, null);
                test.strictEqual(test2.Name, "test 1");
                test.strictEqual(test1, test2);

                test.done();
            },

            resolutionWithArgumentsReturnsScopeNoneForHierarchy: (test) => {
                containerBuilder.register(testData.Test1Base)
                    .as((c, data) => new testData.Test4(data))
                    .within(scaffold.Types.Scope.Hierarchy);

                var container = containerBuilder.build();
                const child = container.createChild();
                var test1 = container.resolve(testData.Test1Base, 'A');
                var test2 = container.resolve(testData.Test1Base, 'B');
                const test3 = child.resolve(testData.Test1Base, 'A');
                const test4 = child.resolve(testData.Test1Base, 'B');

                test.ok(test1 !== test2);
                test.ok(test2 !== test3);
                test.ok(test3 !== test4);
                test.strictEqual(test1.Name, 'A');
                test.strictEqual(test2.Name, 'B');
                test.strictEqual(test3.Name, 'A');
                test.strictEqual(test4.Name, 'B');

                test.done();
            },

            resolutionWithArgumentsReturnsScopeNoneForContainer: (test) => {
                containerBuilder.register(testData.Test1Base)
                    .as((c, data) => new testData.Test4(data))
                    .within(scaffold.Types.Scope.Container);

                const container = containerBuilder.build();
                const test1 = container.resolve(testData.Test1Base, 'A');
                const test2 = container.resolve(testData.Test1Base, 'B');

                test.ok(test1 !== test2);
                test.strictEqual(test1.Name, 'A');
                test.strictEqual(test2.Name, 'B');

                test.done();
            }
        }
    })()
}