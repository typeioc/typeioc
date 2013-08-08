import typeioc = require('../lib/typeioc');;
import testData = require('test-data');;


export module Level3 {

    export function defaultScopingHierarchy(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("test 4"));

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

    export function noScopingReuse(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("test 4")).
            within(typeioc.Constants.Scope.None);

        var container = containerBuilder.build();
        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");

        test.done();
    };

    export function containerScoping(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("test 4")).
            within(typeioc.Constants.Scope.Container);

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

}