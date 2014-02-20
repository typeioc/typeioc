
'use strict';

import scaffold = require('./../scaffold');
import testData = scaffold.TestModule;
import testDataSecond = scaffold.TestModule2;
var Config = scaffold.Config;


export module Level8 {

    var containerBuilder : Typeioc.IContainerBuilder;

    export function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }

    export function configParameterlessResolution(test) {

        var config = Config.parameterlessResolution();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }

    export function configFactoryResolution(test) {

        var config = Config.factoryResolution();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }

    export function dependenciesResolution(test) {

        var config = Config.dependenciesResolution();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "Test 3 test 2");

        test.done();
    }

    export function customParametersResolution(test) {

        var config = Config.customParametersResolution();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base, "test 4");

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 4");

        test.done();
    }

    export function namedServicesResolution(test) {

        var config = Config.namedServicesResolution();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual1 = container.resolveNamed<testData.Test1Base>(testData.Test1Base, "A");
        var actual2 = container.resolveNamed<testData.Test1Base>(testData.Test1Base, "B");
        var actual3 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual1, null);
        test.notEqual(actual2, null);
        test.notEqual(actual3, null);
        test.strictEqual(actual1.Name, "a");
        test.strictEqual(actual2.Name, "b");
        test.strictEqual(actual3.Name, "null");

        test.done();
    }

    export function noScopingReuse(test) {

        var config = Config.noScopingReuse();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var test1 = container.resolve(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");

        test.done();
    }

    export function containerOwnedInstancesAreDisposed(test) {

        var config = Config.containerOwnedInstancesAreDisposed();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();

        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }

    export function initializeIsCalledWhenInstanceIsCreated(test) {

        var className = "item";

        var config = Config.initializeIsCalledWhenInstanceIsCreated(className);
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();

        var i1 = container.resolve<testData.Initializable>(testData.Initializable);
        var i2 = container.resolve<testData.Initializable>(testData.Initializable);

        test.deepEqual(i1, i2);
        test.deepEqual(i1.name, i2.name);
        test.deepEqual(i1.name, className);

        test.done();
    }

    export function registerModuleBasicInheritance(test) {

        var config = Config.registerModuleBasicInheritance();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();

        var t1 = container.resolve<testDataSecond.ServiceModule1.TestBaseClass>(testDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class");

        test.done();
    }

    export function registerModuleConstructorWithParams(test) {

        var config = Config.registerModuleConstructorWithParams();

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();

        var t1 = container.resolve<testDataSecond.ServiceModule1.TestBaseClass>(testDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class77Test");

        test.done();
    }

    export function registerModuleConstructorWithDependencies(test) {

        var config = Config.registerModuleConstructorWithDependencies();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();

        var t1 = container.resolve(testDataSecond.ServiceModule3.TestBaseClass1);

        test.equal(t1.name(), "Module6 - Class 1 - Concrete class77Test");

        test.done();
    }

    export function registerComponentsWithinModel(test) {

        var config = Config.registerComponentsWithinModel();
        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }
}