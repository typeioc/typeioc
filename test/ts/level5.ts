'use strict';

import scaffold = require('./../scaffold');
import TestData = require('../data/test-data');


export module Level5 {

    var containerBuilder : Typeioc.IContainerBuilder;

    export function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }

    export function containerOwnedInstancesAreDisposed(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .dispose((item : TestData.Test5)  => { item.Dispose() })
            .within(Typeioc.Types.Scope.None)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve<TestData.Test5>(TestData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }

    export function containerOwnedInstancesAreDisposedDefaultSetting(test) {

        containerBuilder.defaults.owner = scaffold.Types.Owner.Container;

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .dispose((item : TestData.Test5) => item.Dispose());

        var container = containerBuilder.build();

        var test1 = container.resolve<TestData.Test5>(TestData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }

    export function containerOwnedAndContainerReusedInstancesAreDisposed(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .dispose((item : TestData.Test5)  => { item.Dispose() })
            .within(Typeioc.Types.Scope.Container)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve<TestData.Test5>(TestData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }

    export function containerOwnedAndHierarchyReusedInstancesAreDisposed(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .dispose((item : TestData.Test5)  => { item.Dispose() })
            .within(Typeioc.Types.Scope.Hierarchy)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve<TestData.Test5>(TestData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }

    export function childContainerInstanceWithParentRegistrationIsNotDisposed(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .within(Typeioc.Types.Scope.Hierarchy)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<TestData.Test5>(TestData.Test1Base);

        child.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, false);

        test.done();
    }

    export function disposingParentContainerDisposesChildContainerInstances(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .dispose((item : TestData.Test5)  => { item.Dispose() })
            .within(Typeioc.Types.Scope.None)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<TestData.Test5>(TestData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }

    export function disposingContainerDoesNotDisposeExternalOwnedInstances(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base).as(() => new TestData.Test5()).
            within(Typeioc.Types.Scope.Hierarchy).
            ownedBy(Typeioc.Types.Owner.Externals);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<TestData.Test5>(TestData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, false);

        test.done();
    }

    export function initializeIsCalledWhenInstanceIsCreated(test) {

        var className = "item";

        containerBuilder.register<TestData.Initializable>(TestData.Initializable)
            .as(() => new TestData.Initializable2()).
            initializeBy((c, item) => item.initialize(className));

        var container = containerBuilder.build();

        var i1 = container.resolve<TestData.Initializable>(TestData.Initializable);
        var i2 = container.resolve<TestData.Initializable>(TestData.Initializable);

        test.deepEqual(i1, i2);
        test.deepEqual(i1.name, i2.name);
        test.deepEqual(i1.name, className);

        test.done();
    }

    export function initializeAndResolveDependencies(test) {

        var className = "item";

        var initializer = (c : Typeioc.IContainer, item : TestData.Initializable) => {
            item.initialize(className);
            item.test6 = c.resolve<TestData.Test6>(TestData.Test6);
        };

        containerBuilder.register(TestData.Test6).as((c) => new TestData.Test6());
        containerBuilder.register(TestData.Initializable).as((c) => new TestData.Initializable()).
            initializeBy(initializer);

        var container = containerBuilder.build();

        var i1 = container.resolve<TestData.Initializable>(TestData.Initializable);

        test.notEqual(i1, null);
        test.notEqual(i1, undefined);
        test.deepEqual(i1.name, className);
        test.notEqual(i1.test6, null);

        test.done();
    }

    export function instancesFromDifferentContainersDisposedIndependently(test) {

        var secondContainerBuilder = scaffold.createBuilder();

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .dispose((item : TestData.Test5)  => item.Dispose())
            .within(Typeioc.Types.Scope.None)
            .ownedBy(Typeioc.Types.Owner.Container);


        secondContainerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test5())
            .dispose((item : TestData.Test5)  => { item.Dispose() })
            .within(Typeioc.Types.Scope.None)
            .ownedBy(Typeioc.Types.Owner.Container);

        var container = containerBuilder.build();
        var secondContainer = secondContainerBuilder.build();


        var test1 = container.resolve<TestData.Test1Base>(TestData.Test1Base);
        var test2 = secondContainer.resolve<TestData.Test1Base>(TestData.Test1Base);

        test.strictEqual(test1.Disposed, false);
        test.strictEqual(test2.Disposed, false);

        container.dispose();

        test.strictEqual(test1.Disposed, true);
        test.strictEqual(test2.Disposed, false);

        secondContainer.dispose();

        test.strictEqual(test1.Disposed, true);
        test.strictEqual(test2.Disposed, true);


        test.done();
    }
}