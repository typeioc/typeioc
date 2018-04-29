
'use strict';

exports.internal = {

    proxy: (function () {

        const Scaffold = require('../scaffold');
        const ScaffoldAddons = require('../scaffoldAddons');
        const ProxyModule = require('./../../../lib/interceptors/proxy');
        const mockery = Scaffold.Mockery;
        const CallInfoType = ScaffoldAddons.Interceptors.CallInfoType;

        var PropertyType = {
            Method : 1,                 // method
            Getter : 2,                 // get
            Setter : 3,                 // set
            FullProperty : 4,           // get and set
            Field : 5                   // field
        };

        var proxy;
        var decorator = {};

        function createStorage(types, substitutes, include) {

            var types = Array.isArray(types) ? types : [ types ];
            var substitutes = Array.isArray(substitutes) ? substitutes : [ substitutes ];

            include = include || 'foo';

            return {
                getSubstitutes : function(p) {
                    return p === include ? substitutes[0] : null;
                }
            };
        }

        function setUp(callback) {

            proxy = new ProxyModule.Proxy(decorator);

            callback();
        }

        return {

            byPrototype : {
                setUp : setUp,

                should_construct_parent_instance : function(test) {

                    decorator.wrap = mockery.stub();

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

                    var stub = mockery.stub();

                    decorator.wrap = function(info) {
                        info.destination[info.name] = 111;

                        stub(info.name);
                    };

                    function parent(arg1) {
                        this.arg1 = arg1;
                    }

                    parent.prototype.foo = function(){
                        return this.arg1;
                    }

                    var Proto = proxy.byPrototype(parent);
                    var instance = new Proto(1);

                    test.ok(stub.withArgs('foo').calledOnce);

                    test.done();
                },

                should_decorate_prototype_field : function(test) {

                    var stub = mockery.stub();

                    decorator.wrap = function(info) {
                        info.destination[info.name] = 111;

                        stub(info.name);
                    };

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Field,
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(CallInfoType.Field, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(stub.withArgs('foo').calledOnce);

                    test.done();
                },

                should_decorate_for_any : function(test) {

                    var stub = mockery.stub();

                    decorator.wrap = function(info) {
                        info.destination[info.name] = 111;

                        stub(info.name);
                    };

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Any,
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(CallInfoType.Any, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(stub.withArgs('foo').calledOnce);

                    test.done();
                },

                should_decorate_for_any_and_method : function(test) {

                    var stub = mockery.stub();

                    decorator.wrap = function(info) {
                        info.destination[info.name] = 111;

                        stub(info.name);
                    };

                    function parent() { }
                    parent.prototype.foo = function() { return 1};

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Any,
                        wrapper : function(callInfo) { },
                        next : {
                            method : 'foo',
                            type : CallInfoType.Method,
                            wrapper : function(callInfo) { }
                        }
                    };

                    var storage = createStorage(CallInfoType.Method, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(stub.withArgs('foo').calledOnce);

                    test.done();
                },

                should_decorate_for_any_and_any_property : function(test) {

                    var stub = mockery.stub();

                    decorator.wrap = function(info) {
                        info.destination[info.name] = 111;

                        stub(info.name);
                    };

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Any,
                        wrapper : function(callInfo) { },
                        next : {
                            method : 'foo',
                            type : CallInfoType.Field,
                            wrapper : function(callInfo) { }
                        }
                    };

                    var storage = createStorage([CallInfoType.Field, CallInfoType.Any], substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(stub.withArgs('foo').calledOnce);

                    test.done();
                },

                should_decorate_prototype_getter : function(test) {

                    var stub = mockery.stub();

                    decorator.wrap = function(info) {
                        info.destination[info.name] = 111;

                        stub(info.name);
                    };

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

                    var storage = createStorage(CallInfoType.Getter, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(stub.withArgs('foo').calledOnce);

                    test.done();
                },

                should_decorate_prototype_setter : function(test) {

                    var stub = mockery.stub();

                    decorator.wrap = function(info) {
                        info.destination[info.name] = 111;

                        stub(info.name);
                    };

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

                    var storage = createStorage(CallInfoType.Setter, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(stub.withArgs('foo').calledOnce);

                    test.done();
                },

                should_decorate_prototype_full_property : function(test) {

                    var stub = mockery.stub();

                    decorator.wrap = function(info) {
                        info.destination[info.name] = 111;

                        stub(info.name);
                    };

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

                    var storage = createStorage(CallInfoType.GetterSetter, substitute);
                    var Proto = proxy.byPrototype(parent, storage);
                    var instance = new Proto();

                    test.ok(stub.withArgs('foo').calledOnce);

                    test.done();
                }
            },

            byInstance : {

                setUp : setUp,

                should_proxy_instance_method : function(test) {

                    decorator.wrap = mockery.stub();

                    var parent = {
                        foo : function() {
                            return 1;
                        }
                    };

                    var instance = proxy.byInstance(parent);

                    test.ok(decorator.wrap.withArgs(mockery.match({ name: 'foo' })).calledOnce);

                    test.done();
                },

                should_decorate_prototype_field : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Field,
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(CallInfoType.Field, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.withArgs(mockery.match({ name: 'foo' })).calledOnce);

                    test.done();
                },

                should_decorate_for_any : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Any,
                        wrapper : function(callInfo) { }
                    };

                    var storage = createStorage(CallInfoType.Any, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.withArgs(mockery.match({ name: 'foo' })).calledOnce);

                    test.done();
                },

                should_decorate_for_any_and_method : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = function() { return 1};

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Any,
                        wrapper : function(callInfo) { },
                        next : {
                            method : 'foo',
                            type : CallInfoType.Method,
                            wrapper : function(callInfo) { }
                        }
                    };

                    var storage = createStorage(CallInfoType.Method, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.withArgs(mockery.match({ name: 'foo' })).calledOnce);

                    test.done();
                },

                should_decorate_for_any_and_any_property : function(test) {

                    decorator.wrap = mockery.stub();

                    function parent() { }
                    parent.prototype.foo = 1;

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Any,
                        wrapper : function(callInfo) { },
                        next : {
                            method : 'foo',
                            type : CallInfoType.Field,
                            wrapper : function(callInfo) { }
                        }
                    };

                    var storage = createStorage([CallInfoType.Field, CallInfoType.Any], substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.withArgs(mockery.match({ name: 'foo' })).calledOnce);

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

                    var storage = createStorage(CallInfoType.Getter, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.withArgs(mockery.match({ name: 'foo' })).calledOnce);

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

                    var storage = createStorage(CallInfoType.Setter, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.withArgs(mockery.match({ name: 'foo' })).calledOnce);

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

                    var storage = createStorage(CallInfoType.GetterSetter, substitute);
                    var instance = proxy.byInstance(new parent(), storage);

                    test.ok(decorator.wrap.withArgs(mockery.match({ name: 'foo' })).calledOnce);

                    test.done();
                }
            }
        };
    })()
}