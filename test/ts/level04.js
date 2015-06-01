'use strict';
var scaffold = require('./../scaffold');
var TestData = require('../data/test-data');
var Level4;
(function (Level4) {
    var containerBuilder;
    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level4.setUp = setUp;
    function serviceRegisteredOnParentResolveOnChildContainer(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(function () { return new TestData.Test1(); })
            .within(3 /* Hierarchy */);
        var container = containerBuilder.build();
        var child = container.createChild();
        var test1 = child.resolve(TestData.Test1Base);
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.done();
    }
    Level4.serviceRegisteredOnParentResolveOnChildContainer = serviceRegisteredOnParentResolveOnChildContainer;
    function serviceRegisteredNamedOnParentResolveNamedOnChildContainer(test) {
        var registrationName = 'name reg';
        containerBuilder.register(TestData.Test1Base)
            .as(function () { return new TestData.Test1(); })
            .named(registrationName)
            .within(3 /* Hierarchy */);
        var container = containerBuilder.build();
        var child = container.createChild();
        var test1 = child.resolveNamed(TestData.Test1Base, registrationName);
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.done();
    }
    Level4.serviceRegisteredNamedOnParentResolveNamedOnChildContainer = serviceRegisteredNamedOnParentResolveNamedOnChildContainer;
    function serviceRegisteredOnParentResolveOnChildContainerNoHierarchy(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(function () { return new TestData.Test1(); });
        var container = containerBuilder.build();
        var child = container.createChild();
        var test1 = child.resolve(TestData.Test1Base);
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.done();
    }
    Level4.serviceRegisteredOnParentResolveOnChildContainerNoHierarchy = serviceRegisteredOnParentResolveOnChildContainerNoHierarchy;
    function hierarchyScopedInstanceIsReusedOnSameContainer(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(function () { return new TestData.Test4("test 4"); })
            .within(3 /* Hierarchy */);
        var container = containerBuilder.build();
        var test1 = container.resolve(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve(TestData.Test1Base);
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");
        test.done();
    }
    Level4.hierarchyScopedInstanceIsReusedOnSameContainer = hierarchyScopedInstanceIsReusedOnSameContainer;
    function hierarchyScopedInstanceIsReusedOnSameContainerChildFirst(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(function () { return new TestData.Test4("test 4"); })
            .within(3 /* Hierarchy */);
        var container = containerBuilder.build();
        var child = container.createChild();
        var test1 = child.resolve(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve(TestData.Test1Base);
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");
        test.done();
    }
    Level4.hierarchyScopedInstanceIsReusedOnSameContainerChildFirst = hierarchyScopedInstanceIsReusedOnSameContainerChildFirst;
    function containerScopedInstanceIsNotReusedOnChild(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(function () { return new TestData.Test4("test 4"); })
            .within(2 /* Container */);
        var container = containerBuilder.build();
        var child = container.createChild();
        var test1 = container.resolve(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = child.resolve(TestData.Test1Base);
        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");
        test.done();
    }
    Level4.containerScopedInstanceIsNotReusedOnChild = containerScopedInstanceIsNotReusedOnChild;
    function uknownScopeError(test) {
        containerBuilder.register(TestData.Test1Base)
            .as(function () { return new TestData.Test4("test 4"); })
            .within(5);
        var container = containerBuilder.build();
        var child = container.createChild();
        var delegate = function () { return child.resolve(TestData.Test1Base); };
        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ResolutionError) &&
                /Unknown scoping/.test(err.message);
        });
        test.done();
    }
    Level4.uknownScopeError = uknownScopeError;
})(Level4 = exports.Level4 || (exports.Level4 = {}));
//# sourceMappingURL=level04.js.map