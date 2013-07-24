import exceptions = require('../lib/exceptions');;
import typeioc = require('../lib/typeioc');;
import testData = require('test-data');;

export module Level6 {

    export function fluentApiInitializeByNamedWithinOwnedBy(test) {

        var builder = new typeioc.ContainerBuilder();
        builder.register<testData.Test1Base>(testData.Test1Base).
            as(() => new testData.Test5()).
            initializeBy((c, item) => {}).
            named("Some Name").
            within(typeioc.Constants.Scope.Hierarchy).
            ownedBy(typeioc.Constants.Owner.Container);

        test.done();
    };

    export function fluentApiAs(test) {

        var builder = new typeioc.ContainerBuilder();
        var registration = builder.register<testData.Test1Base>(testData.Test1Base).
            as(() => new testData.Test5());

        test.equal(registration['as'], undefined);
        test.notEqual(registration['initializeBy'], undefined);
        test.notEqual(registration['initializeBy'], null);
        test.notEqual(registration['named'], undefined);
        test.notEqual(registration['named'], null);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);

        test.done();
    };

    export function fluentApiInitializeBy(test) {

        var builder = new typeioc.ContainerBuilder();
        var registration = builder.register<testData.Test1Base>(testData.Test1Base).
            as(() => new testData.Test5()).
            initializeBy((c, item) => {});

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.notEqual(registration['named'], undefined);
        test.notEqual(registration['named'], null);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);

        test.done();
    };

    export function fluentApiNamed(test) {

        var builder = new typeioc.ContainerBuilder();
        var registration = builder.register<testData.Test1Base>(testData.Test1Base).
            as(() => new testData.Test5()).
            named("Some Name");

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['named'], undefined);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);
        test.notEqual(registration['within'], undefined);
        test.notEqual(registration['within'], null);

        test.done();
    };


    export function fluentApiWithin(test) {

        var builder = new typeioc.ContainerBuilder();
        var registration = builder.register<testData.Test1Base>(testData.Test1Base).
            as(() => new testData.Test5()).
            within(typeioc.Constants.Scope.Hierarchy);

        test.equal(registration['as'], undefined);
        test.equal(registration['initializeBy'], undefined);
        test.equal(registration['named'], undefined);
        test.equal(registration['within'], undefined);
        test.notEqual(registration['ownedBy'], undefined);
        test.notEqual(registration['ownedBy'], null);

        test.done();
    };

    export function factoryNotDefinedError(test) {

        var builder = new typeioc.ContainerBuilder();
        var registration = builder.register<testData.Test1Base>(testData.Test1Base);

        var delegate = () => builder.build();

        test.throws(delegate, function(err) {
            return (err instanceof exceptions.ArgumentNullError) &&
                /Factory is not defined for: Test1Base/.test(err.message);
        });

        test.done();
    };


}