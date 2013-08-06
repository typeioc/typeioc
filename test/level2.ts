import typeioc = require('../lib/typeioc');;
import testData = require('test-data');;
import exceptions = require('../lib/exceptions');;

export module Level2 {

    export function customParametersResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as((c, name) => new testData.Test4(name));

        var container = containerBuilder.build();
        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base, "test 4");

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 4");

        test.done();
    };

    export function namedServicesResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("null"));
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("a")).named("A");
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("b")).named("B");

        var container = containerBuilder.build();
        var actual1 = container.resolveNamed<testData.Test1Base>(testData.Test1Base, "A");
        var actual2 = container.resolveNamed<testData.Test1Base>(testData.Test1Base, "B");
        var actual3 = container.resolve(testData.Test1Base);

        test.notEqual(actual1, null);
        test.notEqual(actual2, null);
        test.notEqual(actual3, null);
        test.strictEqual(actual1.Name, "a");
        test.strictEqual(actual2.Name, "b");
        test.strictEqual(actual3.Name, "null");

        test.done();
    };


    export function namedServicesResolutionWithParams(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as((c, name) => new testData.Test4(name)).named("A");
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as((c, name) => new testData.Test4(name)).named("B");

        var container = containerBuilder.build();
        var actual1 = container.resolveNamed<testData.Test1Base>(testData.Test1Base, "A", "a");
        var actual2 = container.resolveNamed<testData.Test1Base>(testData.Test1Base, "B", "b");

        test.notEqual(actual1, null);
        test.notEqual(actual2, null);
        test.strictEqual(actual1.Name, "a");
        test.strictEqual(actual2.Name, "b");

        test.done();
    };

    export function namedServicesResolutionWithParamsError(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as((c, name) => new testData.Test4(name)).named("A");

        var container = containerBuilder.build();
        var delegate = () => container.resolveNamed<testData.Test1Base>(testData.Test1Base, "A");

        test.throws(delegate, function(err) {
            return (err instanceof exceptions.ResolutionError) &&
                /Could not resolve service/.test(err.message);
        });

        test.done();
    };


    export function namedServicesParametersResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as((c, name) => new testData.Test4(name)).named("A");

        var container = containerBuilder.build();
        var delegate = () => container.resolveNamed<testData.Test1Base>(testData.Test1Base, "A");

        test.throws(delegate, function(err) {
            return (err instanceof exceptions.ResolutionError) &&
                /Could not resolve service/.test(err.message);
        });

        test.done();
    };

    export function attemptNamedServicesParametersResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as((c, name) => new testData.Test4(name)).named("A");

        var container = containerBuilder.build();
        var actual = container.tryResolveNamed<testData.Test1Base>(testData.Test1Base, "A");
        test.equal(null, actual);

        test.done();
    };

    export function collidingResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("a"));
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test4("b"));

        var container = containerBuilder.build();
        var actual1 = container.resolve<testData.Test1Base>(testData.Test1Base);
        var actual2 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual1, null);
        test.notEqual(actual2, null);
        test.strictEqual(actual1.Name, "b");
        test.strictEqual(actual2.Name, "b");

        test.done();
    };

}