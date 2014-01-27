'use strict';
var testData = require('./../test-data');
var testDataSecond = require('./../test-data2');
var scaffold = require('./../scaffold');

var containerBuilder;

exports.Level8 = {

    setUp: function (callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    },

    configParameterlessResolution : function (test) {

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
    },

    configFactoryResolution : function (test) {

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
    },

    dependenciesResolution : function (test) {

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
    },

    customParametersResolution : function (test) {

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
    },

    namedServicesResolution : function (test) {

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
    },

    noScopingReuse : function (test) {

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
                    within: scaffold.Types.Scope.None
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
    },

    containerOwnedInstancesAreDisposed : function (test) {

        var config = {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () { return new testData.Test5(); },
                    disposer: function (item) { item.Dispose(); },
                    within: scaffold.Types.Scope.None,
                    ownedBy:scaffold.Types.Owner.Container
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
    },

    initializeIsCalledWhenInstanceIsCreated : function (test) {
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
    },

    registerModuleBasicInheritance : function (test) {

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
    },

    registerModuleConstructorWithParams : function (test) {

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
    },

    registerModuleConstructorWithDependencies : function (test) {

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
    },

    registerComponentsWithinModel : function (test) {

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
}