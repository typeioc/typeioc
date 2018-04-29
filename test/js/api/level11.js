'use strict';

exports.api = {

    level11: (function () {

        const Scaffold = require('../scaffold');
        const ScaffoldAddons = require('../scaffoldAddons');
        const mockery = Scaffold.Mockery;
        const CallInfoType = ScaffoldAddons.Interceptors.CallInfoType;

        var interceptor = null;
        var containerBuilder = null;

        function resolve(subject, substitutes) {
            var register1 = 'test';
            var register2 = function() {};

            containerBuilder.register(register2)
                .as(function(c) {
                    var r1 = c.resolve(register1);
                    return interceptor.intercept(r1, substitutes);
                });

            containerBuilder.register(register1)
                .as(function() { return subject });

            var container = containerBuilder.build();
            return container.resolve(register2);
        }

        function setUp(callback) {
            containerBuilder = Scaffold.createBuilder();
            interceptor = ScaffoldAddons.Interceptors.create();
            callback();
        }


        return {

            intercept_byPrototype : {

                setUp: setUp,

                should_proxy_prototype_method : function(test) {

                    var stub = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function(){
                        stub();
                        return this.arg1;
                    }

                    var Proto = resolve(parent);
                    var instance = new Proto(1);

                    test.strictEqual(1, instance.foo());
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_inherited_prototype_method : function(test) {

                    var stub = mockery.stub();

                    var grandParent = { foo : function() {  stub();  return 1;} };

                    function parent() { }
                    parent.prototype = grandParent;

                    var Proto = resolve(parent);
                    var instance = new Proto();

                    test.strictEqual(1, instance.foo());
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_static_method : function(test) {

                    var stub = mockery.stub();

                    function parent() { }
                    parent.foo = function() { stub(); return 1; }

                    var Proto = resolve(parent);

                    test.strictEqual(1, Proto.foo());
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_prototype_field : function(test) {

                    function parent() { }
                    parent.prototype.foo = 1;
                    parent.prototype.getFoo = function() { return this.foo; }

                    var Proto = resolve(parent);
                    var instance = new Proto();

                    test.strictEqual(1, instance.getFoo());
                    test.strictEqual(1, instance.foo);
                    instance.foo = 123;
                    test.strictEqual(123, instance.foo);
                    test.strictEqual(123, instance.getFoo());

                    test.done();
                },

                should_proxy_static_field : function(test) {

                    function parent() { }
                    parent.foo = 1;
                    parent.getFoo = function() { return parent.foo; };

                    var Proto = resolve(parent);

                    test.strictEqual(1, Proto.getFoo());
                    Proto.foo = 2;
                    test.strictEqual(2, Proto.getFoo());

                    test.done();
                },

                should_proxy_inherited_prototype_field : function(test) {

                    var grandParent = { foo : 1 };

                    function parent() { }
                    parent.prototype = grandParent;

                    var Proto = resolve(parent);
                    var instance = new Proto();

                    test.strictEqual(1, instance.foo);

                    test.done();
                },

                should_proxy_prototype_getter : function(test) {

                    var stub = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent.prototype, 'foo', {
                        get: function () {
                            stub();
                            return 1;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var Proto = resolve(parent);
                    var instance = new Proto();

                    test.strictEqual(1, instance.foo);
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_prototype_setter : function(test) {

                    var stub = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent.prototype, 'foo', {
                        set: function (value) {
                            stub(value);
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var Proto = resolve(parent);
                    var instance = new Proto();

                    instance.foo = 3;

                    test.ok(stub.calledOnce);
                    test.ok(stub.calledWith(3));

                    test.done();
                },

                should_proxy_prototype_property : function(test) {

                    var getStub = mockery.stub();
                    var setStub = mockery.stub();

                    function parent() {
                        this._innerValue = undefined;
                    }

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {
                            getStub()
                            return this._innerValue;
                        },
                        set: function (value) {
                            setStub();
                            return this._innerValue = 1 + value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var Proto = resolve(parent);
                    var instance = new Proto();
                    instance.foo = 3;

                    test.strictEqual(4, instance.foo);
                    test.ok(getStub.calledOnce);
                    test.ok(setStub.calledOnce);

                    test.done();
                },

                should_proxy_static_getter : function(test) {

                    var stub = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent, 'foo', {
                        get: function () {

                            stub();
                            return 1;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var Proto = resolve(parent);

                    test.strictEqual(1, Proto.foo);
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_inherited_prototype_getter : function(test) {

                    var stub = mockery.stub();

                    var grandParent =  function() { this._innerField = 333; };
                    Object.defineProperty(grandParent.prototype, 'foo', {
                        get: function () {
                            stub();
                            return this._innerField;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    function parent() {
                        grandParent.call(this);
                        this._innerField = 3;
                    }
                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;

                    var Proto = resolve(parent);
                    var instance = new Proto();

                    test.strictEqual(3, instance.foo);
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_inherited_prototype_property : function(test) {

                    var getStub = mockery.stub();
                    var setStub = mockery.stub();

                    var grandParent =  function() { this._innerField = 333; };
                    Object.defineProperty(grandParent.prototype, 'foo', {
                        get: function () {
                            getStub();
                            return this._innerField;
                        },
                        set: function(value) {
                            setStub();
                            this._innerField = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    function parent() { this._innerField = 0; }
                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;


                    var Proto = resolve(parent);
                    var instance = new Proto();
                    instance.foo = 3;

                    test.strictEqual(3, instance.foo);
                    test.ok(getStub.calledOnce);
                    test.ok(setStub.calledOnce);

                    test.done();
                },

                should_proxy_static_property : function(test) {

                    var getStub = mockery.stub();
                    var setStub = mockery.stub();

                    function parent() { }
                    parent._innerField = 0;
                    Object.defineProperty(parent, 'foo', {
                        get: function () {
                            getStub();
                            return parent._innerField;
                        },
                        set: function(value) {
                            setStub();
                            parent._innerField = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var Proto = resolve(parent);
                    Proto.foo = 123;

                    test.strictEqual(123, Proto.foo);
                    test.ok(getStub.calledOnce);
                    test.ok(setStub.calledOnce);

                    test.done();
                },

                should_proxy_prototype_method_with_args : function(test) {

                    var stub = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function(arg1, arg2){

                        stub();
                        return this.arg1 + arg1 + arg2;
                    }

                    var Proto = resolve(parent);
                    var instance = new Proto(1);

                    test.strictEqual(6, instance.foo(2, 3));
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_inherited_prototype_method_with_args : function(test) {

                    var stub = mockery.stub();

                    function grandParent() {}
                    grandParent.prototype.foo = function(arg1, arg2) { stub();  return arg1 + arg2;};

                    function parent() {}
                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;

                    var Proto = resolve(parent);
                    var instance = new Proto();

                    test.strictEqual(3, instance.foo(1, 2));
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_static_method_with_args : function(test) {

                    var stub = mockery.stub();

                    function parent() { }
                    parent.foo = function(arg1, arg2) { stub(); return arg1 + arg2; }

                    var Proto = resolve(parent);

                    test.strictEqual(3, Proto.foo(1, 2));
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_cross_method : function(test) {

                    var fooStub = mockery.stub();
                    var barStub = mockery.stub();

                    function parent() {
                    }

                    parent.prototype.bar = function(arg){
                        var result = 0;

                        if(arg > 0)
                            result = arg+ this.foo(arg - 1);

                        barStub();
                        return result;
                    }

                    parent.prototype.foo = function(arg){

                        var result = 0;

                        if(arg > 0)
                            result = arg+ this.bar(arg - 1);

                        fooStub();
                        return result;
                    }

                    var Proto = resolve(parent);
                    var instance = new Proto();

                    test.strictEqual(15, instance.foo(5));
                    test.ok(fooStub.calledThrice);
                    test.ok(barStub.calledThrice);

                    test.done();
                },

                should_proxy_cross_method_field : function(test) {

                    var fooStub = mockery.stub();

                    function parent() {
                        this.bar = 1;
                    }

                    parent.prototype.foo = function(arg){

                        var result = 0;

                        if(arg > this.bar)
                            result = arg+ this.foo(arg - 1);

                        fooStub();
                        return result;
                    }

                    var Proto = resolve(parent);
                    var instance = new Proto();

                    test.strictEqual(14, instance.foo(5));
                    test.strictEqual(5, fooStub.callCount);

                    test.done();
                },

                should_proxy_cross_method_property : function(test) {

                    var fooStub = mockery.stub();
                    var getStub = mockery.stub();
                    var setStub = mockery.stub();

                    function parent() {
                        this._innerValue = 5;
                    }

                    Object.defineProperty(parent.prototype, 'prop', {
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

                    parent.prototype.foo = function(){

                        var result = 0;

                        if(this.prop > 0) {
                            this.prop = this.prop - 1;
                            result = this.prop + this.foo();
                        }

                        fooStub();
                        return result;
                    }

                    var Proto = resolve(parent);
                    var instance = new Proto();

                    test.strictEqual(10, instance.foo());
                    test.strictEqual(6, fooStub.callCount);
                    test.strictEqual(16, getStub.callCount);
                    test.strictEqual(5, setStub.callCount);

                    test.done();
                },

                should_decorate_prototype_field : function(test) {

                    var fieldStub = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Field,
                        wrapper : function(callInfo) {

                            var args = callInfo.args;

                            fieldStub(args);

                            return 2 * callInfo.invoke(args);
                        }
                    };

                    var Proto = resolve(parent, [substitute]);
                    var instance = new Proto();

                    test.strictEqual(2, instance.foo);
                    instance.foo = 12;
                    test.strictEqual(24, instance.foo);
                    test.ok(fieldStub.calledThrice);

                    test.done();
                },

                should_decorate_prototype_method_by_name : function(test) {

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
                        type : CallInfoType.Method,
                        wrapper : function(callInfo) {

                            return 2 * callInfo.invoke();
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto(2);

                    test.strictEqual(4, instance.foo());
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_decorate_inherited_prototype_method : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    function grandParent(){}
                    grandParent.prototype.foo = function() { stub(); return 3;};

                    function parent() { }
                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Method,
                        wrapper : function(callInfo) {

                            wrapperStub();
                            return 3 * callInfo.invoke();
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto();

                    test.strictEqual(9, instance.foo());
                    test.ok(stub.calledOnce);
                    test.ok(wrapperStub.calledOnce);

                    test.done();
                },

                should_decorate_static_method : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    function parent() { }
                    parent.foo = function() { stub(); return 3; };

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Method,
                        wrapper : function(callInfo) {

                            wrapperStub();
                            return 3 * callInfo.invoke();
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);

                    test.strictEqual(9, Proto.foo());
                    test.ok(stub.calledOnce);
                    test.ok(wrapperStub.calledOnce);

                    test.done();
                },

                should_decorate_prototype_method_by_chain : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function(arg2, arg3) {

                        stub();
                        return this.arg1 + arg2 + arg3;
                    };

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
                    }

                    var Proto = resolve(parent, [ substitute1, substitute2 ]);
                    var instance = new Proto(1);

                    test.strictEqual(14, instance.foo(2, 3));
                    test.ok(stub.calledTwice);
                    test.ok(wrapperStub.calledTwice);

                    test.done();
                },

                should_decorate_prototype_method_by_chain_multi_invoke : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function(arg2, arg3) {

                        stub();
                        return this.arg1 + arg2 + arg3;
                    };

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
                    }

                    var Proto = resolve(parent, [ substitute1, substitute2 ]);
                    var instance = new Proto(1);

                    test.strictEqual(14, instance.foo(2, 3));
                    test.ok(stub.calledTwice);
                    test.ok(wrapperStub.calledTwice);

                    test.strictEqual(14, instance.foo(2, 3));

                    test.done();
                },

                should_decorate_inherited_prototype_method_by_chain : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    var grandParent = function() {};
                    grandParent.prototype.foo = function(arg2, arg3) {
                        stub();
                        return this.arg1 + arg2 + arg3;
                    }

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;

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

                    var Proto = resolve(parent, [ substitute1, substitute2 ]);
                    var instance = new Proto(1);

                    test.strictEqual(14, instance.foo(2, 3));
                    test.ok(stub.calledTwice);
                    test.ok(wrapperStub.calledTwice);

                    test.done();
                },

                should_decorate_static_method_by_chain : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    function parent() {}

                    parent.foo = function(arg1, arg2) {
                        stub();
                        return 1 + arg1 + arg2;
                    };

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
                    }

                    var Proto = resolve(parent, [ substitute1,substitute2 ]);

                    test.strictEqual(14, Proto.foo(2, 3));
                    test.ok(stub.calledTwice);
                    test.ok(stub.calledTwice);

                    test.done();
                },

                should_decorate_prototype_getter_for_full_property : function(test) {

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
                        type : CallInfoType.Getter,
                        wrapper : function(callInfo) {

                            wrapperStub();
                            return 2 * callInfo.invoke();
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto();
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
                        type : CallInfoType.Setter,
                        wrapper : function(callInfo) {

                            wrapperStub();
                            return callInfo.invoke(2 * callInfo.args[0]);
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto();
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

                    function parent() { }

                    Object.defineProperty(parent.prototype, 'foo', {
                        set: function (value) {

                            setStub(value);
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Setter,
                        wrapper : function(callInfo) {

                            wrapperStub();
                            return callInfo.invoke(2 * callInfo.args[0]);
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto();
                    instance.foo = 2;

                    test.ok(setStub.withArgs(4).calledOnce);
                    test.ok(wrapperStub.calledOnce);

                    test.done();
                },

                should_decorate_with_copy_of_args : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    function parent() {}

                    parent.foo = function(arg1, arg2) {
                        stub();
                        return 1 + arg1 + arg2;
                    };

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

                    var Proto = resolve(parent, [ substitute1, substitute2 ]);

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

                    var Proto = resolve(parent, [ substitute ]);
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
                },

                should_decorate_inherited_prototype_full_property : function(test) {

                    var getStub = mockery.stub();
                    var setStub = mockery.stub();
                    var wrapperStub = mockery.stub();
                    var getterWrapperStub = mockery.stub();
                    var setterWrapperStub = mockery.stub();

                    var grandParent = function() {
                        this._innerValue = 111;
                    };

                    Object.defineProperty(grandParent.prototype, 'foo', {
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


                    function parent() {
                        grandParent.call(this);
                        this._innerValue = undefined;
                    }
                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;

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

                    var Proto = resolve(parent, [ substitute ]);
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
                },

                should_decorate_cross_method : function(test) {

                    var fooStub = mockery.stub();
                    var fooWrapperStub = mockery.stub();
                    var barStub = mockery.stub();
                    var barWrapperStub = mockery.stub();

                    function parent() {
                    }

                    parent.prototype.bar = function(arg){
                        var result = 0;

                        if(arg > 0)
                            result = arg+ this.foo(arg - 1);

                        barStub();
                        return result;
                    }

                    parent.prototype.foo = function(arg){

                        var result = 0;

                        if(arg > 0)
                            result = arg+ this.bar(arg - 1);

                        fooStub();
                        return result;
                    }

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

                    var Proto = resolve(parent, [substitute1, substitute2]);
                    var instance = new Proto();

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

                    function parent() {
                        this._foo = 3;
                    }

                    parent.prototype.bar = function(arg){
                        var result = 0;

                        if(arg > 0)
                            result = this.foo + this.bar(arg - 1);

                        barStub();
                        return result;
                    }

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            fooStub();
                            return this._foo;
                        },
                        enumerable: true,
                        configurable: true
                    });

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

                    var Proto = resolve(parent, [substitute1, substitute2]);
                    var instance = new Proto();

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

                    function parent() { }
                    parent._innerValue = undefined;

                    Object.defineProperty(parent, 'foo', {
                        get : function() {
                            getStub();
                            return parent._innerValue;
                        },
                        set: function (value) {

                            setStub();
                            parent._innerValue = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

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

                    var Proto = resolve(parent, [ substitute ]);
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


                    function parent() { }
                    parent._barValue = undefined;
                    parent._fooValue = undefined

                    Object.defineProperty(parent, 'bar', {
                        get : function() {
                            getBarStub();
                            return parent._barValue + parent.foo;
                        },
                        set: function (value) {

                            setBarStub();
                            parent._barValue = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(parent, 'foo', {
                        get : function() {
                            getFooStub();
                            return parent._fooValue;
                        },
                        set: function (value) {

                            setFooStub();
                            parent.bar = value;
                            parent._fooValue = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

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

                    var Proto = resolve(parent, [ substitute1, substitute2 ]);
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
            },

            intercept_byInstance : {

                setUp: setUp,

                should_proxy_prototype_method : function(test) {

                    var stub = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function(){
                        stub();
                        return this.arg1;
                    }

                    var instance= resolve(new parent(1));

                    test.strictEqual(1, instance.foo());
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_inherited_prototype_method : function(test) {

                    var stub = mockery.stub();

                    var grandParent = { foo : function() {  stub();  return 1;} };

                    function parent() { }
                    parent.prototype = grandParent;

                    var instance = resolve(new parent());

                    test.strictEqual(1, instance.foo());
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_prototype_field : function(test) {

                    function parent() { }
                    parent.prototype.foo = 1;
                    parent.prototype.getFoo = function() { return this.foo; }

                    var instance = resolve(new parent());

                    test.strictEqual(1, instance.getFoo());
                    test.strictEqual(1, instance.foo);
                    instance.foo = 123;
                    test.strictEqual(123, instance.foo);
                    test.strictEqual(123, instance.getFoo());

                    test.done();
                },

                should_proxy_inherited_prototype_field : function(test) {

                    var grandParent = { foo : 1 };

                    function parent() { }
                    parent.prototype = grandParent;

                    var instance = resolve(new parent());

                    test.strictEqual(1, instance.foo);

                    test.done();
                },

                should_proxy_prototype_getter : function(test) {

                    var stub = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent.prototype, 'foo', {
                        get: function () {
                            stub();
                            return 1;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var instance = resolve(new parent());

                    test.strictEqual(1, instance.foo);
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_prototype_setter : function(test) {

                    var stub = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent.prototype, 'foo', {
                        set: function (value) {
                            stub(value);
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var instance = resolve(new parent());

                    instance.foo = 3;

                    test.ok(stub.calledOnce);
                    test.ok(stub.calledWith(3));

                    test.done();
                },

                should_proxy_prototype_property : function(test) {

                    var getStub = mockery.stub();
                    var setStub = mockery.stub();

                    function parent() {
                        this._innerValue = undefined;
                    }

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {
                            getStub()
                            return this._innerValue;
                        },
                        set: function (value) {
                            setStub();
                            return this._innerValue = 1 + value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var instance = resolve(new parent());
                    instance.foo = 3;

                    test.strictEqual(4, instance.foo);
                    test.ok(getStub.calledOnce);
                    test.ok(setStub.calledOnce);

                    test.done();
                },

                should_proxy_inherited_prototype_getter : function(test) {

                    var stub = mockery.stub();

                    var grandParent =  function() { this._innerField = 333; };
                    Object.defineProperty(grandParent.prototype, 'foo', {
                        get: function () {
                            stub();
                            return this._innerField;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    function parent() {
                        grandParent.call(this);
                        this._innerField = 3;
                    }
                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;

                    var instance = resolve(new parent());

                    test.strictEqual(3, instance.foo);
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_inherited_prototype_property : function(test) {

                    var getStub = mockery.stub();
                    var setStub = mockery.stub();

                    var grandParent =  function() { this._innerField = 333; };
                    Object.defineProperty(grandParent.prototype, 'foo', {
                        get: function () {
                            getStub();
                            return this._innerField;
                        },
                        set: function(value) {
                            setStub();
                            this._innerField = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    function parent() { this._innerField = 0; }
                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;


                    var instance = resolve(new parent());
                    instance.foo = 3;

                    test.strictEqual(3, instance.foo);
                    test.ok(getStub.calledOnce);
                    test.ok(setStub.calledOnce);

                    test.done();
                },

                should_proxy_prototype_method_with_args : function(test) {

                    var stub = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function(arg1, arg2){

                        stub();
                        return this.arg1 + arg1 + arg2;
                    }

                    var instance = resolve(new parent(1));

                    test.strictEqual(6, instance.foo(2, 3));
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_inherited_prototype_method_with_args : function(test) {

                    var stub = mockery.stub();

                    function grandParent() {}
                    grandParent.prototype.foo = function(arg1, arg2) { stub();  return arg1 + arg2;};

                    function parent() {}
                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;

                    var instance = resolve(new parent());

                    test.strictEqual(3, instance.foo(1, 2));
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_proxy_cross_method : function(test) {

                    var fooStub = mockery.stub();
                    var barStub = mockery.stub();

                    function parent() {
                    }

                    parent.prototype.bar = function(arg){
                        var result = 0;

                        if(arg > 0)
                            result = arg+ this.foo(arg - 1);

                        barStub();
                        return result;
                    }

                    parent.prototype.foo = function(arg){

                        var result = 0;

                        if(arg > 0)
                            result = arg+ this.bar(arg - 1);

                        fooStub();
                        return result;
                    }

                    var instance = resolve(new parent());

                    test.strictEqual(15, instance.foo(5));
                    test.ok(fooStub.calledThrice);
                    test.ok(barStub.calledThrice);

                    test.done();
                },

                should_proxy_cross_method_field : function(test) {

                    var fooStub = mockery.stub();

                    function parent() {
                        this.bar = 1;
                    }

                    parent.prototype.foo = function(arg){

                        var result = 0;

                        if(arg > this.bar)
                            result = arg+ this.foo(arg - 1);

                        fooStub();
                        return result;
                    }

                    var instance = resolve(new parent());

                    test.strictEqual(14, instance.foo(5));
                    test.strictEqual(5, fooStub.callCount);

                    test.done();
                },

                should_proxy_cross_method_property : function(test) {

                    var fooStub = mockery.stub();
                    var getStub = mockery.stub();
                    var setStub = mockery.stub();

                    function parent() {
                        this._innerValue = 5;
                    }

                    Object.defineProperty(parent.prototype, 'prop', {
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

                    parent.prototype.foo = function(){

                        var result = 0;

                        if(this.prop > 0) {
                            this.prop = this.prop - 1;
                            result = this.prop + this.foo();
                        }

                        fooStub();
                        return result;
                    }

                    var instance = resolve(new parent());

                    test.strictEqual(10, instance.foo());
                    test.strictEqual(6, fooStub.callCount);
                    test.strictEqual(16, getStub.callCount);
                    test.strictEqual(5, setStub.callCount);

                    test.done();
                },

                should_decorate_prototype_field : function(test) {

                    var fieldStub = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Field,
                        wrapper : function(callInfo) {

                            var args = callInfo.args;

                            fieldStub(args);

                            return 2 * callInfo.invoke(args);
                        }
                    };

                    var instance = resolve(new parent(), [substitute]);

                    test.strictEqual(2, instance.foo);
                    instance.foo = 12;
                    test.strictEqual(24, instance.foo);
                    test.ok(fieldStub.calledThrice);

                    test.done();
                },

                should_decorate_prototype_method_by_name : function(test) {

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
                        //type : CallInfoType.Method,
                        wrapper : function(callInfo) {

                            return 2 * callInfo.invoke();
                        }
                    };

                    var instance = resolve(new parent(2), [ substitute ]);

                    test.strictEqual(4, instance.foo());
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_decorate_prototype_method : function(test) {

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
                        type : CallInfoType.Method,
                        wrapper : function(callInfo) {

                            return 2 * callInfo.invoke();
                        }
                    };

                    var instance = resolve(new parent(2), [ substitute ]);

                    test.strictEqual(4, instance.foo());
                    test.ok(stub.calledOnce);

                    test.done();
                },

                should_decorate_inherited_prototype_method : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    function grandParent(){}
                    grandParent.prototype.foo = function() { stub(); return 3;};

                    function parent() { }
                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Method,
                        wrapper : function(callInfo) {

                            wrapperStub();
                            return 3 * callInfo.invoke();
                        }
                    };

                    var instance = resolve(new parent(), [ substitute ]);

                    test.strictEqual(9, instance.foo());
                    test.ok(stub.calledOnce);
                    test.ok(wrapperStub.calledOnce);

                    test.done();
                },

                should_decorate_prototype_method_by_chain : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function(arg2, arg3) {

                        stub();
                        return this.arg1 + arg2 + arg3;
                    };

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
                    }

                    var instance = resolve(new parent(1), [ substitute1, substitute2 ]);

                    test.strictEqual(14, instance.foo(2, 3));
                    test.ok(stub.calledTwice);
                    test.ok(wrapperStub.calledTwice);

                    test.done();
                },

                should_decorate_prototype_method_by_chain_multi_invoke : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function(arg2, arg3) {

                        stub();
                        return this.arg1 + arg2 + arg3;
                    };

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
                    }

                    var instance = resolve(new parent(1), [ substitute1, substitute2 ]);

                    test.strictEqual(14, instance.foo(2, 3));
                    test.ok(stub.calledTwice);
                    test.ok(wrapperStub.calledTwice);

                    test.strictEqual(14, instance.foo(2, 3));

                    test.done();
                },

                should_decorate_inherited_prototype_method_by_chain : function(test) {

                    var stub = mockery.stub();
                    var wrapperStub = mockery.stub();

                    var grandParent = function() {};
                    grandParent.prototype.foo = function(arg2, arg3) {
                        stub();
                        return this.arg1 + arg2 + arg3;
                    }

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;


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
                    }

                    var instance = resolve(new parent(1), [ substitute1, substitute2 ]);

                    test.strictEqual(14, instance.foo(2, 3));
                    test.ok(stub.calledTwice);
                    test.ok(wrapperStub.calledTwice);

                    test.done();
                },

                should_decorate_prototype_getter_for_full_property : function(test) {

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
                        type : CallInfoType.Getter,
                        wrapper : function(callInfo) {

                            wrapperStub();
                            return 2 * callInfo.invoke();
                        }
                    };

                    var instance = resolve(new parent(), [ substitute ]);
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
                        type : CallInfoType.Setter,
                        wrapper : function(callInfo) {

                            wrapperStub();
                            return callInfo.invoke(2 * callInfo.args[0]);
                        }
                    };

                    var instance = resolve(new parent(), [ substitute ]);
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

                    function parent() { }

                    Object.defineProperty(parent.prototype, 'foo', {
                        set: function (value) {

                            setStub(value);
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Setter,
                        wrapper : function(callInfo) {

                            wrapperStub();
                            return callInfo.invoke(2 * callInfo.args[0]);
                        }
                    };

                    var instance = resolve(new parent(), [ substitute ]);
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

                    var instance = resolve(new parent(), [ substitute ]);
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

                    var grandParent = function() {
                        this._innerValue = 111;
                    };

                    Object.defineProperty(grandParent.prototype, 'foo', {
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


                    function parent() {
                        grandParent.call(this);
                        this._innerValue = undefined;
                    }
                    parent.prototype = Object.create(grandParent.prototype);
                    parent.prototype.constructor = parent;

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

                    var instance = resolve(new parent(), [ substitute ]);
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

                    function parent() {
                    }

                    parent.prototype.bar = function(arg){
                        var result = 0;

                        if(arg > 0)
                            result = arg+ this.foo(arg - 1);

                        barStub();
                        return result;
                    }

                    parent.prototype.foo = function(arg){

                        var result = 0;

                        if(arg > 0)
                            result = arg+ this.bar(arg - 1);

                        fooStub();
                        return result;
                    }

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

                    var instance = resolve(new parent(), [substitute1, substitute2]);

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

                    function parent() {
                        this._foo = 3;
                    }

                    parent.prototype.bar = function(arg){
                        var result = 0;

                        if(arg > 0)
                            result = this.foo + this.bar(arg - 1);

                        barStub();
                        return result;
                    }

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            fooStub();
                            return this._foo;
                        },
                        enumerable: true,
                        configurable: true
                    });

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

                    var instance = resolve(new parent(), [substitute1, substitute2]);

                    test.strictEqual(19, instance.bar(3));
                    test.strictEqual(3, fooStub.callCount);
                    test.strictEqual(3, fooWrapperStub.callCount);
                    test.strictEqual(4, barStub.callCount);
                    test.strictEqual(4, barWrapperStub.callCount);

                    test.done();
                },

                should_decorate: (test) => {
                    
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
    })()
}