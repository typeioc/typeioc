'use strict';

exports.api = {

    level10: (function () {

        var scaffold = require('./../../scaffold');
        var testData = scaffold.TestModule;

        var containerBuilder;

        return {

            setUp: function (callback) {
                containerBuilder = scaffold.createBuilder();
                callback();
            },

            resolveWithResolvesService : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    });

                var container = containerBuilder.build();

                var actual = container.resolveWith(testData.Test2Base)
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test2);
                test.strictEqual(actual.Name, 'test 2');

                test.done();
            },

            resolveWithThrowsErrorWhenNotFound : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    });

                var container = containerBuilder.build();

                var delegate = function() {
                    container.resolveWith(testData.Test1Base)
                        .exec();
                };

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Could not resolve service');
                    test.strictEqual(error.data, testData.Test1Base);

                    return (error instanceof scaffold.Exceptions.ResolutionError);
                });

                test.expect(3);

                test.done();
            },

            resolveWithResolvesServiceWithArgs : function(test) {

                var arg1 = 'arg 1';
                var arg2 = 'arg 2';
                var expected = arg1 + ' ' + arg2;

                containerBuilder.register(testData.Test1Base)
                .as(function (c, name1, name2) {
                    return new testData.Test4(expected);
                });

                var container = containerBuilder.build();

                var actual = container
                    .resolveWith(testData.Test1Base)
                    .args(arg1, arg2)
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test4);
                test.strictEqual(actual.Name, expected);

                test.done();
            },

            resolveWithAttemptsResolvesService : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    });

                var container = containerBuilder.build();

                var actual = container.resolveWith(testData.Test2Base)
                    .attempt()
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test2);
                test.strictEqual(actual.Name, 'test 2');

                test.done();
            },

            resolveWithAttemptsFalseService : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    });

                var container = containerBuilder.build();

                var actual = container.resolveWith(testData.Test1Base)
                    .attempt()
                    .exec();

                test.ok(actual === null);

                test.done();
            },

            resolveWithResolvesNamedService : function(test) {

                var testName = 'testName';

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    })
                    .named(testName);

                var container = containerBuilder.build();

                var actual = container.resolveWith(testData.Test2Base)
                    .name(testName)
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test2);
                test.strictEqual(actual.Name, 'test 2');

                test.done();
            },

            resolveWithThrowsWhenNoName : function(test) {

                var testName = 'testName';

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    })
                    .named(testName);

                var container = containerBuilder.build();

                var delegate = function() {
                    container.resolveWith(testData.Test2Base)
                        .exec();
                };

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Could not resolve service');
                    test.strictEqual(error.data, testData.Test2Base);

                    return (error instanceof scaffold.Exceptions.ResolutionError);
                });

                test.expect(3);

                test.done();
            },

            resolvesWithResolvesDependency : function(test) {

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
                    factory: function () {

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                var actual = container.resolveWith(testData.Test1Base)
                    .dependencies(dependencies)
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test1Base);
                test.strictEqual(actual.Name, 'Test 3 name from dependency');

                test.done();
            },

            resolveWithMultipleDependenciesSeparatlyArrays : function(test) {

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

                var actual = container.resolveWith(dynamicService)
                    .dependencies([{
                        service : testData.Test1Base,
                        factory : function(c) {

                            return {
                                get Name() {
                                    return 'test 1 base';
                                }
                            }
                        }
                    }])
                    .dependencies([{
                        service : testData.Test2Base,
                        factory : function(c) {

                            return {
                                get Name() {
                                    return 'test 2 base';
                                }
                            }
                        }
                    }])
                    .dependencies([{
                        service : testData.Test1Base,
                        named : "Test 4",
                        factory : function(c) {

                            return {
                                get Name () {
                                    return 'test 4 base'
                                }
                            };
                        }
                    }])
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test7);
                test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');

                test.done();
            },

            resolveWithMultipleDependenciesSeparatly : function(test) {

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

                var actual = container.resolveWith(dynamicService)
                    .dependencies({
                        service : testData.Test1Base,
                        factory : function(c) {

                            return {
                                get Name() {
                                    return 'test 1 base';
                                }
                            }
                        }
                    })
                    .dependencies({
                        service : testData.Test2Base,
                        factory : function(c) {

                            return {
                                get Name() {
                                    return 'test 2 base';
                                }
                            }
                        }
                    })
                    .dependencies([{
                        service : testData.Test1Base,
                        named : "Test 4",
                        factory : function(c) {

                            return {
                                get Name () {
                                    return 'test 4 base'
                                }
                            };
                        }
                    }])
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test7);
                test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');

                test.done();
            },

            resolveWithResolvesCacheDefault : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    });

                var container = containerBuilder.build();

                container.resolveWith(testData.Test2Base)
                    .cache()
                    .exec();

                var cache = container.cache;

                var actual = cache.Test2Base;
                var actual2 = cache.Test2Base;

                test.ok(actual);
                test.ok(actual instanceof testData.Test2);
                test.strictEqual(actual.Name, 'test 2');

                test.strictEqual(actual, actual2);

                test.done();
            },

            resolveWithResolvesCacheWithName : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    });

                var container = containerBuilder.build();

                container.resolveWith(testData.Test2Base)
                    .cache('TestName111')
                    .exec();

                var cache = container.cache;

                var actual = cache.TestName111;

                test.ok(actual);
                test.ok(actual instanceof testData.Test2);
                test.strictEqual(actual.Name, 'test 2');

                test.done();
            },

            resolveWithResolvesCacheWithServiceNamedResolution : function(test) {

                var named = function AAAAA() {};

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    }).named(named.name);

                var container = containerBuilder.build();

                container.resolveWith(testData.Test2Base)
                    .name(named.name)
                    .cache()
                    .exec();

                var cache = container.cache;

                var actual = cache.AAAAA;

                test.ok(actual);
                test.ok(actual instanceof testData.Test2);
                test.strictEqual(actual.Name, 'test 2');

                test.done();
            },

            resolveWithResolvesCacheWithServiceValueName : function(test) {

                var name = "AAAAAA";

                containerBuilder.register(name)
                    .as(function () {
                        return new testData.Test2();
                    });

                var container = containerBuilder.build();

                container.resolveWith(name)
                    .cache()
                    .exec();

                var cache = container.cache;

                var actual = cache[name];
                var actual2 = cache.AAAAAA;

                test.ok(actual);
                test.ok(actual instanceof testData.Test2);
                test.strictEqual(actual.Name, 'test 2');

                test.strictEqual(actual, actual2);

                test.done();
            },

            resolveWithCacheThrowsWhenNoName : function(test) {

                var service = {};

                containerBuilder.register(service)
                    .as(function () {
                        return new testData.Test2();
                    });

                var container = containerBuilder.build();

                var delegate = function() {
                    container.resolveWith(service)
                        .cache()
                        .exec();
                };

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Missing cache name');
                    test.strictEqual(error.data, undefined);

                    return (error instanceof scaffold.Exceptions.ResolutionError);
                });

                test.expect(3);

                test.done();
            },

            resolveWithCacheFromChildContainer : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function () {
                        return new testData.Test2();
                    });

                var container = containerBuilder.build();
                var child = container.createChild();

                var actual = child.resolveWith(testData.Test2Base)
                    .cache()
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test2);
                test.strictEqual(actual.Name, 'test 2');


                test.done();
            },

            resolveWithArgsAttempt: function(test) {

                var name = 'AAAAA';

                containerBuilder.register(testData.Test1Base)
                    .as(function (c, name) {
                        return new testData.Test4(name);
                    });

                var container = containerBuilder.build();

                var actual = container
                    .resolveWith(testData.Test1Base)
                    .args(name)
                    .attempt()
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test4);
                test.strictEqual(actual.Name, name);

                test.done();
            },

            resolveWithArgsAttemptThrows: function(test) {

                var name = 'AAAAA';

                containerBuilder.register(testData.Test1Base)
                    .as(function (c, name) {
                        return new testData.Test4(name);
                    });

                var container = containerBuilder.build();

                var actual = container
                    .resolveWith(testData.Test2Base)
                    .args(name)
                    .attempt()
                    .exec();

                test.strictEqual(actual, null);

                test.done();
            },

            resolveWithArgsNamed: function(test) {

                var argName = 'AAAAA';
                var resolutionName = 'Test name';

                containerBuilder.register(testData.Test1Base)
                    .as(function (c, name) {
                        return new testData.Test4(name);
                    })
                    .named(resolutionName);

                var container = containerBuilder.build();

                var actual = container
                    .resolveWith(testData.Test1Base)
                    .args(argName)
                    .name(resolutionName)
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test4);
                test.strictEqual(actual.Name, argName);

                test.done();
            },

            resolveWithArgsDependencies : function(test) {

                var param = 'Some name';

                containerBuilder.register(testData.Test2Base)
                    .as(function (c) {
                        return new testData.Test2();
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c, arg) {
                        var test2 = c.resolve(testData.Test2Base);

                        var result = new testData.Test3(test2);

                        return {
                            get Name() {
                                return [result.Name, arg].join(' ');
                            }
                        };
                     });

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base,
                    factory: function () {

                        return {
                            get Name() {
                                return 'name from dependency';
                            }
                        };
                    }
                }];

                var actual = container.resolveWith(testData.Test1Base)
                    .args(param)
                    .dependencies(dependencies)
                    .exec();

                test.ok(actual);
                test.strictEqual(actual.Name, 'Test 3 name from dependency Some name');

                test.done();
            },

            resolveWithArgsParamsDependencies : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (_, a, b, d) {
                        return {
                            get Name() {
                                return [a, b, d].join(' ');
                            }
                        }
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c, a, b, d) {
                        var test2 = c.resolve(testData.Test2Base, a, b, d);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base,
                    factory: function (c, a, b, d) {

                        return {
                            get Name() {
                                return [a, b, d,].join(' - ');
                            }
                        };
                    }
                }];

                var actual = container.resolveWith(testData.Test1Base)
                    .args('4', '5', '6')
                    .dependencies(dependencies)
                    .exec();

                test.strictEqual(actual.Name, 'Test 3 4 - 5 - 6');

                test.done();
            },

            resolveWithArgsParamsDependenciesThrowsWhenWrongArgsCount : function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (_, a, b, d) {
                        return {
                            get Name() {
                                return [a, b, d].join(' ');
                            }
                        }
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c, a, b, d) {
                        var test2 = c.resolve(testData.Test2Base, a, b, d);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base,
                    factory: function (c, a, b) {

                        return {
                            get Name() {
                                return [a, b].join(' - ');
                            }
                        };
                    }
                }];

                var delegate = function() {
                    container.resolveWith(testData.Test1Base)
                        .args('4', '5', '6')
                        .dependencies(dependencies)
                        .exec();
                };

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Could not resolve service');
                    test.strictEqual(error.data, testData.Test2Base);

                    return (error instanceof scaffold.Exceptions.ResolutionError);
                });

                test.expect(3);

                test.done();
            },

            resolveWithArgsCacheNoName : function(test) {

                var argName = 'AAAAA';

                containerBuilder.register(testData.Test1Base)
                    .as(function (c, name) {
                        return new testData.Test4(name);
                    });

                var container = containerBuilder.build();

                container
                    .resolveWith(testData.Test1Base)
                    .args(argName)
                    .cache()
                    .exec();

                var actual = container.cache.Test1Base;

                test.ok(actual);
                test.ok(actual instanceof testData.Test4);
                test.strictEqual(actual.Name, argName);

                test.done();
            },

            resolveWithAttemptWithName : function(test) {

                var argName = 'AAAAA';
                var resolutionName = 'Test';

                containerBuilder.register(testData.Test1Base)
                    .as(function () {
                        return new testData.Test4(argName);
                    })
                    .named(resolutionName);

                var container = containerBuilder.build();

                var actual = container
                    .resolveWith(testData.Test1Base)
                    .attempt()
                    .name(resolutionName)
                    .exec();


                test.ok(actual);
                test.ok(actual instanceof testData.Test4);
                test.strictEqual(actual.Name, argName);

                test.done();
            },

            resolveWithAttemptDependencies: function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (_) {
                        return {
                            get Name() {
                                return 'Test2Base';
                            }
                        }
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
                                return 'Test2 substitute';
                            }
                        };
                    }
                }];

                var actual = container.resolveWith(testData.Test1Base)
                    .attempt()
                    .dependencies(dependencies)
                    .exec();

                test.strictEqual(actual.Name, 'Test 3 Test2 substitute');

                test.done();
            },

            resolveWithAttemptDependenciesMissingResolution: function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (_) {
                        return {
                            get Name() {
                                return 'Test2Base';
                            }
                        }
                    });
                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    });

                var container = containerBuilder.build();

                var dependencies = [{
                    service: {},
                    factory: function (c) {

                        return {
                            get Name() {
                                return 'Test2 substitute';
                            }
                        };
                    }
                }];

                var actual = container.resolveWith(testData.Test1Base)
                    .attempt()
                    .dependencies(dependencies)
                    .exec();

                test.strictEqual(actual, null);

                test.done();
            },

            resolveWithAttemptDependenciesMissingNonRequiredResolution : function(test) {

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

                var actual = container
                    .resolveWith(testData.Test1Base)
                    .attempt()
                    .dependencies(dependencies)
                    .exec();

                test.ok(actual);
                test.strictEqual(actual.Name, 'Test 3 name from dependency');

                test.done();
            },

            resolveWithAttemptPartialMissingNonRequiredDependencies : function(test) {

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

                var actual = container
                    .resolveWith(dynamicService)
                    .attempt()
                    .dependencies(dependencies)
                    .exec();

                test.ok(actual);
                test.ok(actual instanceof testData.Test7);
                test.strictEqual(actual.Name, 'test 1 base test 2 base test 4 base');

                test.expect(3);

                test.done();
            },

            resolveWithAttemptCache : function(test) {
                var argName = 'AAAAA';

                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        return new testData.Test4(argName);
                    });

                var container = containerBuilder.build();

                container
                    .resolveWith(testData.Test1Base)
                    .attempt()
                    .cache()
                    .exec();

                var actual = container.cache.Test1Base;

                test.ok(actual);
                test.ok(actual instanceof testData.Test4);
                test.strictEqual(actual.Name, argName);

                test.done();
            },

            resolveWithNameDependencies : function(test) {

                var resolutionName = 'AAAAA';

                containerBuilder.register(testData.Test2Base)
                    .as(function (_) {
                        return {
                            get Name() {
                                return 'Test2Base';
                            }
                        }
                    });

                containerBuilder.register(testData.Test1Base)
                    .as(function (c) {
                        var test2 = c.resolve(testData.Test2Base);

                        return new testData.Test3(test2);
                    })
                    .named(resolutionName);

                var container = containerBuilder.build();

                var dependencies = [{
                    service: testData.Test2Base,
                    factory: function (c) {

                        return {
                            get Name() {
                                return 'Test2 substitute';
                            }
                        };
                    }
                }];

                var actual = container.resolveWith(testData.Test1Base)
                    .name(resolutionName)
                    .dependencies(dependencies)
                    .exec();

                test.strictEqual(actual.Name, 'Test 3 Test2 substitute');

                test.done();
            },

            resolutionWithNameCache : function(test) {
                var argName = 'ArgName';
                var resolutionName = 'AAAAA';

                containerBuilder.register(testData.Test1Base)
                    .as(function () {
                        return new testData.Test4(argName);
                    })
                    .named(resolutionName);

                var container = containerBuilder.build();

                container
                    .resolveWith(testData.Test1Base)
                    .name(resolutionName)
                    .cache()
                    .exec();

                var actual = container.cache.AAAAA;

                test.ok(actual);
                test.ok(actual instanceof testData.Test4);
                test.strictEqual(actual.Name, argName);

                test.done();
            },

            resolveWithDependenciesCache: function(test) {

                containerBuilder.register(testData.Test2Base)
                    .as(function (_) {
                        return {
                            get Name() {
                                return 'Test2Base';
                            }
                        }
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
                                return 'Test2 substitute';
                            }
                        };
                    }
                }];

                container.resolveWith(testData.Test1Base)
                    .dependencies(dependencies)
                    .cache()
                    .exec();

                var actual = container.cache.Test1Base;

                test.ok(actual);
                test.ok(actual instanceof testData.Test3);

                test.strictEqual(actual.Name, 'Test 3 Test2 substitute');

                test.done();
            },

            fluentApiResolveWith : function (test) {

                var container = containerBuilder.build();
                var registration = container.resolveWith(testData.Test1Base);

                test.notEqual(registration['args'], undefined);
                test.notEqual(registration['args'], null);
                test.notEqual(registration['attempt'], undefined);
                test.notEqual(registration['attempt'], null);
                test.notEqual(registration['name'], undefined);
                test.notEqual(registration['name'], null);
                test.notEqual(registration['dependencies'], undefined);
                test.notEqual(registration['dependencies'], null);
                test.notEqual(registration['cache'], undefined);
                test.notEqual(registration['cache'], null);
                test.notEqual(registration['exec'], undefined);
                test.notEqual(registration['exec'], null);

                test.done();
            },

            fluentApiResolveWithArgs : function (test) {

                var container = containerBuilder.build();
                var registration = container
                    .resolveWith(testData.Test1Base)
                    .args([]);

                test.strictEqual(registration['args'], undefined);
                test.notEqual(registration['attempt'], undefined);
                test.notEqual(registration['attempt'], null);
                test.notEqual(registration['name'], undefined);
                test.notEqual(registration['name'], null);
                test.notEqual(registration['dependencies'], undefined);
                test.notEqual(registration['dependencies'], null);
                test.notEqual(registration['cache'], undefined);
                test.notEqual(registration['cache'], null);
                test.notEqual(registration['exec'], undefined);
                test.notEqual(registration['exec'], null);

                test.done();
            },

            fluentApiResolveWithArgsAttempt : function (test) {

                var container = containerBuilder.build();
                var registration = container
                    .resolveWith(testData.Test1Base)
                    .args([])
                    .attempt();

                test.strictEqual(registration['args'], undefined);
                test.strictEqual(registration['attempt'], undefined);
                test.notEqual(registration['name'], undefined);
                test.notEqual(registration['name'], null);
                test.notEqual(registration['dependencies'], undefined);
                test.notEqual(registration['dependencies'], null);
                test.notEqual(registration['cache'], undefined);
                test.notEqual(registration['cache'], null);
                test.notEqual(registration['exec'], undefined);
                test.notEqual(registration['exec'], null);

                test.done();
            },

            fluentApiResolveWithArgsAttemptName : function (test) {

                var container = containerBuilder.build();
                var registration = container
                    .resolveWith(testData.Test1Base)
                    .args([])
                    .attempt()
                    .name('');

                test.strictEqual(registration['args'], undefined);
                test.strictEqual(registration['attempt'], undefined);
                test.strictEqual(registration['name'], undefined);
                test.notEqual(registration['dependencies'], undefined);
                test.notEqual(registration['dependencies'], null);
                test.notEqual(registration['cache'], undefined);
                test.notEqual(registration['cache'], null);
                test.notEqual(registration['exec'], undefined);
                test.notEqual(registration['exec'], null);

                test.done();
            },

            fluentApiResolveWithArgsAttemptNameDependencies : function (test) {

                var container = containerBuilder.build();
                var registration = container
                    .resolveWith(testData.Test1Base)
                    .args([])
                    .attempt()
                    .name('')
                    .dependencies([]);

                test.strictEqual(registration['args'], undefined);
                test.strictEqual(registration['attempt'], undefined);
                test.strictEqual(registration['name'], undefined);
                test.notEqual(registration['dependencies'], undefined);
                test.notEqual(registration['dependencies'],null);
                test.notEqual(registration['cache'], undefined);
                test.notEqual(registration['cache'], null);
                test.notEqual(registration['exec'], undefined);
                test.notEqual(registration['exec'], null);

                test.done();
            },

            fluentApiResolveWithArgsAttemptNameDependenciesCache : function (test) {

                var container = containerBuilder.build();
                var registration = container
                    .resolveWith(testData.Test1Base)
                    .args([])
                    .attempt()
                    .name('')
                    .dependencies([])
                    .cache();

                test.strictEqual(registration['args'], undefined);
                test.strictEqual(registration['attempt'], undefined);
                test.strictEqual(registration['name'], undefined);
                test.strictEqual(registration['dependencies'], undefined);
                test.strictEqual(registration['cache'], undefined);
                test.notEqual(registration['exec'], undefined);
                test.notEqual(registration['exec'], null);

                test.done();
            }
        }
    })()
}