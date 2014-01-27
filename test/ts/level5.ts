'use strict';

import testData = require('./../test-data');
import scaffold = require('./../scaffold');


export module Level5 {

    export function containerOwnedInstancesAreDisposed(test) {

        var containerBuilder = scaffold.createBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test5())
            .dispose((item : testData.Test5)  => { item.Dispose() })
            .within(Typeioc.Types.Scope.None)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    };

    export function containerOwnedAndContainerReusedInstancesAreDisposed(test) {

        var containerBuilder = scaffold.createBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test5())
            .dispose((item : testData.Test5)  => { item.Dispose() })
            .within(Typeioc.Types.Scope.Container)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    };


    export function containerOwnedAndHierarchyReusedInstancesAreDisposed(test) {

        var containerBuilder = scaffold.createBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test5())
            .dispose((item : testData.Test5)  => { item.Dispose() })
            .within(Typeioc.Types.Scope.Hierarchy)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    };


    export function childContainerInstanceWithParentRegistrationIsNotDisposed(test) {

        var containerBuilder = scaffold.createBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test5())
            .within(Typeioc.Types.Scope.Hierarchy)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);

        child.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, false);

        test.done();
    };

    export function disposingParentContainerDisposesChildContainerInstances(test) {

        var containerBuilder = scaffold.createBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test5())
            .dispose((item : testData.Test5)  => { item.Dispose() })
            .within(Typeioc.Types.Scope.None)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }

    export function disposingContainerDoesNotDisposeExternalOwnedInstances(test) {

        var containerBuilder = scaffold.createBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test5()).
            within(Typeioc.Types.Scope.Hierarchy).
            ownedBy(Typeioc.Types.Owner.Externals);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, false);

        test.done();
    }


    export function serviceEntryProperlyCloned(test) {

        var initializer = (c, item) => {};

        var serviceEntry = new scaffold.RegistrationBase.RegistrationBase(() => new testData.Test5());
        serviceEntry.initializer = initializer;
        serviceEntry.scope = Typeioc.Types.Scope.Hierarchy;


        var containerBuilder = scaffold.createBuilder();
        var container = containerBuilder.build();

        var actual = serviceEntry.cloneFor(container);

        test.strictEqual(actual.factory, serviceEntry.factory);
        test.strictEqual(actual.scope, serviceEntry.scope);
        test.strictEqual(actual.scope, Typeioc.Types.Scope.Hierarchy);
        test.strictEqual(actual.container, container);
        test.strictEqual(actual.initializer, initializer);

        test.done();
    };

    export function initializeIsCalledWhenInstanceIsCreated(test) {

        var className = "item";

        var initializer : Typeioc.IInitializer<testData.Initializable> = (c, item) => {
            item.initialize(className);
        };

        var containerBuilder = scaffold.createBuilder();
        containerBuilder.register<testData.Initializable>(testData.Initializable)
            .as(() => new testData.Initializable2()).
            initializeBy(initializer);


        var container = containerBuilder.build();

        var i1 = container.resolve<testData.Initializable>(testData.Initializable);
        var i2 = container.resolve<testData.Initializable>(testData.Initializable);

        test.deepEqual(i1, i2);
        test.deepEqual(i1.name, i2.name);
        test.deepEqual(i1.name, className);

        test.done();
    }

    export function initializeAndResolveDependencies(test) {

        var className = "item";

        var initializer = (c : Typeioc.IContainer, item : testData.Initializable) => {
            item.initialize(className);
            item.test6 = c.resolve<testData.Test6>(testData.Test6);
        };

        var containerBuilder = scaffold.createBuilder();
        containerBuilder.register(testData.Test6).as((c) => new testData.Test6());
        containerBuilder.register(testData.Initializable).as((c) => new testData.Initializable()).
            initializeBy(initializer);

        var container = containerBuilder.build();

        var i1 = container.resolve<testData.Initializable>(testData.Initializable);

        test.notEqual(i1, null);
        test.notEqual(i1, undefined);
        test.deepEqual(i1.name, className);
        test.notEqual(i1.test6, null);

        test.done();
    }

}