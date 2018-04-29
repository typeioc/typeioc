'use strict';

exports.api = {

    level9: (function () {

        const scaffold = require('../scaffold');
        const testData = scaffold.TestModule;
        const mockery = scaffold.Mockery;

        var containerBuilder;

        return {
            setUp: function (callback) {
                containerBuilder = scaffold.createBuilder();
                callback();
            },

            resolvesWithDependency : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base,
                    factory: function (c) {

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                var actualDynamic = container.resolveWithDependencies(testData.Test1Base, dependencies);

                test.strictEqual(actualDynamic.Name, 'Test 3 name from dependency');

                test.done();
            },

            resolveWithDependencyUsesDynamicContainer : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base,
                    factory: function (c) {

                        test.notStrictEqual(container, c);

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                container.resolveWithDependencies(testData.Test1Base, dependencies);

                test.expect(1);

                test.done();
            },

            resolvesWithNoDependencyIsTheSame : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();
                var actualNative = container.resolve(testData.Test1Base);

                var dependencies = [{
                    service: testData.Test2Base,
                    factory: function (c) {

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                var actualDynamic = container.resolveWithDependencies(testData.Test1Base, dependencies);

                test.notStrictEqual(actualDynamic, actualNative);
                test.strictEqual(actualNative.Name, 'Test 3 test 2');

                test.done();
            },

            resolutionErrorWhenNoDependencies : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var delegate = function() {
                    container.resolveWithDependencies(testData.Test1Base);
                };

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'No dependencies provided');
                    return (error instanceof scaffold.Exceptions.ResolutionError);
                });

                test.expect(2);

                test.done();
            },

            resolutionErrorWhenNoRegistrationWithDependencies : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service : testData.Test2Base,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                var delegate = function() {
                    container.resolveWithDependencies(testData.Test1Base, dependencies);
                };

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Could not resolve service');
                    test.strictEqual(error.data, testData.Test1Base);

                    return (error instanceof scaffold.Exceptions.ResolutionError);
                });

                test.expect(3);

                test.done();
            },

            resolutionErrorWhenNoDependenciesRegistration : function(test) {

                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service : testData.Test2Base,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                var delegate = function() {
                    container.resolveWithDependencies(testData.Test1Base, dependencies);
                };

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Could not resolve service');
                    test.strictEqual(error.data, testData.Test2Base);

                    return (error instanceof scaffold.Exceptions.ResolutionError);
                });

                test.expect(3);

                test.done();
            },

            resolveWithMissingDependency : function(test) {

                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service : testData.Test2Base,
                    required : false,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                var actual = container.resolveWithDependencies(testData.Test1Base, dependencies);

                test.ok(actual);
                test.strictEqual(actual.Name, 'Test 3 name from dependency');

                test.done();
            },

            resolveWithPartialMissingDependencies : function(test) {

                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {

                        return new testData.Test4("test 4");
                    }).named("Test 4");


                var dynamicService = function () {};
                containerBuilder.register(dynamicService)
                    .as(function (c) {

                        var test1 = c.resolve(testData.Test1Base);
                        var test2 = c.resolve(testData.Test2Base);

                        var test4 = c.resolveNamed(testData.Test1Base, "Test 4");

                        return new testData.Test7(test1, test2, test4);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service : testData.Test1Base,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'test 1 base';
                            }
                        }
                    }
                },
                {
                    service : testData.Test2Base,
                    required : false,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'test 2 base';
                            }
                        }
                    }
                },
                {
                    service : testData.Test1Base,
                    named : "Test 4",
                    factory : function(c) {

                        return {
                            get Name () {
                                return 'test 4 base'
                            }
                        };
                    }
                }];

                var actual = container.resolveWithDependencies(dynamicService, dependencies);
                test.ok(actual);
                test.ok(actual instanceof testData.Test7);
                test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');

                test.expect(3);

                test.done();
            },

            resolveWithMultipleDependencies : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {

                        return new testData.Test4("test 4");
                    }).named("Test 4");


                var dynamicService = function () {};
                containerBuilder.register(dynamicService)
                    .as(function (c) {

                        var test1 = c.resolve(testData.Test1Base);
                        var test2 = c.resolve(testData.Test2Base);
                        var test4 = c.resolveNamed(testData.Test1Base, "Test 4");

                        return new testData.Test7(test1, test2, test4);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service : testData.Test1Base,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'test 1 base';
                            }
                        }
                    }
                },
                {
                    service : testData.Test2Base,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'test 2 base';
                            }
                        }
                    }
                },
                {
                    service : testData.Test1Base,
                    named : "Test 4",
                    factory : function(c) {

                        return {
                            get Name () {
                               return 'test 4 base'
                            }
                        };
                     }
                }];

                var actual = container.resolveWithDependencies(dynamicService, dependencies);
                test.ok(actual);
                test.ok(actual instanceof testData.Test7);
                test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');

                test.done();
            },

            resolveWithDependencyThrowsWhenNamedRegistration : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    }).named('Test');

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base,
                    factory: function (c) {

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                var delegate = function() {
                    container.resolveWithDependencies(testData.Test1Base, dependencies);
                };

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Could not resolve service');
                    test.strictEqual(error.data, testData.Test1Base);

                    return (error instanceof scaffold.Exceptions.ResolutionError);
                });

                test.expect(3);

                test.done();
            },

            resolveWithDependencyThrowsWhenRegistrationWithParams : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c, a, b, d) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base,
                    factory: function (c) {

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                var delegate = function() {
                    container.resolveWithDependencies(testData.Test1Base, dependencies);
                };

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Could not resolve service');
                    test.strictEqual(error.data, testData.Test1Base);

                    return (error instanceof scaffold.Exceptions.ResolutionError);
                });

                test.expect(3);

                test.done();
            },

            resolvesWithDependencyThrowsWhenNoService : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    factory: function (c) {

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                var delegate = function() {
                    container.resolveWithDependencies(testData.Test1Base, dependencies);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Service is not defined');
                    test.strictEqual(error.data, dependencies[0]);

                    return error instanceof scaffold.Exceptions.ResolutionError;
                });

                test.expect(3);

                test.done();
            },

            resolvesWithDependencyThrowsWhenNoFactory : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base
                }];

                var delegate = function() {
                    container.resolveWithDependencies(testData.Test1Base, dependencies);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Unknown registration type');
                    return error instanceof scaffold.Exceptions.ApplicationError;
                });

                test.expect(2);

                test.done();
            },

            resolvesWithDependencyThrowsWhenFactoryAndFactoryType : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base,
                    factory : function() { return {};},
                    factoryType : function() {return {}; }
                }];

                var delegate = function() {
                    container.resolveWithDependencies(testData.Test1Base, dependencies);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Unknown registration type');
                    return error instanceof scaffold.Exceptions.ApplicationError;
                });

                test.done();
            },

            resolvesWithDependencyThrowsWhenFactoryAndFactoryValue : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base,
                    factory : function() { return {};},
                    factoryValue : function() {return {}; }
                }];

                var delegate = function() {
                    container.resolveWithDependencies(testData.Test1Base, dependencies);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Unknown registration type');
                    return error instanceof scaffold.Exceptions.ApplicationError;
                });

                test.done();
            },

            resolveWithDependencyInitializerIsInvoked : function(test) {

                var resolutionInitializer = mockery.stub();
                var dependencyInitializer = mockery.stub();

                var resolveItem = new testData.Test3(null);

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        c.resolve(testData.Test2Base);

                        return resolveItem;
                    })
                    .initializeBy(resolutionInitializer);

                var container = containerBuilder.build();
                var item = {
                    get Name() {
                        return 'name from dependency';
                    }
                };

                var dependencies = [{
                    service: testData.Test2Base,
                    factory: function (c) {
                        return item;
                    },
                    initializer : dependencyInitializer
                }];

                container.resolveWithDependencies(testData.Test1Base, dependencies);

                test.ok(resolutionInitializer.calledOnce);
                test.ok(resolutionInitializer.calledWithExactly(mockery.match.any, resolveItem));

                test.ok(dependencyInitializer.calledOnce);
                test.ok(dependencyInitializer.calledWithExactly(mockery.match.any, item));

                test.done();
            },

            resolveWithPartialUniqueDependencies : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {

                        return new testData.Test4("test 4");
                    }).named("Test 4");


                var dynamicService = function () {};
                containerBuilder.register(dynamicService)
                    .as(function (c) {

                        var test1 = c.resolve(testData.Test1Base);
                        var test2 = c.resolve(testData.Test2Base);

                        test.ok(test2 instanceof testData.Test2);

                        var test4 = c.resolveNamed(testData.Test1Base, "Test 4");

                        return new testData.Test7(test1, test2, test4);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service : testData.Test1Base,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'test 1 base';
                            }
                        }
                    }
                },
                {
                    service : testData.Test1Base,
                    named : "Test 4",
                    factory : function(c) {

                        return {
                            get Name () {
                                return 'test 4 base'
                            }
                        };
                    }
                }];

                var actual = container.resolveWithDependencies(dynamicService, dependencies);
                test.ok(actual);
                test.ok(actual instanceof testData.Test7);
                test.strictEqual(actual.Name, 'test 1 base test 2 test 4 base');

                test.expect(4);

                test.done();
            },

            resolveWithPartialNonNamedDependencies : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {

                        return new testData.Test4("test 4");
                    }).named("Test 4");


                var dynamicService = function () {};
                containerBuilder.register(dynamicService)
                    .as(function (c) {

                        var test1 = c.resolve(testData.Test1Base);

                        test.ok(test1 instanceof testData.Test3);

                        var test2 = c.resolve(testData.Test2Base);
                        var test4 = c.resolveNamed(testData.Test1Base, "Test 4");

                        return new testData.Test7(test1, test2, test4);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service : testData.Test2Base,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'test 2 base';
                            }
                        }
                    }
                },
                {
                    service : testData.Test1Base,
                    named : "Test 4",
                    factory : function(c) {

                        return {
                            get Name () {
                                return 'test 4 base'
                            }
                        };
                    }
                }];

                var actual = container.resolveWithDependencies(dynamicService, dependencies);
                test.ok(actual);
                test.ok(actual instanceof testData.Test7);
                test.strictEqual(actual.Name, 'Test 3 test 2 test 2 base test 4 base');

                test.expect(4);

                test.done();
            },

            resolveWithPartialNamedDependencies : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {

                        return new testData.Test4("test 4");
                    }).named("Test 4");


                var dynamicService = function () {};
                containerBuilder.register(dynamicService)
                    .as(function (c) {

                        var test1 = c.resolve(testData.Test1Base);
                        var test2 = c.resolve(testData.Test2Base);
                        var test4 = c.resolveNamed(testData.Test1Base, "Test 4");

                        test.ok(test4 instanceof testData.Test4);

                        return new testData.Test7(test1, test2, test4);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service : testData.Test1Base,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'test 1 base';
                            }
                        }
                    }
                },
                {
                    service : testData.Test2Base,
                    factory : function(c) {

                        return {
                            get Name() {
                                return 'test 2 base';
                            }
                        }
                    }
                }];

                var actual = container.resolveWithDependencies(dynamicService, dependencies);
                test.ok(actual);
                test.ok(actual instanceof testData.Test7);
                test.strictEqual(actual.Name, 'test 1 base test 2 base test 4');

                test.expect(4);

                test.done();
            }
        }
    })()
}
