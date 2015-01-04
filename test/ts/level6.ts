'use strict';

import scaffold = require('./../scaffold');
import TestData = require('../data/test-data');


export module Level6 {

    var containerBuilder : Typeioc.IContainerBuilder;

    export function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }

    export function fluentApiInitializeByDisposedNamedWithinOwnedBy(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).
            as(() => new TestData.Test5()).
            initializeBy((c, item) => {}).
            dispose((item : TestData.Test5) => item.Dispose()).
            named("Some Name").
            within(Typeioc.Types.Scope.Hierarchy).
            ownedBy(Typeioc.Types.Owner.Container);

        test.done();
    }

    export function fluentApiAs(test) {

        var registration = containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5());

        test.equal(registration['as'], undefined);
        test.notEqual(registration['initializeBy'], undefined);
        test.notEqual(registration['initializeBy'], null);
        test.notEqual(registration['dispose'], undefined);
        test.notEqual(registration['dispose'], null);
        test.notEqual(registration['named'], undefined);
        test.notEqual(registration['named'], null);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);

        test.done();
    }

    export function fluentApiInitializeBy(test) {

        var registration = containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .initializeBy((c, item) => {});

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.notEqual(registration['dispose'], undefined);
        test.notEqual(registration['dispose'], null);
        test.notEqual(registration['named'], undefined);
        test.notEqual(registration['named'], null);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);

        test.done();
    }

    export function fluentApiDispose(test) {

        var registration = containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .dispose((item : TestData.Test5) => item.Dispose());

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['dispose'], undefined);
        test.notEqual(registration['named'], undefined);
        test.notEqual(registration['named'], null);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);

        test.done();
    }

    export function fluentApiNamed(test) {

        var registration = containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .named("Some Name");

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['dispose'], undefined);
        test.equal(registration['named'], undefined);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);

        test.done();
    }

    export function fluentApiWithin(test) {

        var registration = containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .within(Typeioc.Types.Scope.Hierarchy);

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['dispose'], undefined);
        test.equal(registration['named'], undefined);
        test.equal(registration['within'], undefined);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);

        test.done();
    }

    export function factoryNotDefinedError(test) {

        var registration = containerBuilder.register<TestData.Test1Base>(TestData.Test1Base);

        var delegate = () => containerBuilder.build();

        test.throws(delegate, function(err) {
            return (err instanceof scaffold.Exceptions.ArgumentNullError) &&
                    /Factory is not defined/.test(err.message) &&
                    err.data === TestData.Test1Base;
        });

        test.done();
    }
}