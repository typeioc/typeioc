/// <reference path='../../d.ts/typeioc.addons.d.ts' />

'use strict';

import Scaffold = require('./../scaffold');
import ScaffoldAddons = require('./../scaffoldAddons');
import DataInterceptors = Scaffold.TestModuleInterceptors;
var CallInfoType = Scaffold.Types.CallInfoType;

export module Level12 {

    var interceptor: Addons.Interceptors.IInterceptor = null;
    var containerBuilder: Typeioc.IContainerBuilder = null;

    function resolve<R>(register: R, subject: R, substitutes?: Array<Addons.Interceptors.ISubstituteInfo>):R {

        if (!substitutes)
            substitutes = [];

        var register2 = 'test';

        containerBuilder.register(register)
            .as(c => {

                var resolution = c.resolve(register2);
                return interceptor.intercept(resolution, substitutes);
            });

        containerBuilder.register(register2)
            .as(() => subject);

        var container = containerBuilder.build();
        return container.resolve(register);
    }

    function resolveByPrototype<R>(register:R, subject:R, substitutes?:Array<Addons.Interceptors.ISubstituteInfo>):R {

        if (!substitutes)
            substitutes = [];

        var register2 = 'test';

        containerBuilder.register(register)
            .as(c => {

                var resolution = c.resolve(register2);
                return interceptor.interceptPrototype(resolution, substitutes);
            });

        containerBuilder.register(register2)
            .as(() => subject);

        var container = containerBuilder.build();
        return container.resolve(register);
    }

    function resolveByInstance<R>(register:R, subject:R, substitutes?:Array<Addons.Interceptors.ISubstituteInfo>):R {

        if (!substitutes)
            substitutes = [];

        var register2 = 'test';

        containerBuilder.register(register)
            .as(c => {

                var resolution = c.resolve(register2);
                return interceptor.interceptInstance(resolution, substitutes);
            });

        containerBuilder.register(register2)
            .as(() => subject);

        var container = containerBuilder.build();
        return container.resolve(register);
    }

    function setUp(callback) {
        containerBuilder = Scaffold.createBuilder();
        interceptor = ScaffoldAddons.interceptor();
        callback();
    }

    export var byPrototype = {
        setUp: setUp,

        should_decorate_recursive_method: function (test) {

            var Proto = resolve(DataInterceptors.Module36.Parent, DataInterceptors.Module36.Parent);
            var instance = new Proto(-1);

            test.strictEqual(6, instance.rec(3));
            test.strictEqual(1, instance.start);

            test.done();
        },

        should_proxy_recursive_method_by_override: function(test) {

            var substitute = {
                method: 'rec',
                wrapper : function(callInfo) {
                    return callInfo.args[0] + 1;
                }
            };

            var Proto = resolve(DataInterceptors.Module36.Parent, DataInterceptors.Module36.Parent, [ substitute ]);
            var instance = new Proto(-1);

            test.strictEqual(4, instance.rec(3));
            test.strictEqual(-1, instance.start);

            test.done();
        },

        should_proxy_recursive_method: function(test) {

            var substitute = {
                method: 'rec',
                wrapper : function(callInfo) {
                    callInfo.args[0]--;

                    return callInfo.invoke(callInfo.args);
                }
            };

            var Proto = resolve(DataInterceptors.Module36.Parent, DataInterceptors.Module36.Parent, [ substitute ]);
            var instance = new Proto(-1);

            test.strictEqual(2, instance.rec(3));
            test.strictEqual(2, instance.start);

            test.done();
        },

        should_proxy_recursive_property: function(test) {

            var Proto = resolve(DataInterceptors.Module37.Parent, DataInterceptors.Module37.Parent);

            var instance = new Proto(0);
            instance.foo = 10;

            test.strictEqual(1, instance.start);

            instance.start = 10;
            test.strictEqual(0, instance.foo);

            test.done();
        },


        should_decorate_recursive_property_by_override: function(test) {

            var substitute = {
                method : 'foo',
                wrapper : function(callInfo) {
                    if(callInfo.type === CallInfoType.Getter) {
                        return 3;
                    }

                    if(callInfo.type === CallInfoType.Setter) {
                        this.start = 11;
                    }
                }
            };

            var Proto = resolve(DataInterceptors.Module37.Parent, DataInterceptors.Module37.Parent, [ substitute ]);

            var instance = new Proto(0);
            instance.foo = 10;

            test.strictEqual(11, instance.start);

            instance.start = 10;
            test.strictEqual(3, instance.foo);

            test.done();
        },

        should_decorate_recursive_property: function(test) {

            var substitute = {
                method : 'foo',
                wrapper : function(callInfo) {
                    if(callInfo.type === CallInfoType.Getter) {

                        if(this.start === 3) {
                            return this.start * this.start;
                        }
                        this.start--;
                        return this.foo;
                    }

                    if(callInfo.type === CallInfoType.Setter) {

                        callInfo.invoke([3]);
                    }
                }
            };

            var Proto = resolve(DataInterceptors.Module37.Parent, DataInterceptors.Module37.Parent, [ substitute ]);
            var instance = new Proto(0);
            instance.foo = 10;

            test.strictEqual(1, instance.start);

            instance.start = 10;
            test.strictEqual(9, instance.foo);

            test.done();
        },

        should_use_get_set_for_callInfo_invoke: function(test) {

            var substitute = {
                method : 'foo',
                wrapper : function(callInfo) {
                    if(callInfo.type === CallInfoType.Getter) {
                        return callInfo.get() + 1;
                    }

                    if(callInfo.type === CallInfoType.Setter) {

                        callInfo.set(callInfo.args[0] + 1);
                    }
                }
            };

            var Proto = resolve(DataInterceptors.Module38.Parent, DataInterceptors.Module38.Parent, [ substitute ]);
            var instance = new Proto(0);
            instance.foo = 10;

            test.strictEqual(11, instance.start);
            test.strictEqual(12, instance.foo);

            test.done();
        },


        should_set_get_and_set_to_null_form_method : function(test) {

            var substitute = {
                method : 'foo',
                wrapper : function(callInfo) {

                    test.strictEqual(null, callInfo.get);
                    test.strictEqual(null, callInfo.set);
                }
            };

            var Proto = resolve(DataInterceptors.Module39.Parent, DataInterceptors.Module39.Parent, [ substitute ]);
            var instance = new Proto(0);
            instance.foo();

            test.expect(2);

            test.done();
        },

        should_call_invoke_with_non_array_parameter : function(test) {

            var substitute = {
                method : 'foo',
                wrapper : function(callInfo) {

                    return callInfo.invoke(callInfo.args[0]) + callInfo.invoke(callInfo.args);
                }
            };

            var Proto = resolve(DataInterceptors.Module40.Parent, DataInterceptors.Module40.Parent, [ substitute ]);
            var instance = new Proto(0);

            test.strictEqual(200, instance.foo(100));
            test.strictEqual(100, instance.start);

            test.done();
        },

        should_call_set_with_exact_value: function(test) {

            var substitute = {
                method : 'foo',
                type : CallInfoType.Setter,
                wrapper : function(callInfo) {
                    callInfo.set(callInfo.args);
                }
            };

            var Proto = resolve(DataInterceptors.Module38.Parent, DataInterceptors.Module38.Parent, [ substitute ]);
            var instance = new Proto(0);
            instance.foo = 10;

            test.strictEqual(10, instance.start[0]);

            test.done();
        },

        should_resolve_by_prototype_method_with_args_value: function(test) {

            var substitute = {
                method : 'foo',
                wrapper : function(callInfo) {

                    return callInfo.invoke(callInfo.args[0]) + callInfo.invoke(callInfo.args);
                }
            };

            var Proto = resolve(DataInterceptors.Module40.Parent, DataInterceptors.Module40.Parent, [ substitute ]);
            var instance = new Proto(0);

            test.strictEqual(200, instance.foo(100));
            test.strictEqual(100, instance.start);

            test.done();
        },

        should_decorate_triple_proxy: function(test) {

            var substitute = {
                method : 'foo',
                wrapper : function(callInfo) {

                    var result = callInfo.invoke(callInfo.args);

                    return callInfo.next(result);
                }
            };

            var substitute1 = {
                method : 'foo',
                wrapper : function(callInfo) {

                    var result = callInfo.invoke(callInfo.args);

                    return callInfo.next(callInfo.result + result);
                }
            };

            var substitute2 = {
                method : 'foo',
                wrapper : function(callInfo) {

                    return callInfo.invoke(callInfo.args) + callInfo.result + 1.5;
                }
            };

            var Proto = resolve(DataInterceptors.Module41.Parent, DataInterceptors.Module41.Parent, [ substitute, substitute1, substitute2 ]);
            var instance = new Proto(1);

            test.strictEqual(7.5, instance.foo(1));

            test.done();
        },

        should_decorate_100_method_proxies: function(test) {

            var substitutes = [];
            var index = 0;
            var limit = 100;
            var acc = new DataInterceptors.Module42.Accumulator(0);
            while(substitutes.length < limit) {

                substitutes.push({
                    method: 'foo',
                    wrapper : function(callInfo) {

                        index++;
                        acc.add(index);
                        return callInfo.invoke(index) + (index === limit ? 0 : callInfo.next());
                    }
                });
            }

            var Proto = resolve(DataInterceptors.Module42.Parent, DataInterceptors.Module42.Parent, substitutes);
            var instance = new Proto();

            var actual = instance.foo(1);
            test.strictEqual(acc.start, actual);


            test.done();
        }
    }
}
