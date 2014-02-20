///<reference path='../../d.ts/typeioc.d.ts' />

import testData = require('./test-data');

export class Config
{
    public static TestModule : any;
    public static TestModule2 : any;

    public static parameterlessResolution() : Typeioc.IConfig {
        return {
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
    }

    public static factoryResolution() : Typeioc.IConfig {
        return {
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
    }

    public static dependenciesResolution() : Typeioc.IConfig {
        return {
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
    }

    public static customParametersResolution() : Typeioc.IConfig {
        return {
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
    }

    public static namedServicesResolution() : Typeioc.IConfig {
        return {
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
    }

    public static noScopingReuse() : Typeioc.IConfig {
        return {
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
    }

    public static containerOwnedInstancesAreDisposed() : Typeioc.IConfig {
        return {
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
    }

    public static initializeIsCalledWhenInstanceIsCreated(className : string) : Typeioc.IConfig {
        return {
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
    }

    public static registerModuleBasicInheritance() : Typeioc.IConfig {
        return {
            modules : [
                {
                    serviceModule : Config.TestModule2.ServiceModule1,
                    resolverModule : Config.TestModule2.SubstituteModule1
                }
            ]
        };
    }

    public static registerModuleConstructorWithParams() : Typeioc.IConfig {
        return {
            modules : [
                {
                    serviceModule : Config.TestModule2.ServiceModule1,
                    resolverModule : Config.TestModule2.SubstituteModule3,
                    forInstances : [
                        {
                            resolver : {
                                instanceModule : Config.TestModule2.SubstituteModule3,
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

    }

    public static registerModuleConstructorWithDependencies() : Typeioc.IConfig {
        return {
            modules : [
                {
                    serviceModule : Config.TestModule2.ServiceModule1,
                    resolverModule : Config.TestModule2.SubstituteModule3,
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
                    serviceModule : Config.TestModule2.ServiceModule3,
                    resolverModule : Config.TestModule2.SubstituteModule6,
                    forInstances : [
                        {
                            resolver : {
                                name : "ConcreteClass1"
                            },
                            parameters : [
                                {
                                    isDependency:true,
                                    location :  {
                                        instanceModule : Config.TestModule2.ServiceModule1,
                                        name : 'TestBaseClass'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    public static registerComponentsWithinModel() : Typeioc.IConfig {
        return {

            modules : [
                {
                    forModule : false,
                    serviceModule : Config.TestModule,
                    resolverModule : Config.TestModule,

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
    }
}



