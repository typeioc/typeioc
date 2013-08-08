import typeioc = require('../lib/typeioc');;
import RegistrationBaseModule = require('../lib/registration/registrationBase');
import testData = require('test-data');;

export module Level5 {

    export function containerOwnedInstancesAreDisposed(test) {

        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test5()).
            within(typeioc.Constants.Scope.None).
            ownedBy(typeioc.Constants.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    };


    export function containerOwnedAndContainerReusedInstancesAreDisposed(test) {

        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test5()).
            within(typeioc.Constants.Scope.Container).
            ownedBy(typeioc.Constants.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    };


    export function containerOwnedAndHierarchyReusedInstancesAreDisposed(test) {

        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register<testData.Test1Base>(testData.Test1Base).as(() => new testData.Test5()).
            within(typeioc.Constants.Scope.Hierarchy).
            ownedBy(typeioc.Constants.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    };


    export function childContainerInstanceWithParentRegistrationIsNotDisposed(test) {

        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register(testData.Test1Base).as(() => new testData.Test5()).
            within(typeioc.Constants.Scope.Hierarchy).
            ownedBy(typeioc.Constants.Owner.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);

        child.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, false);

        test.done();
    };

    export function disposingParentContainerDisposesChildContainerInstances(test) {

        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register(testData.Test1Base).as(() => new testData.Test5()).
            within(typeioc.Constants.Scope.None).
            ownedBy(typeioc.Constants.Owner.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }

    export function disposingContainerDoesNotDisposeExternalOwnedInstances(test) {

        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register(testData.Test1Base).as(() => new testData.Test5()).
            within(typeioc.Constants.Scope.Hierarchy).
            ownedBy(typeioc.Constants.Owner.Externals);

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

        var serviceEntry = new RegistrationBaseModule.RegistrationBase(() => new testData.Test5());
        serviceEntry.initializer = initializer;
        serviceEntry.scope = typeioc.Constants.Scope.Hierarchy;


        var containerBuilder = new typeioc.ContainerBuilder();
        var container = containerBuilder.build();

        var actual = serviceEntry.cloneFor(container);

        test.strictEqual(actual.factory, serviceEntry.factory);
        test.strictEqual(actual.scope, serviceEntry.scope);
        test.strictEqual(actual.scope, typeioc.Constants.Scope.Hierarchy);
        test.strictEqual(actual.container, container);
        test.strictEqual(actual.initializer, initializer);

        test.done();
    };

    export function initializeIsCalledWhenInstanceIsCreated(test) {

        var className = "item";

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register(testData.Initializable).as((c) => new testData.Initializable2()).
            initializeBy((c, item : testData.Initializable2) => { item.initialize(className); })

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

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register(testData.Test6).as((c) => new testData.Test6());
        containerBuilder.register(testData.Initializable).as((c) => new testData.Initializable()).
            initializeBy((c : typeioc.IContainer, item : testData.Initializable) => {
                item.initialize(className);
                item.test6 = c.resolve<testData.Test6>(testData.Test6);
            });

        var container = containerBuilder.build();

        var i1 = container.resolve<testData.Initializable>(testData.Initializable);

        test.notEqual(i1, null);
        test.notEqual(i1, undefined);
        test.deepEqual(i1.name, className);
        test.notEqual(i1.test6, null);

        test.done();
    }

}