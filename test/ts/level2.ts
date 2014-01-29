
'use strict';

import testData = require('./../test-data');
import scaffold = require('./../scaffold');

export module Level2 {

    var containerBuilder : Typeioc.IContainerBuilder;

    export function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }

    export function customParametersResolution(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as((c, name) => new testData.Test4(name));

        var container = containerBuilder.build();
        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base, "test 4");

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 4");

        test.done();
    }

    export function namedServicesResolution(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test4("null"));
        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test4("a")).named("A");
        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test4("b")).named("B");

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
    }

    export function namedServicesResolutionWithParams(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as((c, name) => new testData.Test4(name)).named("A");
        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as((c, name) => new testData.Test4(name)).named("B");

        var container = containerBuilder.build();
        var actual1 = container.resolveNamed<testData.Test1Base>(testData.Test1Base, "A", "a");
        var actual2 = container.resolveNamed<testData.Test1Base>(testData.Test1Base, "B", "b");

        test.notEqual(actual1, null);
        test.notEqual(actual2, null);
        test.strictEqual(actual1.Name, "a");
        test.strictEqual(actual2.Name, "b");

        test.done();
    }

    export function namedServicesResolutionWithParamsError(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as((c, name) => new testData.Test4(name)).named("A");

        var container = containerBuilder.build();
        var delegate = () => container.resolveNamed<testData.Test1Base>(testData.Test1Base, "A");

        test.throws(delegate, function(err) {
            return (err instanceof scaffold.Exceptions.ResolutionError) &&
                /Could not resolve service/.test(err.message);
        });

        test.done();
    }

    export function namedServicesParametersResolution(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as((c, name) => new testData.Test4(name)).named("A");

        var container = containerBuilder.build();
        var delegate = () => container.resolveNamed<testData.Test1Base>(testData.Test1Base, "A");

        test.throws(delegate, function(err) {
            return (err instanceof scaffold.Exceptions.ResolutionError) &&
                /Could not resolve service/.test(err.message);
        });

        test.done();
    }

    export function attemptNamedServicesParametersResolution(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as((c, name) => new testData.Test4(name)).named("A");

        var container = containerBuilder.build();
        var actual = container.tryResolveNamed<testData.Test1Base>(testData.Test1Base, "A");
        test.equal(null, actual);

        test.done();
    }

    export function collidingResolution(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test4("a"));
        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test4("b"));

        var container = containerBuilder.build();
        var actual1 = container.resolve<testData.Test1Base>(testData.Test1Base);
        var actual2 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual1, null);
        test.notEqual(actual2, null);
        test.strictEqual(actual1.Name, "b");
        test.strictEqual(actual2.Name, "b");

        test.done();
    }

}