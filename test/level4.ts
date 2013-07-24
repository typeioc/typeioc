import typeioc = require('../lib/typeioc');;
import testData = require('test-data');;
import exceptions = require('../lib/exceptions');;



export module Level4 {

    export function serviceRegisteredOnParentResolveOnChildContainer(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test1()).
            within(typeioc.Constants.Scope.Hierarchy);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");

        test.done();
    };

    export function serviceRegisteredOnParentResolveOnChildContainerNoHierarchy(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test1());

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");

        test.done();
    };

    export function hierarchyScopedInstanceIsReusedOnSameContainer(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("test 4")).
            within(typeioc.Constants.Scope.Hierarchy);

        var container = containerBuilder.build();
        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");

        test.done();
    };

    export function hierarchyScopedInstanceIsReusedOnSameContainerChildFirst(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("test 4")).
            within(typeioc.Constants.Scope.Hierarchy);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");

        test.done();
    };

    export function containerScopedInstanceIsNotReusedOnChild(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("test 4")).
            within(typeioc.Constants.Scope.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = child.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");

        test.done();
    };


    export function uknownScopeError(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("test 4")).
            within(5);

        var container = containerBuilder.build();
        var child = container.createChild();

        var delegate = () => child.resolve<testData.Test1Base>(testData.Test1Base);

        test.throws(delegate, function(err) {
            return (err instanceof exceptions.ResolutionError) &&
                /Unknown scoping/.test(err.message);
        });

        test.done();
    };



}