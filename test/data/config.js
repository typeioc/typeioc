///<reference path='../../d.ts/typeioc.d.ts' />
var testData = require('./test-data');
var Config = (function () {
    function Config() {
    }
    Config.parameterlessResolution = function () {
        return {
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
    };
    Config.factoryResolution = function () {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () { return new testData.Test1(); }
                }
            ]
        };
    };
    Config.dependenciesResolution = function () {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test2Base'
                    },
                    factory: function () { return new testData.Test2(); }
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
    };
    Config.dependenciesResolutionByCreation = function () {
        return {
            components: [
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
                            isDependency: false,
                            location: {
                                instanceModule: testData,
                                name: 'Test2'
                            }
                        }
                    ]
                }
            ]
        };
    };
    Config.customParametersResolution = function () {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function (c, name) { return new testData.Test4(name); }
                }
            ]
        };
    };
    Config.namedServicesResolution = function () {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () { return new testData.Test4("null"); }
                },
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () { return new testData.Test4("a"); },
                    named: "A"
                },
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () { return new testData.Test4("b"); },
                    named: "B"
                }
            ]
        };
    };
    Config.noScopingReuse = function () {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () { return new testData.Test4("test 4"); },
                    within: 1 /* None */
                }
            ]
        };
    };
    Config.containerOwnedInstancesAreDisposed = function () {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: function () { return new testData.Test5(); },
                    disposer: function (item) { item.Dispose(); },
                    within: 1 /* None */,
                    ownedBy: 1 /* Container */
                }
            ]
        };
    };
    Config.initializeIsCalledWhenInstanceIsCreated = function (className) {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Initializable'
                    },
                    factory: function () { return new testData.Initializable(); },
                    initializeBy: function (c, item) { item.initialize(className); return item; }
                }
            ]
        };
    };
    Config.registerModuleBasicInheritance = function () {
        return {
            modules: [
                {
                    serviceModule: Config.TestModule2.ServiceModule1,
                    resolverModule: Config.TestModule2.SubstituteModule1
                }
            ]
        };
    };
    Config.registerModuleContainerUsage = function () {
        return {
            modules: [
                {
                    serviceModule: Config.TestModule2.ServiceModule1,
                    resolverModule: Config.TestModule2.SubstituteModule1,
                    within: 2 /* Container */,
                    ownedBy: 1 /* Container */
                }
            ]
        };
    };
    Config.registerModuleForInstanceEmptyParams = function () {
        return {
            modules: [
                {
                    serviceModule: Config.TestModule2.ServiceModule1,
                    resolverModule: Config.TestModule2.SubstituteModule1,
                    forInstances: [
                        {
                            resolver: {
                                name: "ConcreteTestClass"
                            }
                        }
                    ]
                }
            ]
        };
    };
    Config.registerModuleConstructorWithParams = function () {
        return {
            modules: [
                {
                    serviceModule: Config.TestModule2.ServiceModule1,
                    resolverModule: Config.TestModule2.SubstituteModule3,
                    forInstances: [
                        {
                            resolver: {
                                instanceModule: Config.TestModule2.SubstituteModule3,
                                name: "ConcreteTestClass"
                            },
                            parameters: [
                                {
                                    instance: 77
                                },
                                {
                                    instance: "Test"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    };
    Config.registerModuleConstructorWithDependencies = function () {
        return {
            modules: [
                {
                    serviceModule: Config.TestModule2.ServiceModule1,
                    resolverModule: Config.TestModule2.SubstituteModule3,
                    forInstances: [
                        {
                            resolver: {
                                name: "ConcreteTestClass"
                            },
                            parameters: [
                                {
                                    instance: 77
                                },
                                {
                                    instance: "Test"
                                }
                            ]
                        }
                    ]
                },
                {
                    serviceModule: Config.TestModule2.ServiceModule3,
                    resolverModule: Config.TestModule2.SubstituteModule6,
                    forInstances: [
                        {
                            resolver: {
                                name: "ConcreteClass1"
                            },
                            parameters: [
                                {
                                    isDependency: true,
                                    location: {
                                        instanceModule: Config.TestModule2.ServiceModule1,
                                        name: 'TestBaseClass'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    };
    Config.registerComponentsWithinModule = function () {
        return {
            modules: [
                {
                    forModule: false,
                    serviceModule: Config.TestModule,
                    resolverModule: Config.TestModule,
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
    };
    Config.registerComponentsWithResolverModule = function () {
        return {
            modules: [
                {
                    forModule: false,
                    serviceModule: Config.TestModule2.ServiceModule1,
                    resolverModule: Config.TestModule2.SubstituteModule1,
                    components: [
                        {
                            service: {
                                name: 'TestBaseClass'
                            },
                            resolver: {
                                name: 'ConcreteTestClass'
                            }
                        }
                    ]
                }
            ]
        };
    };
    return Config;
})();
exports.Config = Config;
//# sourceMappingURL=config.js.map