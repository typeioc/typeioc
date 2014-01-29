
'use strict';

import testData = require('./../test-data');
import testDataSecond = require('./../test-data2');
import scaffold = require('./../scaffold');


export module Level8 {

    var containerBuilder : Typeioc.IContainerBuilder;

    export function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }

    export function configParameterlessResolution(test) {

        var config : Typeioc.IConfig = {
            components : [
                {
                    service : {
                        instanceModule : testData,
                        name : 'Test1Base'
                    },
                    resolver : {
                        instanceModule : testData,
                        name : 'Test1'
                    }
                }
            ]
        };

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }

    export function configFactoryResolution(test) {

        var config : Typeioc.IConfig = {
            components : [
                {
                    service : {
                        instanceModule : testData,
                        name : 'Test1Base'
                    },
                    factory : () => new testData.Test1()
                }
            ]
        };

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }

    export function dependenciesResolution(test) {

        var config : Typeioc.IConfig = {
            components : [
                {
                    service : {
                        instanceModule : testData,
                        name : 'Test2Base'
                    },
                    factory : () => new testData.Test2()
                },
                {
                    service : {
                        instanceModule : testData,
                        name : 'Test1Base'
                    },
                    resolver : {
                        instanceModule : testData,
                        name : 'Test3'
                    },
                    parameters : [
                        {
                            isDependency : true,
                            location : {
                                instanceModule : testData,
                                name : 'Test2Base'
                            }
                        }
                    ]
                }
            ]
        };

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "Test 3 test 2");

        test.done();
    }

    export function customParametersResolution(test) {

        var config : Typeioc.IConfig = {
            components : [
                {
                    service : {
                        instanceModule : testData,
                        name : 'Test1Base'
                    },
                    factory : (c, name) => new testData.Test4(name)
                }
            ]
        };

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base, "test 4");

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 4");

        test.done();
    }

    export function namedServicesResolution(test) {

        var config : Typeioc.IConfig = {
            components : [
                {
                    service : {
                        instanceModule : testData,
                        name : 'Test1Base'
                    },
                    factory : () => new testData.Test4("null")
                },
                {
                    service : {
                        instanceModule : testData,
                        name : 'Test1Base'
                    },
                    factory : () => new testData.Test4("a"),
                    named : "A"
                },
                {
                    service : {
                        instanceModule : testData,
                        name : 'Test1Base'
                    },
                    factory : () => new testData.Test4("b"),
                    named : "B"
                }
            ]
        };

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

        var config : Typeioc.IConfig = {
            components : [
                {
                    service : {
                        instanceModule : testData,
                        name : 'Test1Base'
                    },
                    factory : () => new testData.Test4("test 4"),
                    within : Typeioc.Types.Scope.None
                }
            ]
        };

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

        var config : Typeioc.IConfig = {
            components : [
                {
                    service : {
                        instanceModule : testData,
                        name : 'Test1Base'
                    },
                    factory : () => new testData.Test5(),
                    disposer : (item : testData.Test5) => { item.Dispose() },
                    within : Typeioc.Types.Scope.None,
                    ownedBy : Typeioc.Types.Owner.Container
                }
            ]
        };

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

        var config : Typeioc.IConfig = {
            components : [
                {
                    service : {
                        instanceModule : testData,
                        name : 'Initializable'
                    },
                    factory : () => new testData.Initializable(),
                    initializeBy : (c, item : testData.Initializable) => { item.initialize(className); }
                }
            ]
        };

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

        var config : Typeioc.IConfig = {
            modules : [
                {
                    serviceModule : testDataSecond.ServiceModule1,
                    resolverModule : testDataSecond.SubstituteModule1
                }
            ]
        };

        containerBuilder.registerConfig(config);
        var container = containerBuilder.build();

        var t1 = container.resolve<testDataSecond.ServiceModule1.TestBaseClass>(testDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class");

        test.done();
    }

    export function registerModuleConstructorWithParams(test) {

        var config : Typeioc.IConfig = {
            modules : [
                {
                    serviceModule : testDataSecond.ServiceModule1,
                    resolverModule : testDataSecond.SubstituteModule3,
                    forInstances : [
                        {
                            resolver : {
                                instanceModule : testDataSecond.SubstituteModule3,
                                name : "ConcreteTestClass"
                            },
                            parameters : [
                                {
                                    isDependency:false,
                                    instance : 77
                                },
                                {
                                    isDependency:false,
                                    instance : "Test"
                                }
                            ]
                        }
                    ]
                }
            ]
        };


        containerBuilder.registerConfig(config);
        var container = containerBuilder.build();

        var t1 = container.resolve<testDataSecond.ServiceModule1.TestBaseClass>(testDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class77Test");

        test.done();
    }

    export function registerModuleConstructorWithDependencies(test) {

        var config : Typeioc.IConfig = {
            modules : [
                {
                    serviceModule : testDataSecond.ServiceModule1,
                    resolverModule : testDataSecond.SubstituteModule3,
                    forInstances : [
                        {
                            resolver : {
                                name : "ConcreteTestClass"
                            },
                            parameters : [
                                {
                                    isDependency:false,
                                    instance : 77
                                },
                                {
                                    isDependency:false,
                                    instance : "Test"
                                }
                            ]
                        }
                    ]
                },
                {
                    serviceModule : testDataSecond.ServiceModule3,
                    resolverModule : testDataSecond.SubstituteModule6,
                    forInstances : [
                        {
                            resolver : {
                                name : "ConcreteClass1"
                            },
                            parameters : [
                                {
                                    isDependency:true,
                                    location :  {
                                        instanceModule : testDataSecond.ServiceModule1,
                                        name : 'TestBaseClass'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        containerBuilder.registerConfig(config);
        var container = containerBuilder.build();

        var t1 = container.resolve(testDataSecond.ServiceModule3.TestBaseClass1);

        test.equal(t1.name(), "Module6 - Class 1 - Concrete class77Test");

        test.done();
    }

    export function registerComponentsWithinModel(test) {

        var config : Typeioc.IConfig = {

            modules : [
                {
                    forModule : false,
                    serviceModule : testData,
                    resolverModule : testData,

                    components : [
                        {
                            service : {
                                name : 'Test1Base'
                            },
                            resolver : {
                                name : 'Test1'
                            }
                        }
                    ]
                }

            ]
        };

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }
}