
'use strict';

import scaffold = require('../scaffold');
import TestData = require('../data/test-data');


export module Level1 {

    var containerBuilder : Typeioc.IContainerBuilder;

    export function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }

    export function containerConstruction(test) {


        var container = containerBuilder.build();

        test.notEqual(container, null);

        test.done();
    }

    export function parameterlessResolution(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test1());

        var container = containerBuilder.build();
        var actual = container.resolve<TestData.Test1Base>(TestData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }

    export function multipleParameterlessResolutions(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).as(() => new TestData.Test1());
        containerBuilder.register<TestData.Test2Base>(TestData.Test2Base).as(() => new TestData.Test2());

        var container = containerBuilder.build();
        var actual1 = container.resolve<TestData.Test1Base>(TestData.Test1Base);
        var actual2 = container.resolve<TestData.Test1Base>(TestData.Test2Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 2");

        test.done();
    }

    export function overridingResolutions(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).as(() => new TestData.Test1());
        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).as(() => new TestData.Test1());

        var container = containerBuilder.build();
        var actual1 = container.resolve<TestData.Test1Base>(TestData.Test1Base);
        var actual2 = container.resolve<TestData.Test1Base>(TestData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 1");

        test.done();
    }

    export function overridingParameterContainerResolutions(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).as(() => new TestData.Test1());
        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).as((c) => new TestData.Test1());

        var container = containerBuilder.build();
        var actual1 = container.resolve<TestData.Test1Base>(TestData.Test1Base);
        var actual2 = container.resolve<TestData.Test1Base>(TestData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 1");

        test.done();
    }

    export function parameterContainerResolution(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).as((c) => new TestData.Test1());

        var container = containerBuilder.build();
        var actual1 = container.resolve<TestData.Test1Base>(TestData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");

        test.done();
    }

    export function errorNoExistingResolution(test) {

        var container = containerBuilder.build();

        var delegate = () => container.resolve(TestData.Test1Base);

        test.throws(delegate, function(err) {
                return (err instanceof scaffold.Exceptions.ResolutionError) &&
                      /Could not resolve service/.test(err.message);
        });

        test.done();
    }

    export function attemptResolution(test) {

        var container = containerBuilder.build();

        var actual = container.tryResolve(TestData.Test1Base);

        test.equal(null, actual);

        test.done();
    }

    export function attemptNamedResolution(test) {

        var container = containerBuilder.build();

        var actual = container.tryResolveNamed(TestData.Test1Base, "Test Name");

        test.equal(null, actual);

        test.done();
    }

    export function attemptNamedExistingResolution(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).as(() => new TestData.Test1());
        var container = containerBuilder.build();

        var actual = container.tryResolveNamed(TestData.Test1Base, "Test Name");

        test.equal(null, actual);

        test.done();
    }

    export function dependenciesResolution(test) {

        containerBuilder.register<TestData.Test2Base>(TestData.Test2Base).as(() => new TestData.Test2());
        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).as((c) => {
            var test2 = c.resolve<TestData.Test2>(TestData.Test2Base);

            var n = test2.Name;

            return new TestData.Test3(test2);
        });

        var container = containerBuilder.build();
        var actual = container.resolve<TestData.Test1Base>(TestData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "Test 3 test 2");

        test.done();
    }
}

