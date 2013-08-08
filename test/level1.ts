import typeioc = require('../lib/typeioc');;
import testData = require('test-data');;
import exceptions = require('../lib/exceptions');;

export module Level1 {

    export function containerConstruction(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        var container = containerBuilder.build();

        test.notEqual(container, null);

        test.done();
    };

    export function parameterlessResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test1());

        var container = containerBuilder.build();
        var actual = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    };

    export function multipleParameterlessResolutions(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test1());
        containerBuilder.register<testData.Test2Base>(testData.Test2Base).as(() => new testData.Test2());

        var container = containerBuilder.build();
        var actual1 = container.resolve<testData.Test1Base>(testData.Test1Base);
        var actual2 = container.resolve<testData.Test2Base>(testData.Test2Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 2");

        test.done();
    };

    export function overridingResolutions(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test1());
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test1());

        var container = containerBuilder.build();
        var actual1 = container.resolve<testData.Test1Base>(testData.Test1Base);
        var actual2 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 1");

        test.done();
    };

    export function overridingParameterContainerResolutions(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test1());
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as((c) => new testData.Test1());

        var container = containerBuilder.build();
        var actual1 = container.resolve<testData.Test1Base>(testData.Test1Base);
        var actual2 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 1");

        test.done();
    };

    export function parameterContainerResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as((c) => new testData.Test1());

        var container = containerBuilder.build();
        var actual1 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");

        test.done();
    };

    export function errorNoExistingResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        var container = containerBuilder.build();

        var delegate = () => container.resolve<testData.Test1Base>(testData.Test1Base);

        test.throws(delegate, function(err) {
                return (err instanceof exceptions.ResolutionError) &&
                      /Could not resolve service/.test(err.message);
        });

        test.done();
    };


    export function attemptResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        var container = containerBuilder.build();

        var actual = container.tryResolve<testData.Test1Base>(testData.Test1Base);

        test.equal(null, actual);

        test.done();
    };

    export function attemptNamedResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        var container = containerBuilder.build();

        var actual = container.tryResolveNamed<testData.Test1Base>(testData.Test1Base, "Test Name");

        test.equal(null, actual);

        test.done();
    };

    export function attemptNamedExistingResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test1());
        var container = containerBuilder.build();

        var actual = container.tryResolveNamed<testData.Test1Base>(testData.Test1Base, "Test Name");

        test.equal(null, actual);

        test.done();
    };

    export function dependenciesResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register<testData.Test2Base>(testData.Test2Base).as(() => new testData.Test2());
        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as((c) => {
            var test2 = c.resolve(testData.Test2Base);

            return new testData.Test3(test2);
        });

        var container = containerBuilder.build();
        var actual = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "Test 3 test 2");

        test.done();
    };


}

