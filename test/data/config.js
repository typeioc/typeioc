///<reference path='../../d.ts/typeioc.d.ts' />
'use strict';
const testData = require('./test-data');
class Config {
    static parameterlessResolution() {
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
    }
    static factoryResolution() {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: () => new testData.Test1()
                }
            ]
        };
    }
    static dependenciesResolution() {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test2Base'
                    },
                    factory: () => new testData.Test2()
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
    }
    static dependenciesResolutionByCreation() {
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
    }
    static customParametersResolution() {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: (c, name) => new testData.Test4(name)
                }
            ]
        };
    }
    static namedServicesResolution() {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: () => new testData.Test4("null")
                },
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: () => new testData.Test4("a"),
                    named: "A"
                },
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: () => new testData.Test4("b"),
                    named: "B"
                }
            ]
        };
    }
    static noScopingReuse() {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: () => new testData.Test4("test 4"),
                    within: 1 /* None */
                }
            ]
        };
    }
    static containerOwnedInstancesAreDisposed() {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Test1Base'
                    },
                    factory: () => new testData.Test5(),
                    disposer: (item) => { item.Dispose(); },
                    within: 1 /* None */,
                    ownedBy: 1 /* Container */
                }
            ]
        };
    }
    static initializeIsCalledWhenInstanceIsCreated(className) {
        return {
            components: [
                {
                    service: {
                        instanceModule: testData,
                        name: 'Initializable'
                    },
                    factory: () => new testData.Initializable(),
                    initializeBy: (c, item) => { item.initialize(className); return item; }
                }
            ]
        };
    }
    static registerModuleBasicInheritance() {
        return {
            modules: [
                {
                    serviceModule: Config.TestModule2.ServiceModule1,
                    resolverModule: Config.TestModule2.SubstituteModule1
                }
            ]
        };
    }
    static registerModuleContainerUsage() {
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
    }
    static registerModuleForInstanceEmptyParams() {
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
    }
    static registerModuleConstructorWithParams() {
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
    }
    static registerModuleConstructorWithDependencies() {
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
    }
    static registerComponentsWithinModule() {
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
    }
    static registerComponentsWithResolverModule() {
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
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map