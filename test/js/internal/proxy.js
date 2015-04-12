
'use strict';

exports.internal = {

    proxy: (function () {

        var Scaffold = require('../../scaffold');
        var ProxyModule = require('./../../../lib/interceptors/proxy');
        var mockery = Scaffold.Mockery;

        var PropertyType = {
            Method : 1,                 // method
            Getter : 2,                 // get
            Setter : 3,                 // set
            FullProperty : 4,           // get and set
            Field : 5                   // field
        };

        var proxy;
        var decorator = {};
        var decoratorService = {
            create : function() { return decorator; }
        };

        function createStorage(types, substitutes, exclude) {

            var types = Array.isArray(types) ? types : [ types ];
            var substitutes = Array.isArray(substitutes) ? substitutes : [ substitutes ];

            return {
                getKnownTypes : function(p) {
                    return p !== exclude ? types : [];
                },
                getSubstitutes : function(p) {
                    return p !== exclude ? substitutes : [];
                }
            };
        }

        return {

            byPrototype : {
                setUp: function (callback) {

                    proxy = new ProxyModule.Proxy(decoratorService);

                    callback();
                },

                should_construct_parent_instance : function(test) {

                    var a1 = 0;
                    var a2 = 0;

                    function parent(arg1, arg2) {
                        this.arg1 = arg1;
                        this.arg2 = arg2;

                        a1 = this.arg1;
                        a2 = this.arg2;
                    }

                    var Proto = proxy.byPrototype(parent);
                    var instance = new Proto(1, 2);

                    test.ok(Proto);
                    test.ok(instance);
                    test.strictEqual(a1, 1);
                    test.strictEqual(a2, 2);

                    test.done();
                },

                should_proxy_prototype_method : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function(){
                        return this.arg1;
                    }

                    var Proto = proxy.byPrototype(parent);
                    var instance = new Proto(1);

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_prototype_field : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : Scaffold.Types.CallInfoType.Field,
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Field, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_for_any : function(test) {

                    decorator.wrap = mockery.stub();
                    decorator.propertyType = PropertyType.Field;

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : Scaffold.Types.CallInfoType.Any,
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Any, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_for_any_and_method : function(test) {

                    decorator.wrap = mockery.stub();
                    decorator.propertyType = PropertyType.Method;

                    function parent() { }
                    parent.prototype.foo = function() { return 1};

                    var substitute = {
                        method : 'foo',
                        type : Scaffold.Types.CallInfoType.Any,
                        wrapper : function(callInfo) { },
                        next : {
                            method : 'foo',
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : function(callInfo) { }
                        }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Method, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_for_any_and_any_property : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : Scaffold.Types.CallInfoType.Any,
                        wrapper : function(callInfo) { },
                        next : {
                            method : 'foo',
                            type : Scaffold.Types.CallInfoType.Field,
                            wrapper : function(callInfo) { }
                        }
                    };

                    var storage = createStorage([Scaffold.Types.CallInfoType.Field, Scaffold.Types.CallInfoType.Any], substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_prototype_getter : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent.prototype, 'foo', {
                        get: function () {
                            return 1;
                        },
                        enumerable: true,
                        configurable: true
                    });


                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Getter, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_prototype_setter : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent.prototype, 'foo', {
                        set: function (value) { },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Setter, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_prototype_full_property : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent.prototype, 'foo', {
                        get: function () { return 1; },
                        set: function() {},
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.GetterSetter, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_throw_when_wrong_substitute_type_for_field : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() {}
                    parent.prototype.foo = 1;

                    var substitute = {
                        type: Scaffold.Types.CallInfoType.Getter,
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Getter, substitute);
                    var delegate = function() { proxy.byPrototype(parent, storage); };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Could not match proxy type and property type for field');
                        test.strictEqual(error.data.method, 'foo');
                        test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.Field);
                        return error instanceof Scaffold.Exceptions.ProxyError;
                    });

                    test.strictEqual(decorator.wrap.callCount, 0);

                    test.expect(5);
                    test.done();
                },

                should_throw_when_wrong_substitute_type_for_method : function(test) {

                    decorator.wrap = mockery.stub();
                    decorator.propertyType = PropertyType.Method;

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function() {
                        return this.arg1;
                    };

                    var substitute = {
                        type: Scaffold.Types.CallInfoType.Getter,
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Getter, substitute);
                    var delegate = function() { proxy.byPrototype(parent, storage); };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Could not match proxy type and property type for method');
                        test.strictEqual(error.data.method, 'foo');
                        test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.Method);
                        return error instanceof Scaffold.Exceptions.ProxyError;
                    });

                    test.strictEqual(decorator.wrap.callCount, 0);

                    test.expect(5);
                    test.done();
                },

                should_throw_when_wrong_substitute_type_for_getter : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }
                    Object.defineProperty(parent.prototype, 'foo', {
                        get: function () { return this.arg1; },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        type: Scaffold.Types.CallInfoType.Method,
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Method, substitute);
                    var delegate = function() { proxy.byPrototype(parent, storage); };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Could not match proxy type and property type for getter');
                        test.strictEqual(error.data.method, 'foo');
                        test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.Getter);
                        return error instanceof Scaffold.Exceptions.ProxyError;
                    });

                    test.strictEqual(decorator.wrap.callCount, 0);

                    test.expect(5);
                    test.done();
                },

                should_throw_when_wrong_substitute_type_for_setter : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    Object.defineProperty(parent.prototype, 'foo', {
                        set: function (value) { this.arg1 = value; },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        type: Scaffold.Types.CallInfoType.Method,
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Method, substitute);
                    var delegate = function() { proxy.byPrototype(parent, storage); };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Could not match proxy type and property type for setter');
                        test.strictEqual(error.data.method, 'foo');
                        test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.Setter);
                        return error instanceof Scaffold.Exceptions.ProxyError;
                    });

                    test.strictEqual(decorator.wrap.callCount, 0);

                    test.expect(5);
                    test.done();
                },

                should_throw_when_wrong_substitute_type_for_full_property : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    Object.defineProperty(parent.prototype, 'foo', {
                        get: function () { return this.arg1; },
                        set: function(value) { this.arg1 = value; },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        type: Scaffold.Types.CallInfoType.Method,
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Method, substitute);
                    var delegate = function() { proxy.byPrototype(parent, storage); };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Could not match proxy type and property type for getter-setter');
                        test.strictEqual(error.data.method, 'foo');
                        test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.GetterSetter);
                        return error instanceof Scaffold.Exceptions.ProxyError;
                    });

                    test.strictEqual(decorator.wrap.callCount, 0);

                    test.expect(5);
                    test.done();
                }
            },

            byInstance : {

                setUp: function (callback) {

                    proxy = new ProxyModule.Proxy(decoratorService);

                    callback();
                },

                should_proxy_instance_method : function(test) {

                    decorator.wrap = mockery.stub();

                    var parent = {
                        foo : function() {
                            return 1;
                        }
                    };

                    var instance = proxy.byInstance(parent);

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_prototype_field : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : Scaffold.Types.CallInfoType.Field,
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Field, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_for_any : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : Scaffold.Types.CallInfoType.Any,
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Any, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_for_any_and_method : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = function() { return 1};

                    var substitute = {
                        method : 'foo',
                        type : Scaffold.Types.CallInfoType.Any,
                        wrapper : function(callInfo) { },
                        next : {
                            method : 'foo',
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : function(callInfo) { }
                        }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Method, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_for_any_and_any_property : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : Scaffold.Types.CallInfoType.Any,
                        wrapper : function(callInfo) { },
                        next : {
                            method : 'foo',
                            type : Scaffold.Types.CallInfoType.Field,
                            wrapper : function(callInfo) { }
                        }
                    };

                    var storage = createStorage([Scaffold.Types.CallInfoType.Field, Scaffold.Types.CallInfoType.Any], substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_prototype_getter : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent.prototype, 'foo', {
                        get: function () {
                            return 1;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Getter, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_prototype_setter : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent.prototype, 'foo', {
                        set: function (value) { },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Setter, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_decorate_prototype_full_property : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    Object.defineProperty(parent.prototype, 'foo', {
                        get: function () { return 1; },
                        set: function() {},
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.GetterSetter, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.calledOnce);

                    test.done();
                },

                should_throw_when_wrong_substitute_type_for_field : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() {}
                    parent.prototype.foo = 1;

                    var substitute = {
                        type: Scaffold.Types.CallInfoType.Getter,
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Getter, substitute);
                    var delegate = function() { proxy.byInstance(new parent(), storage); };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Could not match proxy type and property type for field');
                        test.strictEqual(error.data.method, 'foo');
                        test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.Field);
                        return error instanceof Scaffold.Exceptions.ProxyError;
                    });

                    test.strictEqual(decorator.wrap.callCount, 0);

                    test.expect(5);
                    test.done();
                },

                should_throw_when_wrong_substitute_type_for_method : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function() {
                        return this.arg1;
                    };

                    var substitute = {
                        type: Scaffold.Types.CallInfoType.Getter,
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Getter, substitute, 'arg1');
                    var delegate = function() {
                        proxy.byInstance(new parent(), storage);
                    };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Could not match proxy type and property type for method');
                        test.strictEqual(error.data.method, 'foo');
                        test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.Method);
                        return error instanceof Scaffold.Exceptions.ProxyError;
                    });

                    test.strictEqual(decorator.wrap.callCount, 1);

                    test.expect(5);
                    test.done();
                },

                should_throw_when_wrong_substitute_type_for_getter : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }
                    Object.defineProperty(parent.prototype, 'foo', {
                        get: function () { return this.arg1; },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        type: Scaffold.Types.CallInfoType.Method,
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Method, substitute, 'arg1');
                    var delegate = function() { proxy.byInstance(new parent(), storage); };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Could not match proxy type and property type for getter');
                        test.strictEqual(error.data.method, 'foo');
                        test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.Getter);
                        return error instanceof Scaffold.Exceptions.ProxyError;
                    });

                    test.strictEqual(decorator.wrap.callCount, 1);

                    test.expect(5);
                    test.done();
                },

                should_throw_when_wrong_substitute_type_for_setter : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    Object.defineProperty(parent.prototype, 'foo', {
                        set: function (value) { this.arg1 = value; },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        type: Scaffold.Types.CallInfoType.Method,
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Method, substitute, 'arg1');
                    var delegate = function() { proxy.byInstance(new parent(), storage); };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Could not match proxy type and property type for setter');
                        test.strictEqual(error.data.method, 'foo');
                        test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.Setter);
                        return error instanceof Scaffold.Exceptions.ProxyError;
                    });

                    test.strictEqual(decorator.wrap.callCount, 1);

                    test.expect(5);
                    test.done();
                },

                should_throw_when_wrong_substitute_type_for_full_property : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    Object.defineProperty(parent.prototype, 'foo', {
                        get: function () { return this.arg1; },
                        set: function(value) { this.arg1 = value; },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        type: Scaffold.Types.CallInfoType.Method,
                        method : 'foo',
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(Scaffold.Types.CallInfoType.Method, substitute, 'arg1');
                    var delegate = function() { proxy.byInstance(new parent(), storage); };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Could not match proxy type and property type for getter-setter');
                        test.strictEqual(error.data.method, 'foo');
                        test.strictEqual(error.data.type, Scaffold.Types.CallInfoType.GetterSetter);
                        return error instanceof Scaffold.Exceptions.ProxyError;
                    });

                    test.strictEqual(decorator.wrap.callCount, 1);

                    test.expect(5);
                    test.done();
                }
            }
        };
    })()
}