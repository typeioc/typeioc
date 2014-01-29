'use strict';
var testData = require('./../test-data');
var testDataSecond = require('./../test-data2');
var scaffold = require('./../scaffold');

(function (Level8) {
    var containerBuilder;

    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level8.setUp = setUp;

    function configParameterlessResolution(test) {
        var config = {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    resolver: {
                        instanceModule: testData,
                        name: 'Test1'
                    }
                }
            ]
        };

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }
    Level8.configParameterlessResolution = configParameterlessResolution;

    function configFactoryResolution(test) {
        var config = {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () {
                        return new testData.Test1();
                    }
                }
            ]
        };

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }
    Level8.configFactoryResolution = configFactoryResolution;

    function dependenciesResolution(test) {
        var config = {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test2Base'
                    },
                    factory: function () {
                        return new testData.Test2();
                    }
                },
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    resolver: {
                        instanceModule: testData,
                        name: 'Test3'
                    },
                    parameters: [
                        {
                            isDependency: true,
                            location: {
                                instanceModule: testData,
                                name: 'Test2Base'
                            }
                        }
                    ]
                }
            ]
        };

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "Test 3 test 2");

        test.done();
    }
    Level8.dependenciesResolution = dependenciesResolution;

    function customParametersResolution(test) {
        var config = {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function (c, name) {
                        return new testData.Test4(name);
                    }
                }
            ]
        };

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var test1 = container.resolve(testData.Test1Base, "test 4");

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 4");

        test.done();
    }
    Level8.customParametersResolution = customParametersResolution;

    function namedServicesResolution(test) {
        var config = {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () {
                        return new testData.Test4("null");
                    }
                },
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () {
                        return new testData.Test4("a");
                    },
                    named: "A"
                },
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () {
                        return new testData.Test4("b");
                    },
                    named: "B"
                }
            ]
        };

        containerBuilder.registerConfig(config);
        var container = containerBuilder.build();
        var actual1 = container.resolveNamed(testData.Test1Base, "A");
        var actual2 = container.resolveNamed(testData.Test1Base, "B");
        var actual3 = container.resolve(testData.Test1Base);

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
        var config = {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () {
                        return new testData.Test4("test 4");
                    },
                    within: 1 /* None */
                }
            ]
        };

        containerBuilder.registerConfig(config);
        var container = containerBuilder.build();
        var test1 = container.resolve(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");

        test.done();
    }
    Level8.noScopingReuse = noScopingReuse;

    function containerOwnedInstancesAreDisposed(test) {
        var config = {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () {
                        return new testData.Test5();
                    },
                    disposer: function (item) {
                        item.Dispose();
                    },
                    within: 1 /* None */,
                    ownedBy: 1 /* Container */
                }
            ]
        };

        containerBuilder.registerConfig(config);
        var container = containerBuilder.build();

        var test1 = container.resolve(testData.Test1Base);

        container.dispose();

        test.notEqual(test1, null);
        test.strictEqual(test1.Disposed, true);

        test.done();
    }
    Level8.containerOwnedInstancesAreDisposed = containerOwnedInstancesAreDisposed;

    function initializeIsCalledWhenInstanceIsCreated(test) {
        var className = "item";

        var config = {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Initializable'
                    },
                    factory: function () {
                        return new testData.Initializable();
                    },
                    initializeBy: function (c, item) {
                        item.initialize(className);
                    }
                }
            ]
        };

        containerBuilder.registerConfig(config);
        var container = containerBuilder.build();

        var i1 = container.resolve(testData.Initializable);
        var i2 = container.resolve(testData.Initializable);

        test.deepEqual(i1, i2);
        test.deepEqual(i1.name, i2.name);
        test.deepEqual(i1.name, className);

        test.done();
    }
    Level8.initializeIsCalledWhenInstanceIsCreated = initializeIsCalledWhenInstanceIsCreated;

    function registerModuleBasicInheritance(test) {
        var config = {
            modules: [
                {
                    serviceModule: testDataSecond.ServiceModule1,
                    resolverModule: testDataSecond.SubstituteModule1
                }
            ]
        };

        containerBuilder.registerConfig(config);
        var container = containerBuilder.build();

        var t1 = container.resolve(testDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class");

        test.done();
    }
    Level8.registerModuleBasicInheritance = registerModuleBasicInheritance;

    function registerModuleConstructorWithParams(test) {
        var config = {
            modules: [
                {
                    serviceModule: testDataSecond.ServiceModule1,
                    resolverModule: testDataSecond.SubstituteModule3,
                    forInstances: [
                        {
                            resolver: {
                                instanceModule: testDataSecond.SubstituteModule3,
                                name: "ConcreteTestClass"
                            },
                            parameters: [
                                {
                                    isDependency: false,
                                    instance: 77
                                },
                                {
                                    isDependency: false,
                                    instance: "Test"
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        containerBuilder.registerConfig(config);
        var container = containerBuilder.build();

        var t1 = container.resolve(testDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class77Test");

        test.done();
    }
    Level8.registerModuleConstructorWithParams = registerModuleConstructorWithParams;

    function registerModuleConstructorWithDependencies(test) {
        var config = {
            modules: [
                {
                    serviceModule: testDataSecond.ServiceModule1,
                    resolverModule: testDataSecond.SubstituteModule3,
                    forInstances: [
                        {
                            resolver: {
                                name: "ConcreteTestClass"
                            },
                            parameters: [
                                {
                                    isDependency: false,
                                    instance: 77
                                },
                                {
                                    isDependency: false,
                                    instance: "Test"
                                }
                            ]
                        }
                    ]
                },
                {
                    serviceModule: testDataSecond.ServiceModule3,
                    resolverModule: testDataSecond.SubstituteModule6,
                    forInstances: [
                        {
                            resolver: {
                                name: "ConcreteClass1"
                            },
                            parameters: [
                                {
                                    isDependency: true,
                                    location: {
                                        instanceModule: testDataSecond.ServiceModule1,
                                        name: 'TestBaseClass'
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
    Level8.registerModuleConstructorWithDependencies = registerModuleConstructorWithDependencies;

    function registerComponentsWithinModel(test) {
        var config = {
            modules: [
                {
                    forModule: false,
                    serviceModule: testData,
                    resolverModule: testData,
                    components: [
                        {
                            service: {
                                name: 'Test1Base'
                            },
                            resolver: {
                                name: 'Test1'
                            }
                        }
                    ]
                }
            ]
        };

        containerBuilder.registerConfig(config);

        var container = containerBuilder.build();
        var actual = container.resolve(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }
    Level8.registerComponentsWithinModel = registerComponentsWithinModel;
})(exports.Level8 || (exports.Level8 = {}));
var Level8 = exports.Level8;
//# sourceMappingURL=level8.js.map
