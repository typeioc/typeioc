
'use strict';

exports.internal = {

    proxy: (function () {

        var Scaffold = require('../../scaffold');
        var ProxyModule = require('./../../../lib/interceptors/proxy');
        var mockery = Scaffold.Mockery;

        var proxy;

        return {

            setUp: function (callback) {

                proxy = new ProxyModule.Proxy();

                callback();
            },

            fromPrototype_should_decorate_prototype_method_by_name : function(test) {

                var stub = mockery.stub();

                function parent(arg1) {
                    this.arg1 = arg1;
                }

                parent.prototype.foo = function(){
                    stub();
                    return this.arg1;
                };

                var substitute = {
                    method : 'foo',
                    type : Scaffold.Types.CallInfoType.Method,
                    wrapper : function(callInfo) {

                        return 2 * callInfo.invoke();
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto(2);

                test.strictEqual(4, instance.foo());
                test.ok(stub.calledOnce);

                test.done();
            },

            fromPrototype_should_decorate_prototype_method_by_function : function(test) {

                var stub = mockery.stub();
                var wrapperStub = mockery.stub();

                function parent(arg1) {
                    this.arg1 = arg1;
                }

                parent.prototype.foo = function(){
                    stub();
                    return this.arg1;
                };

                var substitute = {
                    method : parent.prototype.foo,
                    type : Scaffold.Types.CallInfoType.Method,
                    wrapper : function(callInfo) {

                        wrapperStub();
                        return 2 * callInfo.invoke();
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto(2);

                test.strictEqual(4, instance.foo());
                test.ok(stub.calledOnce);
                test.ok(wrapperStub.calledOnce);

                test.done();
            },

            fromPrototype_should_throw_when_wrong_substitute_type_for_function : function(test) {

                var stub = mockery.stub();
                var wrapperStub = mockery.stub();

                function parent(arg1) {
                    this.arg1 = arg1;
                }

                parent.prototype.foo = function() {
                    stub();
                    return this.arg1;
                };

                var substitute = {
                    type: Scaffold.Types.CallInfoType.Getter,
                    method : parent.prototype.foo,
                    wrapper : function(callInfo) {
                        wrapperStub();
                        return 2 * callInfo.invoke();
                    }
                };

                var delegate = function() { proxy.fromPrototype(parent, [ substitute ]); };

                test.throws(delegate, function(error) {
                    test.strictEqual(error.message, 'Could not match proxy type and property type');
                    test.strictEqual(error.data.method, 'foo');
                    test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.Getter);
                    return error instanceof Scaffold.Exceptions.ProxyError;
                });

                test.strictEqual(0, stub.callCount);
                test.strictEqual(0, wrapperStub.callCount);

                test.expect(6);
                test.done();
            },

            fromPrototype_should_decorate_inherited_prototype_method : function(test) {

                var stub = mockery.stub();
                var wrapperStub = mockery.stub();

                var grandParent = { foo : function() { stub(); return 3;} };

                function parent() { }
                parent.prototype = grandParent;

                var substitute = {
                    method : parent.prototype.foo,
                    type : Scaffold.Types.CallInfoType.Method,
                    wrapper : function(callInfo) {

                        wrapperStub();
                        return 3 * callInfo.invoke();
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto();

                test.strictEqual(9, instance.foo());
                test.ok(stub.calledOnce);
                test.ok(wrapperStub.calledOnce);

                test.done();
            },

            fromPrototype_should_decorate_static_method : function(test) {

                var stub = mockery.stub();
                var wrapperStub = mockery.stub();

                function parent() { }
                parent.foo = function() { stub(); return 3; }

                var substitute = {
                    method : parent.foo,
                    type : Scaffold.Types.CallInfoType.Method,
                    wrapper : function(callInfo) {

                        wrapperStub();
                        return 3 * callInfo.invoke();
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);

                test.strictEqual(9, Proto.foo());
                test.ok(stub.calledOnce);
                test.ok(wrapperStub.calledOnce);

                test.done();
            },

            fromPrototype_should_decorate_prototype_method_by_chain : function(test) {

                var stub = mockery.stub();
                var wrapperStub = mockery.stub();

                function parent(arg1) {
                    this.arg1 = arg1;
                }

                parent.prototype.foo = function(arg2, arg3) {

                    stub();
                    return this.arg1 + arg2 + arg3;
                };

                var substitute = {
                    method : 'foo',
                    type : Scaffold.Types.CallInfoType.Method,
                    wrapper : function(callInfo) {

                        wrapperStub();
                        var result = callInfo.invoke(callInfo.args);
                        return 1 + callInfo.next(result);
                    }
                };

                substitute.next = {
                    wrapper : function(callInfo) {

                        wrapperStub();
                        return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                    }
                }

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto(1);

                test.strictEqual(14, instance.foo(2, 3));
                test.ok(stub.calledTwice);
                test.ok(wrapperStub.calledTwice);

                test.done();
            },

            fromPrototype_should_decorate_inherited_prototype_method_by_chain : function(test) {

                var stub = mockery.stub();
                var wrapperStub = mockery.stub();

                var grandParent = function() {};
                grandParent.foo = function(arg2, arg3) { stub(); return this.arg1 + arg2 + arg3;}


                function parent(arg1) {
                    this.arg1 = arg1;
                }

                parent.prototype = grandParent;

                var substitute = {
                    method : 'foo',
                    type : Scaffold.Types.CallInfoType.Method,
                    wrapper : function(callInfo) {

                        wrapperStub();

                        var result = callInfo.invoke(callInfo.args);
                        return 1 + callInfo.next(result);
                    }
                };

                substitute.next = {
                    wrapper : function(callInfo) {

                        wrapperStub();

                        return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                    }
                }

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto(1);

                test.strictEqual(14, instance.foo(2, 3));
                test.ok(stub.calledTwice);
                test.ok(wrapperStub.calledTwice);

                test.done();
            },

            fromPrototype_should_decorate_static_method_by_chain : function(test) {

                var stub = mockery.stub();
                var wrapperStub = mockery.stub();

                function parent() {}

                parent.foo = function(arg1, arg2) {
                    stub();
                    return 1 + arg1 + arg2;
                };

                var substitute = {
                    method : 'foo',
                    type : Scaffold.Types.CallInfoType.Method,
                    wrapper : function(callInfo) {

                        wrapperStub();
                        var result = callInfo.invoke(callInfo.args);
                        return 1 + callInfo.next(result);
                    }
                };

                substitute.next = {
                    wrapper : function(callInfo) {

                        wrapperStub();
                        return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                    }
                }

                var Proto = proxy.fromPrototype(parent, [ substitute ]);

                test.strictEqual(14, Proto.foo(2, 3));
                test.ok(stub.calledTwice);
                test.ok(stub.calledTwice);

                test.done();
            },

            fromPrototype_should_proxy_prototype_getter_for_full_property : function(test) {

                var getStub = mockery.stub();
                var setStub = mockery.stub();
                var wrapperStub = mockery.stub();

                function parent() {
                    this._innerValue = undefined;
                }

                Object.defineProperty(parent.prototype, 'foo', {
                    get : function() {
                        getStub();
                        return this._innerValue;
                    },
                    set: function (value) {

                        setStub();
                        this._innerValue = value;
                    },
                    enumerable: true,
                    configurable: true
                });

                var substitute = {
                    method : 'foo',
                    type : Scaffold.Types.CallInfoType.Getter,
                    wrapper : function(callInfo) {

                        wrapperStub();
                        return 2 * callInfo.invoke();
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto();
                instance.foo = 2;

                var result = instance.foo;

                test.strictEqual(4, result);
                test.ok(getStub.calledOnce);
                test.ok(setStub.calledOnce);
                test.ok(wrapperStub.calledOnce);

                test.done();
            },

            fromPrototype_should_proxy_prototype_setter_for_full_property : function(test) {

                var getStub = mockery.stub();
                var setStub = mockery.stub();
                var wrapperStub = mockery.stub();

                function parent() {
                    this._innerValue = undefined;
                }

                Object.defineProperty(parent.prototype, 'foo', {
                    get : function() {
                        getStub();
                        return this._innerValue;
                    },
                    set: function (value) {

                        setStub();
                        this._innerValue = value;
                    },
                    enumerable: true,
                    configurable: true
                });

                var substitute = {
                    method : 'foo',
                    type : Scaffold.Types.CallInfoType.Setter,
                    wrapper : function(callInfo) {

                        wrapperStub();
                        return callInfo.invoke(2 * callInfo.args[0]);
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto();
                instance.foo = 2;

                var result = instance.foo;

                test.strictEqual(4, result);
                test.ok(getStub.calledOnce);
                test.ok(setStub.calledOnce);
                test.ok(wrapperStub.calledOnce);

                test.done();
            },

            fromPrototype_should_have_copy_of_args : function(test) {

                var stub = mockery.stub();
                var wrapperStub = mockery.stub();

                function parent() {}

                parent.foo = function(arg1, arg2) {
                    stub();
                    return 1 + arg1 + arg2;
                };

                var substitute = {
                    method : 'foo',
                    type : Scaffold.Types.CallInfoType.Method,
                    wrapper : function(callInfo) {

                        wrapperStub();

                        var args = callInfo.args;
                        args[0] = -1;

                        var result = callInfo.invoke(args);
                        return 1 + callInfo.next(result);
                    }
                };

                substitute.next = {
                    wrapper : function(callInfo) {

                        wrapperStub();

                        return 1 + callInfo.result + callInfo.invoke(callInfo.args);
                    }
                }

                var Proto = proxy.fromPrototype(parent, [ substitute ]);

                test.strictEqual(11, Proto.foo(2, 3));
                test.ok(stub.calledTwice);
                test.ok(stub.calledTwice);

                test.done();
            },

            fromPrototype_should_proxy_prototype_full_property : function(test) {

                var getStub = mockery.stub();
                var setStub = mockery.stub();
                var wrapperStub = mockery.stub();
                var getterWrapperStub = mockery.stub();
                var setterWrapperStub = mockery.stub();

                function parent() {
                    this._innerValue = undefined;
                }

                Object.defineProperty(parent.prototype, 'foo', {
                    get : function() {
                        getStub();
                        return this._innerValue;
                    },
                    set: function (value) {

                        setStub();
                        this._innerValue = value;
                    },
                    enumerable: true,
                    configurable: true
                });

                var substitute = {
                    method : 'foo',
                    type : Scaffold.Types.CallInfoType.GetterSetter,
                    wrapper : function(callInfo) {

                        wrapperStub();

                        if(callInfo.type == Scaffold.Types.CallInfoType.Getter) {

                            getterWrapperStub();

                            return 3 + callInfo.invoke();
                        }

                        if(callInfo.type == Scaffold.Types.CallInfoType.Setter) {

                            setterWrapperStub();

                            callInfo.invoke(2 * callInfo.args[0]);
                        }
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto();
                instance.foo = 2;

                var result = instance.foo;

                test.strictEqual(7, result);
                test.ok(getStub.calledOnce);
                test.ok(setStub.calledOnce);
                test.ok(wrapperStub.calledTwice);
                test.ok(getterWrapperStub.calledOnce);
                test.ok(setterWrapperStub.calledOnce);

                test.done();
            }
        };
    })()

}
