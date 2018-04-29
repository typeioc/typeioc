'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const scaffold = require("./../scaffold");
const TestData = require("../data/test-data");
var Level3;
(function (Level3) {
    var containerBuilder;
    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level3.setUp = setUp;
    function defaultScopingNone(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"));
        var container = containerBuilder.build();
        var test1 = container.resolve(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve(TestData.Test1Base);
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");
        test.done();
    }
    Level3.defaultScopingNone = defaultScopingNone;
    function noScopingReuse(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .within(1 /* None */);
        var container = containerBuilder.build();
        var test1 = container.resolve(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve(TestData.Test1Base);
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");
        test.done();
    }
    Level3.noScopingReuse = noScopingReuse;
    function transientReturnsNewInstance(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .transient();
        const container = containerBuilder.build();
        const child1 = container.createChild();
        const child2 = child1.createChild();
        const actual1 = container.resolve(TestData.Test1Base);
        const actual2 = container.resolve(TestData.Test1Base);
        const actual3 = child1.resolve(TestData.Test1Base);
        const actual4 = child2.resolve(TestData.Test1Base);
        test.strictEqual(actual1.Name, "test 4");
        test.strictEqual(actual2.Name, "test 4");
        test.strictEqual(actual3.Name, "test 4");
        test.strictEqual(actual4.Name, "test 4");
        test.ok(actual1 !== actual2);
        test.ok(actual1 !== actual3);
        test.ok(actual1 !== actual4);
        test.ok(actual2 !== actual3);
        test.ok(actual2 !== actual4);
        test.ok(actual3 !== actual4);
        test.done();
    }
    Level3.transientReturnsNewInstance = transientReturnsNewInstance;
    function containerScopingDifferentContainer(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .within(2 /* Container */);
        var container = containerBuilder.build();
        var test1 = container.resolve(TestData.Test1Base);
        test1.Name = "test 1";
        var child = container.createChild();
        var test2 = child.resolve(TestData.Test1Base);
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");
        test.notStrictEqual(test1, test2);
        test.done();
    }
    Level3.containerScopingDifferentContainer = containerScopingDifferentContainer;
    function instancePerContainerReturnsInstancePerContainer(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .instancePerContainer();
        const container = containerBuilder.build();
        const child = container.createChild();
        const actual11 = container.resolve(TestData.Test1Base);
        const actual12 = container.resolve(TestData.Test1Base);
        const actual21 = child.resolve(TestData.Test1Base);
        const actual22 = child.resolve(TestData.Test1Base);
        test.strictEqual(actual11, actual12);
        test.strictEqual(actual21, actual22);
        test.ok(actual11 !== actual21);
        test.ok(actual11 !== actual22);
        test.ok(actual12 !== actual21);
        test.ok(actual12 !== actual22);
        test.done();
    }
    Level3.instancePerContainerReturnsInstancePerContainer = instancePerContainerReturnsInstancePerContainer;
    function hierarchyScoping(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .within(3 /* Hierarchy */);
        var container = containerBuilder.build();
        var test1 = container.resolve(TestData.Test1Base);
        test1.Name = "test 1";
        var child = container.createChild();
        var test2 = child.resolve(TestData.Test1Base);
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");
        test.strictEqual(test1, test2);
        test.done();
    }
    Level3.hierarchyScoping = hierarchyScoping;
    function singletonReturnsSameInstance(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .singleton();
        const container = containerBuilder.build();
        const child1 = container.createChild();
        const child2 = child1.createChild();
        const actual1 = container.resolve(TestData.Test1Base);
        const actual2 = container.resolve(TestData.Test1Base);
        const actual3 = child1.resolve(TestData.Test1Base);
        const actual4 = child2.resolve(TestData.Test1Base);
        test.strictEqual(actual1.Name, "test 4");
        test.strictEqual(actual1, actual2);
        test.strictEqual(actual1, actual3);
        test.strictEqual(actual1, actual4);
        test.strictEqual(actual2, actual3);
        test.strictEqual(actual2, actual4);
        test.strictEqual(actual3, actual4);
        test.done();
    }
    Level3.singletonReturnsSameInstance = singletonReturnsSameInstance;
    function resolutionWithArgumentsReturnsScopeNoneForHierarchy(test) {
        containerBuilder.register(TestData.Test1Base)
            .as((c, data) => new TestData.Test4(data))
            .within(scaffold.Types.Scope.Hierarchy);
        const container = containerBuilder.build();
        const child = container.createChild();
        const test1 = container.resolve(TestData.Test1Base, 'A');
        const test2 = container.resolve(TestData.Test1Base, 'B');
        const test3 = child.resolve(TestData.Test1Base, 'A');
        const test4 = child.resolve(TestData.Test1Base, 'B');
        test.ok(test1 !== test2);
        test.ok(test2 !== test3);
        test.ok(test3 !== test4);
        test.strictEqual(test1.Name, 'A');
        test.strictEqual(test2.Name, 'B');
        test.strictEqual(test3.Name, 'A');
        test.strictEqual(test4.Name, 'B');
        test.done();
    }
    Level3.resolutionWithArgumentsReturnsScopeNoneForHierarchy = resolutionWithArgumentsReturnsScopeNoneForHierarchy;
    function resolutionWithArgumentsReturnsScopeNoneForContainer(test) {
        containerBuilder.register(TestData.Test1Base)
            .as((c, data) => new TestData.Test4(data))
            .within(scaffold.Types.Scope.Container);
        const container = containerBuilder.build();
        const test1 = container.resolve(TestData.Test1Base, 'A');
        const test2 = container.resolve(TestData.Test1Base, 'B');
        test.ok(test1 !== test2);
        test.strictEqual(test1.Name, 'A');
        test.strictEqual(test2.Name, 'B');
        test.done();
    }
    Level3.resolutionWithArgumentsReturnsScopeNoneForContainer = resolutionWithArgumentsReturnsScopeNoneForContainer;
})(Level3 = exports.Level3 || (exports.Level3 = {}));
//# sourceMappingURL=level03.js.map