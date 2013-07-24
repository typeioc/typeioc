var typeioc = require('../lib/typeioc');
;
var RegistrationBaseModule = require('../lib/registration/registrationBase');
var RegoDefinitionsModule = require('../lib/registration/definitions');
var testData = require("./test-data");
;

(function (Level5) {
    function containerOwnedInstancesAreDisposed(test) {
        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).within(typeioc.Constants.Scope.None).ownedBy(typeioc.Constants.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }
    Level5.containerOwnedInstancesAreDisposed = containerOwnedInstancesAreDisposed;
    ;

    function containerOwnedAndContainerReusedInstancesAreDisposed(test) {
        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).within(typeioc.Constants.Scope.Container).ownedBy(typeioc.Constants.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }
    Level5.containerOwnedAndContainerReusedInstancesAreDisposed = containerOwnedAndContainerReusedInstancesAreDisposed;
    ;

    function containerOwnedAndHierarchyReusedInstancesAreDisposed(test) {
        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).within(typeioc.Constants.Scope.Hierarchy).ownedBy(typeioc.Constants.Owner.Container);

        var container = containerBuilder.build();

        var test1 = container.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }
    Level5.containerOwnedAndHierarchyReusedInstancesAreDisposed = containerOwnedAndHierarchyReusedInstancesAreDisposed;
    ;

    function childContainerInstanceWithParentRegistrationIsNotDisposed(test) {
        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).within(typeioc.Constants.Scope.Hierarchy).ownedBy(typeioc.Constants.Owner.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve(testData.Test1Base);

        child.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, false);

        test.done();
    }
    Level5.childContainerInstanceWithParentRegistrationIsNotDisposed = childContainerInstanceWithParentRegistrationIsNotDisposed;
    ;

    function disposingParentContainerDisposesChildContainerInstances(test) {
        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).within(typeioc.Constants.Scope.None).ownedBy(typeioc.Constants.Owner.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }
    Level5.disposingParentContainerDisposesChildContainerInstances = disposingParentContainerDisposesChildContainerInstances;

    function disposingContainerDoesNotDisposeExternalOwnedInstances(test) {
        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test5();
        }).within(typeioc.Constants.Scope.Hierarchy).ownedBy(typeioc.Constants.Owner.Externals);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, false);

        test.done();
    }
    Level5.disposingContainerDoesNotDisposeExternalOwnedInstances = disposingContainerDoesNotDisposeExternalOwnedInstances;

    function serviceEntryProperlyCloned(test) {
        var initializer = function (c, item) {
        };

        var serviceEntry = new RegistrationBaseModule.RegistrationBase(function () {
            return new testData.Test5();
        });
        serviceEntry.initializer = initializer;
        serviceEntry.scope = RegoDefinitionsModule.Scope.Hierarchy;

        var containerBuilder = new typeioc.ContainerBuilder();
        var container = containerBuilder.build();

        var actual = serviceEntry.cloneFor(container);

        test.strictEqual(actual.factory, serviceEntry.factory);
        test.strictEqual(actual.scope, serviceEntry.scope);
        test.strictEqual(actual.scope, RegoDefinitionsModule.Scope.Hierarchy);
        test.strictEqual(actual.container, container);
        test.strictEqual(actual.initializer, initializer);

        test.done();
    }
    Level5.serviceEntryProperlyCloned = serviceEntryProperlyCloned;
    ;

    function initializeIsCalledWhenInstanceIsCreated(test) {
        var className = "item";

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register(testData.Initializable).as(function (c) {
            return new testData.Initializable2();
        }).initializeBy(function (c, item) {
            item.initialize(className);
        });

        var container = containerBuilder.build();

        var i1 = container.resolve(testData.Initializable);
        var i2 = container.resolve(testData.Initializable);

        test.deepEqual(i1, i2);
        test.deepEqual(i1.name, i2.name);
        test.deepEqual(i1.name, className);

        test.done();
    }
    Level5.initializeIsCalledWhenInstanceIsCreated = initializeIsCalledWhenInstanceIsCreated;

    function initializeAndResolveDependencies(test) {
        var className = "item";

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register(testData.Test6).as(function (c) {
            return new testData.Test6();
        });
        containerBuilder.register(testData.Initializable).as(function (c) {
            return new testData.Initializable();
        }).initializeBy(function (c, item) {
            item.initialize(className);
            item.test6 = c.resolve(testData.Test6);
        });

        var container = containerBuilder.build();

        var i1 = container.resolve(testData.Initializable);

        test.notEqual(i1, null);
        test.notEqual(i1, undefined);
        test.deepEqual(i1.name, className);
        test.notEqual(i1.test6, null);

        test.done();
    }
    Level5.initializeAndResolveDependencies = initializeAndResolveDependencies;
})(exports.Level5 || (exports.Level5 = {}));
var Level5 = exports.Level5;

//@ sourceMappingURL=level5.js.map
