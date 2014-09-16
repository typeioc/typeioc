'use strict';
var scaffold = require('./../scaffold');
var TestData = require('../data/test-data');
var TestDataSecond = require('../data/test-data2');
var Config = scaffold.Config;

(function (Level8) {
    var containerBuilder;

    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level8.setUp = setUp;

    function configParameterlessResolution(test) {
        var config = Config.parameterlessResolution();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve(TestData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }
    Level8.configParameterlessResolution = configParameterlessResolution;

    function configFactoryResolution(test) {
        var config = Config.factoryResolution();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve(TestData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }
    Level8.configFactoryResolution = configFactoryResolution;

    function dependenciesResolution(test) {
        var config = Config.dependenciesResolution();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve(TestData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "Test 3 test 2");

        test.done();
    }
    Level8.dependenciesResolution = dependenciesResolution;

    function customParametersResolution(test) {
        var config = Config.customParametersResolution();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var test1 = container.resolve(TestData.Test1Base, "test 4");

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 4");

        test.done();
    }
    Level8.customParametersResolution = customParametersResolution;

    function namedServicesResolution(test) {
        var config = Config.namedServicesResolution();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual1 = container.resolveNamed(TestData.Test1Base, "A");
        var actual2 = container.resolveNamed(TestData.Test1Base, "B");
        var actual3 = container.resolve(TestData.Test1Base);

        test.notEqual(actual1, null);
        test.notEqual(actual2, null);
        test.notEqual(actual3, null);
        test.strictEqual(actual1.Name, "a");
        test.strictEqual(actual2.Name, "b");
        test.strictEqual(actual3.Name, "null");

        test.done();
    }
    Level8.namedServicesResolution = namedServicesResolution;

    function noScopingReuse(test) {
        var config = Config.noScopingReuse();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var test1 = container.resolve(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve(TestData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");

        test.done();
    }
    Level8.noScopingReuse = noScopingReuse;

    function containerOwnedInstancesAreDisposed(test) {
        var config = Config.containerOwnedInstancesAreDisposed();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();

        var test1 = container.resolve(TestData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }
    Level8.containerOwnedInstancesAreDisposed = containerOwnedInstancesAreDisposed;

    function initializeIsCalledWhenInstanceIsCreated(test) {
        var className = "item";

        var config = Config.initializeIsCalledWhenInstanceIsCreated(className);
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();

        var i1 = container.resolve(TestData.Initializable);
        var i2 = container.resolve(TestData.Initializable);

        test.deepEqual(i1, i2);
        test.deepEqual(i1.name, i2.name);
        test.deepEqual(i1.name, className);

        test.done();
    }
    Level8.initializeIsCalledWhenInstanceIsCreated = initializeIsCalledWhenInstanceIsCreated;

    function registerModuleBasicInheritance(test) {
        var config = Config.registerModuleBasicInheritance();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();

        var t1 = container.resolve(TestDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class");

        test.done();
    }
    Level8.registerModuleBasicInheritance = registerModuleBasicInheritance;

    function registerModuleConstructorWithParams(test) {
        var config = Config.registerModuleConstructorWithParams();

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();

        var t1 = container.resolve(TestDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class77Test");

        test.done();
    }
    Level8.registerModuleConstructorWithParams = registerModuleConstructorWithParams;

    function registerModuleConstructorWithDependencies(test) {
        var config = Config.registerModuleConstructorWithDependencies();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();

        var t1 = container.resolve(TestDataSecond.ServiceModule3.TestBaseClass1);

        test.equal(t1.name(), "Module6 - Class 1 - Concrete class77Test");

        test.done();
    }
    Level8.registerModuleConstructorWithDependencies = registerModuleConstructorWithDependencies;

    function registerComponentsWithinModule(test) {
        var config = Config.registerComponentsWithinModule();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve(TestData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }
    Level8.registerComponentsWithinModule = registerComponentsWithinModule;
})(exports.Level8 || (exports.Level8 = {}));
var Level8 = exports.Level8;
//# sourceMappingURL=level8.js.map
