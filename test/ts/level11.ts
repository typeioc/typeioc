/// <reference path='../../d.ts/typeioc.addons.d.ts' />

'use strict';

import Scaffold = require('./../scaffold');
import ScaffoldAddons = require('./../scaffoldAddons');
import DataInterceptors = Scaffold.TestModuleInterceptors;
var CallInfoType = ScaffoldAddons.Interceptors.CallInfoType;

export module Level11 {

    var mockery = Scaffold.Mockery;
    var interceptor : Addons.Interceptors.IInterceptor = null;
    var containerBuilder : Typeioc.IContainerBuilder = null;

    function resolve<R>(register : R, subject : R, substitutes? : Array<Addons.Interceptors.ISubstituteInfo>) : R {

        if(!substitutes)
            substitutes = [];

        var register2 = 'test';

        containerBuilder.register(register)
            .as(c => {

                var resolution = c.resolve<R>(register2);
                return interceptor.intercept(resolution, substitutes);
            });

        containerBuilder.register(register2)
            .as(() => subject);

        var container = containerBuilder.build();
        return container.resolve<R>(register);
    }

    function setUp(callback) {
        containerBuilder = Scaffold.createBuilder();
        interceptor = ScaffoldAddons.Interceptors.create();
        callback();
    }

    export var byPrototype = {
        setUp : setUp,

        should_proxy_prototype_method : function(test) {

            var stub = mockery.stub();

            var Proto = resolve(DataInterceptors.Module1.Parent, DataInterceptors.Module1.Parent);
            var instance = new Proto(1, stub);

            test.strictEqual(1, instance.foo());
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_inherited_prototype_method : function(test) {

            var stub = mockery.stub();

            var Proto = resolve(DataInterceptors.Module2.Parent, DataInterceptors.Module2.Parent);
            var instance = new Proto(1, stub);

            test.strictEqual(1, instance.foo());
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_static_method : function(test) {

            var stub = mockery.stub();

            DataInterceptors.Module3.setStub(stub);
            var Proto = resolve(DataInterceptors.Module3.Parent, DataInterceptors.Module3.Parent);

            test.strictEqual(1, Proto.foo());
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_prototype_field : function(test) {

            var Proto = resolve(DataInterceptors.Module4.Parent, DataInterceptors.Module4.Parent);
            var instance = new Proto();

            test.strictEqual(1, instance.getFoo());
            test.strictEqual(1, instance.foo);
            instance.foo = 123;
            test.strictEqual(123, instance.foo);
            test.strictEqual(123, instance.getFoo());

            test.done();
        },

        should_proxy_static_field : function(test) {

            var Proto = resolve(DataInterceptors.Module5.Parent, DataInterceptors.Module5.Parent);

            test.strictEqual(1, Proto.getFoo());
            Proto.foo = 2;
            test.strictEqual(2, Proto.getFoo());

            test.done();
        },

        should_proxy_inherited_prototype_field : function(test) {


            var Proto = resolve(DataInterceptors.Module6.Parent, DataInterceptors.Module6.Parent);
            var instance = new Proto();

            test.strictEqual(1, instance.foo);

            test.done();
        },

        should_proxy_prototype_getter : function(test) {

            var stub = mockery.stub();

            var Proto = resolve(DataInterceptors.Module7.Parent, DataInterceptors.Module7.Parent);
            var instance = new Proto(1, stub);

            test.strictEqual(1, instance.foo);
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_prototype_setter : function(test) {

            var stub = mockery.stub();

            var Proto = resolve(DataInterceptors.Module8.Parent, DataInterceptors.Module8.Parent);
            var instance = new Proto(stub);

            instance.foo = 3;

            test.ok(stub.calledOnce);
            test.ok(stub.calledWith(3));

            test.done();
        },

        should_proxy_prototype_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();


            var Proto = resolve(DataInterceptors.Module9.Parent, DataInterceptors.Module9.Parent);
            var instance = new Proto(getStub, setStub);
            instance.foo = 3;

            test.strictEqual(4, instance.foo);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(setStub.calledWith(3));

            test.done();
        },

        should_proxy_static_getter : function(test) {

            var stub = mockery.stub();

            DataInterceptors.Module10.setStub(stub);
            var Proto = resolve(DataInterceptors.Module10.Parent, DataInterceptors.Module10.Parent);

            test.strictEqual(1, Proto.foo);
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_inherited_prototype_getter : function(test) {

            var stub = mockery.stub();

            var Proto = resolve(DataInterceptors.Module11.Parent, DataInterceptors.Module11.Parent);
            var instance = new Proto(stub, 3);

            test.strictEqual(3, instance.foo);
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_inherited_prototype_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();

            var Proto = resolve(DataInterceptors.Module12.Parent, DataInterceptors.Module12.Parent);
            var instance = new Proto(getStub, setStub);
            instance.foo = 3;

            test.strictEqual(3, instance.foo);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);

            test.done();
        },

        should_proxy_static_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();

            DataInterceptors.Module13.getStub = getStub;
            DataInterceptors.Module13.setStub = setStub;
            var Proto = resolve(DataInterceptors.Module13.Parent, DataInterceptors.Module13.Parent);
            Proto.foo = 123;

            test.strictEqual(123, Proto.foo);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);

            test.done();
        },

        should_proxy_prototype_method_with_args : function(test) {

            var stub = mockery.stub();

            var Proto = resolve(DataInterceptors.Module14.Parent, DataInterceptors.Module14.Parent);
            var instance = new Proto(stub, 1);

            test.strictEqual(6, instance.foo(2, 3));
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_inherited_prototype_method_with_args : function(test) {

            var stub = mockery.stub();

            var Proto = resolve(DataInterceptors.Module15.Parent, DataInterceptors.Module15.Parent);
            var instance = new Proto(stub);

            test.strictEqual(3, instance.foo(1, 2));
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_static_method_with_args : function(test) {

            var stub = mockery.stub();

            DataInterceptors.Module16.stub = stub;
            var Proto = resolve(DataInterceptors.Module16.Parent, DataInterceptors.Module16.Parent);

            test.strictEqual(3, Proto.foo(1, 2));
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_cross_method : function(test) {

            var fooStub = mockery.stub();
            var barStub = mockery.stub();


            var Proto = resolve(DataInterceptors.Module17.Parent, DataInterceptors.Module17.Parent);
            var instance = new Proto(barStub, fooStub);

            test.strictEqual(15, instance.foo(5));
            test.ok(fooStub.calledThrice);
            test.ok(barStub.calledThrice);

            test.done();
        },

        should_proxy_cross_method_field : function(test) {

            var fooStub = mockery.stub();

            var Proto = resolve(DataInterceptors.Module18.Parent, DataInterceptors.Module18.Parent);
            var instance = new Proto(fooStub);

            test.strictEqual(14, instance.foo(5));
            test.strictEqual(5, fooStub.callCount);

            test.done();
        },

        should_proxy_cross_method_property : function(test) {

            var fooStub = mockery.stub();
            var getStub = mockery.stub();
            var setStub = mockery.stub();

            var Proto = resolve(DataInterceptors.Module19.Parent, DataInterceptors.Module19.Parent);
            var instance = new Proto(getStub, setStub, fooStub);

            test.strictEqual(10, instance.foo());
            test.strictEqual(6, fooStub.callCount);
            test.strictEqual(16, getStub.callCount);
            test.strictEqual(5, setStub.callCount);

            test.done();
        },

        should_decorate_prototype_field : function(test) {

            var fieldStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Field,
                wrapper : function(callInfo) {

                    var args = callInfo.args;

                    fieldStub(args);

                    return 2 * callInfo.invoke(args);
                }
            };

            var Proto = resolve(DataInterceptors.Module20.Parent, DataInterceptors.Module20.Parent, [substitute]);
            var instance = new Proto();

            test.strictEqual(2, instance.foo);
            instance.foo = 12;
            test.strictEqual(24, instance.foo);
            test.ok(fieldStub.calledThrice);

            test.done();
        },

        should_decorate_prototype_method_by_name : function(test) {

            var stub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    return 2 * callInfo.invoke();
                }
            };

            var Proto = resolve(DataInterceptors.Module21.Parent, DataInterceptors.Module21.Parent, [substitute]);
            var instance = new Proto(stub, 2);

            test.strictEqual(4, instance.foo());
            test.ok(stub.calledOnce);

            test.done();
        },

        should_decorate_inherited_prototype_method : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 3 * callInfo.invoke();
                }
            };

            var Proto = resolve(DataInterceptors.Module22.Parent, DataInterceptors.Module22.Parent, [substitute]);
            var instance = new Proto(stub);

            test.strictEqual(9, instance.foo());
            test.ok(stub.calledOnce);
            test.ok(wrapperStub.calledOnce);

            test.done();
        },

        should_decorate_static_method : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 3 * callInfo.invoke();
                }
            };

            DataInterceptors.Module23.stub = stub;
            var Proto = resolve(DataInterceptors.Module23.Parent, DataInterceptors.Module23.Parent, [substitute]);

            test.strictEqual(9, Proto.foo());
            test.ok(stub.calledOnce);
            test.ok(wrapperStub.calledOnce);

            test.done();
        },

        should_decorate_prototype_method_by_chain : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    var result = callInfo.invoke(callInfo.args);
                    return 1 + callInfo.next(result);
                }
            };

            var substitute2 = {
                method : 'foo',
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                }
            };

            var Proto = resolve(DataInterceptors.Module24.Parent, DataInterceptors.Module24.Parent, [ substitute1, substitute2 ]);
            var instance = new Proto(stub, 1);

            test.strictEqual(14, instance.foo(2, 3));
            test.ok(stub.calledTwice);
            test.ok(wrapperStub.calledTwice);

            test.done();
        },

        should_decorate_prototype_method_by_chain_multi_invoke : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    var result = callInfo.invoke(callInfo.args);
                    return 1 + callInfo.next(result);
                }
            };

            var substitute2  = {
                method : 'foo',
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                }
            };

            var Proto = resolve(DataInterceptors.Module25.Parent, DataInterceptors.Module25.Parent, [ substitute1, substitute2 ]);
            var instance = new Proto(stub, 1);

            test.strictEqual(14, instance.foo(2, 3));
            test.ok(stub.calledTwice);
            test.ok(wrapperStub.calledTwice);

            test.strictEqual(14, instance.foo(2, 3));

            test.done();
        },

        should_decorate_inherited_prototype_method_by_chain : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    var result = callInfo.invoke(callInfo.args);
                    return 1 + callInfo.next(result);
                }
            };

            var substitute2 = {
                method : 'foo',
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                }
            };

            var Proto = resolve(DataInterceptors.Module26.Parent, DataInterceptors.Module26.Parent, [ substitute1, substitute2 ]);
            var instance = new Proto(stub, 1);

            test.strictEqual(14, instance.foo(2, 3));
            test.ok(stub.calledTwice);
            test.ok(wrapperStub.calledTwice);

            test.done();
        },

        should_decorate_static_method_by_chain : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    var result = callInfo.invoke(callInfo.args);
                    return 1 + callInfo.next(result);
                }
            };

            var substitute2 = {
                method : 'foo',
                wrapper : function(callInfo) {
                    wrapperStub();
                    return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                }
            };

            DataInterceptors.Module27.stub = stub;
            var Proto = resolve(DataInterceptors.Module27.Parent, DataInterceptors.Module27.Parent, [ substitute1, substitute2 ]);

            test.strictEqual(14, Proto.foo(2, 3));
            test.ok(stub.calledTwice);
            test.ok(stub.calledTwice);

            test.done();
        },

        should_decorate_prototype_getter_for_full_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Getter,
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 2 * callInfo.invoke();
                }
            };

            var Proto = resolve(DataInterceptors.Module28.Parent, DataInterceptors.Module28.Parent, [ substitute ]);
            var instance = new Proto(getStub, setStub);
            instance.foo = 2;

            var result = instance.foo;

            test.strictEqual(4, result);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(wrapperStub.calledOnce);

            test.done();
        },

        should_decorate_prototype_setter_for_full_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Setter,
                wrapper : function(callInfo) {

                    wrapperStub();
                    return callInfo.invoke(2 * callInfo.args[0]);
                }
            };

            var Proto = resolve(DataInterceptors.Module28.Parent, DataInterceptors.Module28.Parent, [ substitute ]);
            var instance = new Proto(getStub, setStub);
            instance.foo = 2;

            var result = instance.foo;

            test.strictEqual(4, result);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(wrapperStub.calledOnce);

            test.done();
        },

        should_decorate_prototype_setter : function(test) {

            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Setter,
                wrapper : function(callInfo) {

                    wrapperStub();
                    return callInfo.invoke(2 * callInfo.args[0]);
                }
            };

            var Proto = resolve(DataInterceptors.Module29.Parent, DataInterceptors.Module29.Parent, [ substitute ]);
            var instance = new Proto(setStub);
            instance.foo = 2;

            test.ok(setStub.withArgs(4).calledOnce);
            test.ok(wrapperStub.calledOnce);

            test.done();
        },

        should_decorate_with_copy_of_args : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    var args = callInfo.args;
                    args[0] = -1;

                    var result = callInfo.invoke(args);
                    return 1 + callInfo.next(result);
                }
            };

            var substitute2  = {
                method : 'foo',
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                }
            }

            DataInterceptors.Module30.stub = stub;
            var Proto = resolve(DataInterceptors.Module30.Parent, DataInterceptors.Module30.Parent, [ substitute1, substitute2 ]);

            test.strictEqual(11, Proto.foo(2, 3));
            test.ok(stub.calledTwice);
            test.ok(stub.calledTwice);

            test.done();
        },

        should_decorate_prototype_full_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();
            var getterWrapperStub = mockery.stub();
            var setterWrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.GetterSetter,
                wrapper : function(callInfo) {

                    wrapperStub();

                    if(callInfo.type == CallInfoType.Getter) {

                        getterWrapperStub();

                        return 3 + callInfo.invoke();
                    }

                    if(callInfo.type == CallInfoType.Setter) {

                        setterWrapperStub();

                        callInfo.invoke(2 * callInfo.args[0]);
                    }
                }
            };

            var Proto = resolve(DataInterceptors.Module28.Parent, DataInterceptors.Module28.Parent, [ substitute ]);
            var instance = new Proto(getStub, setStub);
            instance.foo = 2;

            var result = instance.foo;

            test.strictEqual(7, result);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(wrapperStub.calledTwice);
            test.ok(getterWrapperStub.calledOnce);
            test.ok(setterWrapperStub.calledOnce);

            test.done();
        },

        should_decorate_inherited_prototype_full_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();
            var getterWrapperStub = mockery.stub();
            var setterWrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.GetterSetter,
                wrapper : function(callInfo) {

                    wrapperStub();

                    if(callInfo.type == CallInfoType.Getter) {

                        getterWrapperStub();

                        return 3 + callInfo.invoke();
                    }

                    if(callInfo.type == CallInfoType.Setter) {

                        setterWrapperStub();

                        callInfo.invoke(2 * callInfo.args[0]);
                    }
                }
            };

            var Proto = resolve(DataInterceptors.Module31.Parent, DataInterceptors.Module31.Parent, [ substitute ]);
            var instance = new Proto(getStub, setStub);
            instance.foo = 2;

            var result = instance.foo;

            test.strictEqual(7, result);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(wrapperStub.calledTwice);
            test.ok(getterWrapperStub.calledOnce);
            test.ok(setterWrapperStub.calledOnce);

            test.done();
        },

        should_decorate_cross_method : function(test) {

            var fooStub = mockery.stub();
            var fooWrapperStub = mockery.stub();
            var barStub = mockery.stub();
            var barWrapperStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    fooWrapperStub();

                    return 1 + callInfo.invoke(callInfo.args);
                }
            };

            var substitute2 = {
                method : 'bar',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    barWrapperStub();

                    return 2 + callInfo.invoke(callInfo.args);
                }
            };

            var Proto = resolve(DataInterceptors.Module32.Parent, DataInterceptors.Module32.Parent, [ substitute1, substitute2 ]);
            var instance = new Proto(barStub, fooStub);

            test.strictEqual(12, instance.foo(3));
            test.ok(fooStub.calledTwice);
            test.ok(barStub.calledTwice);

            test.done();
        },

        should_decorate_cross_method_property : function(test) {

            var fooStub = mockery.stub();
            var fooWrapperStub = mockery.stub();
            var barStub = mockery.stub();
            var barWrapperStub = mockery.stub();

            var substitute1 = {
                method : 'bar',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    barWrapperStub();

                    return 1 + callInfo.invoke(callInfo.args);
                }
            };

            var substitute2 = {
                method : 'foo',
                type : CallInfoType.Getter,
                wrapper : function(callInfo) {

                    fooWrapperStub();

                    return 2 + callInfo.invoke();
                }
            };

            var Proto = resolve(DataInterceptors.Module33.Parent, DataInterceptors.Module33.Parent, [ substitute1, substitute2 ]);
            var instance = new Proto(barStub, fooStub);

            test.strictEqual(19, instance.bar(3));
            test.strictEqual(3, fooStub.callCount);
            test.strictEqual(3, fooWrapperStub.callCount);
            test.strictEqual(4, barStub.callCount);
            test.strictEqual(4, barWrapperStub.callCount);

            test.done();
        },

        should_decorate_static_full_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();
            var getterWrapperStub = mockery.stub();
            var setterWrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.GetterSetter,
                wrapper : function(callInfo) {

                    wrapperStub();

                    if(callInfo.type == CallInfoType.Getter) {

                        getterWrapperStub();

                        return 3 + callInfo.invoke();
                    }

                    if(callInfo.type == CallInfoType.Setter) {

                        setterWrapperStub();

                        callInfo.invoke(2 * callInfo.args[0]);
                    }
                }
            };

            DataInterceptors.Module34.getStub = getStub;
            DataInterceptors.Module34.setStub = setStub;
            var Proto = resolve(DataInterceptors.Module34.Parent, DataInterceptors.Module34.Parent, [ substitute ]);
            Proto.foo = 2;

            var result = Proto.foo;

            test.strictEqual(7, result);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(wrapperStub.calledTwice);
            test.ok(getterWrapperStub.calledOnce);
            test.ok(setterWrapperStub.calledOnce);

            test.done();
        },

        should_decorate_cross_static_full_property : function(test) {

            var getBarStub = mockery.stub();
            var setBarStub = mockery.stub();

            var getterWrapperFooStub = mockery.stub();
            var setterWrapperFooStub = mockery.stub();

            var getFooStub = mockery.stub();
            var setFooStub = mockery.stub();

            var getterWrapperBarStub = mockery.stub();
            var setterWrapperBarStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.GetterSetter,
                wrapper : function(callInfo) {

                    if(callInfo.type == CallInfoType.Getter) {

                        getterWrapperFooStub();

                        return 3 + callInfo.invoke();
                    }

                    if(callInfo.type == CallInfoType.Setter) {

                        setterWrapperFooStub();

                        callInfo.invoke(2 * callInfo.args[0]);
                    }
                }
            };

            var substitute2 = {
                method : 'bar',
                type : CallInfoType.GetterSetter,
                wrapper : function(callInfo) {

                    if(callInfo.type == CallInfoType.Getter) {

                        getterWrapperBarStub();

                        return 1 + callInfo.invoke();
                    }

                    if(callInfo.type == CallInfoType.Setter) {

                        setterWrapperBarStub();

                        callInfo.invoke(3 * callInfo.args[0]);
                    }
                }
            };

            DataInterceptors.Module35.getBarStub = getBarStub;
            DataInterceptors.Module35.setBarStub = setBarStub;
            DataInterceptors.Module35.getFooStub = getFooStub;
            DataInterceptors.Module35.setFooStub = setFooStub;
            var Proto = resolve(DataInterceptors.Module35.Parent, DataInterceptors.Module35.Parent, [ substitute1, substitute2 ]);
            Proto.foo = 2;
            Proto.bar = 2;

            var resultFoo = Proto.foo;
            var resultBar = Proto.bar;

            test.strictEqual(7, resultFoo);
            test.strictEqual(11, resultBar);

            test.strictEqual(1, getBarStub.callCount);
            test.strictEqual(2, setBarStub.callCount);

            test.strictEqual(1, getterWrapperFooStub.callCount);
            test.strictEqual(1, setterWrapperFooStub.callCount);

            test.strictEqual(2, getFooStub.callCount);
            test.strictEqual(1, setFooStub.callCount);

            test.strictEqual(1, getterWrapperBarStub.callCount);
            test.strictEqual(1, setterWrapperBarStub.callCount);

            test.done();
         }
    }

    export var byInstance = {
        setUp : setUp,

        should_proxy_prototype_method : function(test) {

            var stub = mockery.stub();

            var object = new DataInterceptors.Module1.Parent(1, stub);
            var instance = resolve(DataInterceptors.Module1.Parent, object);

            test.strictEqual(1, instance.foo());
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_inherited_prototype_method : function(test) {

            var stub = mockery.stub();

            var object = new DataInterceptors.Module2.Parent(1, stub);
            var instance = resolve(DataInterceptors.Module2.Parent, object);

            test.strictEqual(1, instance.foo());
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_prototype_field : function(test) {

            var object = new DataInterceptors.Module4.Parent();
            var instance = resolve(DataInterceptors.Module4.Parent, object);

            test.strictEqual(1, instance.getFoo());
            test.strictEqual(1, instance.foo);
            instance.foo = 123;
            test.strictEqual(123, instance.foo);
            test.strictEqual(123, instance.getFoo());

            test.done();
        },

        should_proxy_inherited_prototype_field : function(test) {

            var object = new DataInterceptors.Module6.Parent();
            var instance = resolve(DataInterceptors.Module6.Parent, object);

            test.strictEqual(1, instance.foo);

            test.done();
        },

        should_proxy_prototype_getter : function(test) {

            var stub = mockery.stub();

            var object = new DataInterceptors.Module7.Parent(1, stub);
            var instance = resolve(DataInterceptors.Module7.Parent, object);

            test.strictEqual(1, instance.foo);
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_prototype_setter : function(test) {

            var stub = mockery.stub();

            var object = new DataInterceptors.Module8.Parent(stub);
            var instance = resolve(DataInterceptors.Module8.Parent, object);

            instance.foo = 3;

            test.ok(stub.calledOnce);
            test.ok(stub.calledWith(3));

            test.done();
        },

        should_proxy_prototype_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();

            var object = new DataInterceptors.Module9.Parent(getStub, setStub);
            var instance = resolve(DataInterceptors.Module9.Parent, object);
            instance.foo = 3;

            test.strictEqual(4, instance.foo);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(setStub.calledWith(3));

            test.done();
        },

        should_proxy_inherited_prototype_getter : function(test) {

            var stub = mockery.stub();

            var object = new DataInterceptors.Module11.Parent(stub, 3);
            var instance = resolve(DataInterceptors.Module11.Parent, object);

            test.strictEqual(3, instance.foo);
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_inherited_prototype_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();

            var object = new DataInterceptors.Module12.Parent(getStub, setStub);
            var instance = resolve(DataInterceptors.Module12.Parent, object);
            instance.foo = 3;

            test.strictEqual(3, instance.foo);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);

            test.done();
        },

        should_proxy_prototype_method_with_args : function(test) {

            var stub = mockery.stub();

            var object = new DataInterceptors.Module14.Parent(stub, 1);
            var instance = resolve(DataInterceptors.Module14.Parent, object);

            test.strictEqual(6, instance.foo(2, 3));
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_inherited_prototype_method_with_args : function(test) {

            var stub = mockery.stub();

            var object = new DataInterceptors.Module15.Parent(stub);
            var instance = resolve(DataInterceptors.Module15.Parent, object);

            test.strictEqual(3, instance.foo(1, 2));
            test.ok(stub.calledOnce);

            test.done();
        },

        should_proxy_cross_method : function(test) {

            var fooStub = mockery.stub();
            var barStub = mockery.stub();

            var object = new DataInterceptors.Module17.Parent(barStub, fooStub);
            var instance = resolve(DataInterceptors.Module17.Parent, object);

            test.strictEqual(15, instance.foo(5));
            test.ok(fooStub.calledThrice);
            test.ok(barStub.calledThrice);

            test.done();
        },

        should_proxy_cross_method_field : function(test) {

            var fooStub = mockery.stub();

            var object = new DataInterceptors.Module18.Parent(fooStub);
            var instance = resolve(DataInterceptors.Module18.Parent, object);

            test.strictEqual(14, instance.foo(5));
            test.strictEqual(5, fooStub.callCount);

            test.done();
        },

        should_proxy_cross_method_property : function(test) {

            var fooStub = mockery.stub();
            var getStub = mockery.stub();
            var setStub = mockery.stub();

            var object = new DataInterceptors.Module19.Parent(getStub, setStub, fooStub);
            var instance = resolve(DataInterceptors.Module19.Parent, object);

            test.strictEqual(10, instance.foo());
            test.strictEqual(6, fooStub.callCount);
            test.strictEqual(16, getStub.callCount);
            test.strictEqual(5, setStub.callCount);

            test.done();
        },

        should_decorate_prototype_field : function(test) {

            var fieldStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Field,
                wrapper : function(callInfo) {

                    var args = callInfo.args;

                    fieldStub(args);

                    return 2 * callInfo.invoke(args);
                }
            };

            var object = new DataInterceptors.Module20.Parent();
            var instance = resolve(DataInterceptors.Module20.Parent, object, [substitute]);

            test.strictEqual(2, instance.foo);
            instance.foo = 12;
            test.strictEqual(24, instance.foo);
            test.ok(fieldStub.calledThrice);

            test.done();
        },

        should_decorate_prototype_method_by_name : function(test) {

            var stub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    return 2 * callInfo.invoke();
                }
            };

            var object = new DataInterceptors.Module21.Parent(stub, 2);
            var instance = resolve(DataInterceptors.Module21.Parent, object, [substitute]);

            test.strictEqual(4, instance.foo());
            test.ok(stub.calledOnce);

            test.done();
        },

        should_decorate_inherited_prototype_method : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 3 * callInfo.invoke();
                }
            };

            var object = new DataInterceptors.Module22.Parent(stub);
            var instance = resolve(DataInterceptors.Module22.Parent, object, [substitute]);

            test.strictEqual(9, instance.foo());
            test.ok(stub.calledOnce);
            test.ok(wrapperStub.calledOnce);

            test.done();
        },

        should_decorate_prototype_method_by_chain : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    var result = callInfo.invoke(callInfo.args);
                    return 1 + callInfo.next(result);
                }
            };

            var substitute2 = {
                method : 'foo',
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                }
            };

            var object = new DataInterceptors.Module24.Parent(stub, 1);
            var instance = resolve(DataInterceptors.Module24.Parent, object, [ substitute1, substitute2 ]);

            test.strictEqual(14, instance.foo(2, 3));
            test.ok(stub.calledTwice);
            test.ok(wrapperStub.calledTwice);

            test.done();
        },

        should_decorate_prototype_method_by_chain_multi_invoke : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    var result = callInfo.invoke(callInfo.args);
                    return 1 + callInfo.next(result);
                }
            };

            var substitute2  = {
                method : 'foo',
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                }
            };

            var object = new DataInterceptors.Module25.Parent(stub,1);
            var instance = resolve(DataInterceptors.Module25.Parent, object, [ substitute1, substitute2 ]);

            test.strictEqual(14, instance.foo(2, 3));
            test.ok(stub.calledTwice);
            test.ok(wrapperStub.calledTwice);

            test.strictEqual(14, instance.foo(2, 3));

            test.done();
        },

        should_decorate_inherited_prototype_method_by_chain : function(test) {

            var stub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    wrapperStub();
                    var result = callInfo.invoke(callInfo.args);
                    return 1 + callInfo.next(result);
                }
            };

            var substitute2 = {
                method : 'foo',
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 1 + callInfo.result + callInfo.invoke(callInfo.args);            
                }
            };

            var object = new DataInterceptors.Module26.Parent(stub, 1);
            var instance = resolve(DataInterceptors.Module26.Parent, object, [ substitute1, substitute2 ]);

            test.strictEqual(14, instance.foo(2, 3));
            test.ok(stub.calledTwice);
            test.ok(wrapperStub.calledTwice);

            test.done();
        },

        should_decorate_prototype_getter_for_full_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Getter,
                wrapper : function(callInfo) {

                    wrapperStub();
                    return 2 * callInfo.invoke();
                }
            };

            var object = new DataInterceptors.Module28.Parent(getStub, setStub);
            var instance = resolve(DataInterceptors.Module28.Parent, object, [ substitute ]);
            instance.foo = 2;

            var result = instance.foo;

            test.strictEqual(4, result);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(wrapperStub.calledOnce);

            test.done();
        },

        should_decorate_prototype_setter_for_full_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Setter,
                wrapper : function(callInfo) {

                    wrapperStub();
                    return callInfo.invoke(2 * callInfo.args[0]);
                }
            };

            var object = new DataInterceptors.Module28.Parent(getStub, setStub);
            var instance = resolve(DataInterceptors.Module28.Parent, object, [ substitute ]);
             instance.foo = 2;

            var result = instance.foo;

            test.strictEqual(4, result);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(wrapperStub.calledOnce);

            test.done();
        },

        should_decorate_prototype_setter : function(test) {

            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.Setter,
                wrapper : function(callInfo) {

                    wrapperStub();
                    return callInfo.invoke(2 * callInfo.args[0]);
                }
            };

            var object = new DataInterceptors.Module29.Parent(setStub);
            var instance = resolve(DataInterceptors.Module29.Parent, object, [ substitute ]);
             instance.foo = 2;

            test.ok(setStub.withArgs(4).calledOnce);
            test.ok(wrapperStub.calledOnce);

            test.done();
        },

        should_decorate_prototype_full_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();
            var getterWrapperStub = mockery.stub();
            var setterWrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.GetterSetter,
                wrapper : function(callInfo) {

                    wrapperStub();

                    if(callInfo.type == CallInfoType.Getter) {

                        getterWrapperStub();

                        return 3 + callInfo.invoke();
                    }

                    if(callInfo.type == CallInfoType.Setter) {

                        setterWrapperStub();

                        callInfo.invoke(2 * callInfo.args[0]);
                    }
                }
            };

            var object = new DataInterceptors.Module28.Parent(getStub, setStub);
            var instance = resolve(DataInterceptors.Module28.Parent, object, [ substitute ]);
            instance.foo = 2;

            var result = instance.foo;

            test.strictEqual(7, result);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(wrapperStub.calledTwice);
            test.ok(getterWrapperStub.calledOnce);
            test.ok(setterWrapperStub.calledOnce);

            test.done();
        },

        should_decorate_inherited_prototype_full_property : function(test) {

            var getStub = mockery.stub();
            var setStub = mockery.stub();
            var wrapperStub = mockery.stub();
            var getterWrapperStub = mockery.stub();
            var setterWrapperStub = mockery.stub();

            var substitute = {
                method : 'foo',
                type : CallInfoType.GetterSetter,
                wrapper : function(callInfo) {

                    wrapperStub();

                    if(callInfo.type == CallInfoType.Getter) {

                        getterWrapperStub();

                        return 3 + callInfo.invoke();
                    }

                    if(callInfo.type == CallInfoType.Setter) {

                        setterWrapperStub();

                        callInfo.invoke(2 * callInfo.args[0]);
                    }
                }
            };

            var object = new DataInterceptors.Module31.Parent(getStub, setStub);
            var instance = resolve(DataInterceptors.Module31.Parent, object, [ substitute ]);
             instance.foo = 2;

            var result = instance.foo;

            test.strictEqual(7, result);
            test.ok(getStub.calledOnce);
            test.ok(setStub.calledOnce);
            test.ok(wrapperStub.calledTwice);
            test.ok(getterWrapperStub.calledOnce);
            test.ok(setterWrapperStub.calledOnce);

            test.done();
        },

        should_decorate_cross_method : function(test) {

            var fooStub = mockery.stub();
            var fooWrapperStub = mockery.stub();
            var barStub = mockery.stub();
            var barWrapperStub = mockery.stub();

            var substitute1 = {
                method : 'foo',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    fooWrapperStub();

                    return 1 + callInfo.invoke(callInfo.args);
                }
            };

            var substitute2 = {
                method : 'bar',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    barWrapperStub();

                    return 2 + callInfo.invoke(callInfo.args);
                }
            };

            var object = new DataInterceptors.Module32.Parent(barStub, fooStub);
            var instance = resolve(DataInterceptors.Module32.Parent, object, [ substitute1, substitute2 ]);

            test.strictEqual(12, instance.foo(3));
            test.ok(fooStub.calledTwice);
            test.ok(barStub.calledTwice);

            test.done();
        },

        should_decorate_cross_method_property : function(test) {

            var fooStub = mockery.stub();
            var fooWrapperStub = mockery.stub();
            var barStub = mockery.stub();
            var barWrapperStub = mockery.stub();

            var substitute1 = {
                method : 'bar',
                type : CallInfoType.Method,
                wrapper : function(callInfo) {

                    barWrapperStub();

                    return 1 + callInfo.invoke(callInfo.args);
                }
            };

            var substitute2 = {
                method : 'foo',
                type : CallInfoType.Getter,
                wrapper : function(callInfo) {

                    fooWrapperStub();

                    return 2 + callInfo.invoke();
                }
            };

            var object = new DataInterceptors.Module33.Parent(barStub, fooStub);
            var instance = resolve(DataInterceptors.Module33.Parent, object, [ substitute1, substitute2 ]);

            test.strictEqual(19, instance.bar(3));
            test.strictEqual(3, fooStub.callCount);
            test.strictEqual(3, fooWrapperStub.callCount);
            test.strictEqual(4, barStub.callCount);
            test.strictEqual(4, barWrapperStub.callCount);

            test.done();
        },

        should_decorate: function(test) {
            
            const math = interceptor.intercept(Math, [{
                    wrapper : (callInfo) => callInfo.next(`${callInfo.result} 2`)
                }, {
                    method: 'pow',
                    wrapper : (callInfo) => callInfo.next(callInfo.args[0] + callInfo.args[1])
                }, {
                    wrapper : (callInfo) => `${callInfo.result} 3`
                }, {
                    method: 'pow',
                    wrapper : (callInfo) => callInfo.next(`${callInfo.result} 1`)
                }, {
                    method: 'round',
                    wrapper : (callInfo) => callInfo.next(callInfo.args[0])
                }
            ]);
           
            test.strictEqual('5 1 2 3', math.pow(2, 3));
            test.strictEqual('5.777 2 3', math.round(5.777));
            test.done();
        }
    }
}