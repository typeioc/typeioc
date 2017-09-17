'use strict';

exports.internal = {

    interceptor: (function () {

        var Scaffold = require('../../scaffold');
        var ScaffoldAddons = require('../../scaffoldAddons');
        var InterceptorModule = require('./../../../lib/interceptors/interceptor');
        var mockery = Scaffold.Mockery;
        var CallInfoType = ScaffoldAddons.Interceptors.CallInfoType;

        var proxy;
        var interceptor;

        function setUp(callback) {
            proxy = {
                byPrototype : mockery.stub(),
                byInstance : mockery.stub()
            };

            interceptor = new InterceptorModule.Interceptor(proxy);

            callback();
        }

        return {

            byPrototype : {
                setUp : setUp,

                intercept_throws_when_no_function_no_object: function(test) {

                    var delegate = function() {
                        interceptor.intercept(1, []);
                    };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Subject should be a prototype function or an object');
                        test.strictEqual(error.data, undefined);
                        return error instanceof Scaffold.Exceptions.ArgumentError;
                    });

                    test.expect(3);
                    test.done();
                },

                intercept_creates_empty_storage_for_empty_substitute_infos : function(test) {

                    var subject = function foo() {}

                    interceptor.intercept(subject, []);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);

                    test.done();
                },

                intercept_creates_multi_level_substitutes_for_one_level_substitute_infos : function(test) {

                    var subject = function foo() { };

                    var wrapper1 = function (c) { };
                    var wrapper2 = function (c) { };

                    interceptor.intercept(subject,
                        [
                            {
                                method: 'foo',
                                wrapper: wrapper1
                            },
                            {
                                method: 'bar',
                                wrapper: wrapper2
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 2);

                    var foo = storage.known['foo'];
                    test.strictEqual(Object.getOwnPropertyNames(foo).length, 1);

                    var item = foo[CallInfoType.Any];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper1, item.head.wrapper);
                    test.strictEqual(CallInfoType.Any, item.head.type);
                    test.strictEqual(null, item.head.next);

                    var bar = storage.known['bar'];
                    test.strictEqual(Object.getOwnPropertyNames(bar).length, 1);

                    item = bar[CallInfoType.Any];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('bar', item.head.method);
                    test.strictEqual(wrapper2, item.head.wrapper);
                    test.strictEqual(CallInfoType.Any, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_creates_first_level_method_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(subject,
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Method,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Method];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Method, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_creates_first_level_field_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(subject,
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Field,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Field];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Field, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_creates_first_level_getter_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(subject,
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Getter,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Getter];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Getter, item.head.type);
                    test.strictEqual(null, item.head.next);
                    test.done();
                },

                intercept_creates_first_level_setter_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(subject,
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Setter,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Setter];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Setter, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_creates_first_level_getter_setter_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(subject,
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.GetterSetter,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.GetterSetter];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.GetterSetter, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_defaults_to_any_type_when_no_type : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(subject,
                        [
                            {
                                method : 'foo',
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Any];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Any, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_defaults_to_any_type_when_null_type : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(subject,
                        [
                            {
                                method : 'foo',
                                type : null,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Any];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Any, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_defaults_to_any_type_when_undefined_type : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(subject,
                        [
                            {
                                method : 'foo',
                                type : undefined,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Any];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Any, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_creates_multi_level_nested_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper1 = function(c) {};
                    var wrapper2 = function(c) {};
                    var wrapper3 = function(c) {};

                    interceptor.intercept(subject,
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Method,
                                wrapper : wrapper1
                            },
                            {
                                method : 'foo',
                                type : CallInfoType.Method,
                                wrapper : wrapper2
                            },
                            {
                                method : 'foo',
                                type : CallInfoType.Method,
                                wrapper : wrapper3
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Method].head;

                    test.strictEqual('foo', item.method);
                    test.strictEqual(wrapper1, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);

                    item = item.next;
                    test.strictEqual('foo', item.method);
                    test.strictEqual(wrapper2, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);

                    item = item.next;
                    test.strictEqual('foo', item.method);
                    test.strictEqual(wrapper3, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);

                    test.strictEqual(null, item.next);

                    test.done();
                },

                intercept_creates_multi_level_nested_substitute_for_multi_infos : function(test) {

                    var subject = function foo() {};

                    var wrapper1 = function(c) {};
                    var wrapper2 = function(c) {};
                    var wrapper3 = function(c) {};
                    var wrapper4 = function(c) {};

                    interceptor.intercept(subject,
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Method,
                                wrapper : wrapper1
                            },
                            {
                                method : 'bar',
                                type : CallInfoType.Method,
                                wrapper : wrapper2
                            },
                            {
                                method : 'foo',
                                wrapper : wrapper3
                            },
                            {
                                method : 'bar',
                                type : CallInfoType.Method,
                                wrapper : wrapper4
                            }
                        ]);

                    var storage = proxy.byPrototype.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 2);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Method].head;

                    test.strictEqual('foo', item.method);
                    test.strictEqual(wrapper1, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);
                    test.strictEqual(null, item.next);

                    item = foo[CallInfoType.Any].head;

                    test.strictEqual('foo', item.method);
                    test.strictEqual(wrapper3, item.wrapper);
                    test.strictEqual(CallInfoType.Any, item.type);
                    test.strictEqual(null, item.next);

                    var bar = storage.known['bar'];
                    item = bar[CallInfoType.Method].head;

                    test.strictEqual('bar', item.method);
                    test.strictEqual(wrapper2, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);

                    item = item.next;

                    test.strictEqual('bar', item.method);
                    test.strictEqual(wrapper4, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);
                    test.strictEqual(null, item.next);

                    test.done();
                },

                intercept_throws_when_no_wrapper: function(test) {

                    var substitute = {
                        method : 'test',
                        type: CallInfoType.Method
                    };

                    var delegate = function() {
                        interceptor.intercept(function foo() {}, [ substitute ]);
                    };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Missing interceptor wrapper');
                        test.strictEqual(error.data, substitute);
                        return error instanceof Scaffold.Exceptions.ArgumentError;
                    });

                    test.expect(3);
                    test.done();
                },

                interceptor_should_throw_ArgumentNullError_when_null_subject : function(test) {

                    var delegate = function() { interceptor.intercept(null); };

                    test.throws(delegate, function(error) {
                        test.strictEqual('subject', error.argumentName);
                        return (error instanceof Scaffold.Exceptions.ArgumentNullError);
                    });

                    test.expect(2);

                    test.done();
                },

                interceptor_should_throw_ArgumentNullError_when_undefined_subject : function(test) {

                    var delegate = function() { interceptor.intercept(undefined); };

                    test.throws(delegate, function(error) {
                        test.strictEqual('subject', error.argumentName);
                        return (error instanceof Scaffold.Exceptions.ArgumentNullError);
                    });

                    test.expect(2);

                    test.done();
                }
            },

            byInstance : {
                setUp : setUp,

                intercept_creates_empty_storage_for_empty_substitute_infos : function(test) {

                    var subject = function foo() {}

                    interceptor.intercept(new subject(), []);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);

                    test.done();
                },

                intercept_creates_multi_level_substitutes_for_one_level_substitute_infos : function(test) {

                    var subject = function foo() { };

                    var wrapper1 = function (c) { };
                    var wrapper2 = function (c) { };

                    interceptor.intercept(new subject(),
                        [
                            {
                                method: 'foo',
                                wrapper: wrapper1
                            },
                            {
                                method: 'bar',
                                wrapper: wrapper2
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 2);

                    var foo = storage.known['foo'];
                    test.strictEqual(Object.getOwnPropertyNames(foo).length, 1);

                    var item = foo[CallInfoType.Any];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper1, item.head.wrapper);
                    test.strictEqual(CallInfoType.Any, item.head.type);
                    test.strictEqual(null, item.head.next);

                    var bar = storage.known['bar'];
                    test.strictEqual(Object.getOwnPropertyNames(bar).length, 1);

                    item = bar[CallInfoType.Any];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('bar', item.head.method);
                    test.strictEqual(wrapper2, item.head.wrapper);
                    test.strictEqual(CallInfoType.Any, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_creates_first_level_method_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(new subject(),
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Method,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Method];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Method, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_creates_first_level_field_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(new subject(),
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Field,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Field];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Field, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_creates_first_level_getter_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(new subject(),
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Getter,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Getter];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Getter, item.head.type);
                    test.strictEqual(null, item.head.next);
                    test.done();
                },

                intercept_creates_first_level_setter_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(new subject(),
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Setter,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Setter];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Setter, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_creates_first_level_getter_setter_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(new subject(),
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.GetterSetter,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.GetterSetter];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.GetterSetter, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_defaults_to_any_type_when_no_type : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(new subject(),
                        [
                            {
                                method : 'foo',
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Any];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Any, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_defaults_to_any_type_when_null_type : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(new subject(),
                        [
                            {
                                method : 'foo',
                                type : null,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Any];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Any, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_defaults_to_any_type_when_undefined_type : function(test) {

                    var subject = function foo() {};

                    var wrapper = function(c) {};

                    interceptor.intercept(new subject(),
                        [
                            {
                                method : 'foo',
                                type : undefined,
                                wrapper : wrapper
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Any];

                    test.strictEqual(item.head, item.tail);

                    test.strictEqual('foo', item.head.method);
                    test.strictEqual(wrapper, item.head.wrapper);
                    test.strictEqual(CallInfoType.Any, item.head.type);
                    test.strictEqual(null, item.head.next);

                    test.done();
                },

                intercept_creates_multi_level_nested_substitute : function(test) {

                    var subject = function foo() {};

                    var wrapper1 = function(c) {};
                    var wrapper2 = function(c) {};
                    var wrapper3 = function(c) {};

                    interceptor.intercept(new subject(),
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Method,
                                wrapper : wrapper1
                            },
                            {
                                method : 'foo',
                                type : CallInfoType.Method,
                                wrapper : wrapper2
                            },
                            {
                                method : 'foo',
                                type : CallInfoType.Method,
                                wrapper : wrapper3
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Method].head;

                    test.strictEqual('foo', item.method);
                    test.strictEqual(wrapper1, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);

                    item = item.next;
                    test.strictEqual('foo', item.method);
                    test.strictEqual(wrapper2, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);

                    item = item.next;
                    test.strictEqual('foo', item.method);
                    test.strictEqual(wrapper3, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);

                    test.strictEqual(null, item.next);

                    test.done();
                },

                intercept_creates_multi_level_nested_substitute_for_multi_infos : function(test) {

                    var subject = function foo() {};

                    var wrapper1 = function(c) {};
                    var wrapper2 = function(c) {};
                    var wrapper3 = function(c) {};
                    var wrapper4 = function(c) {};

                    interceptor.intercept(new subject(),
                        [
                            {
                                method : 'foo',
                                type : CallInfoType.Method,
                                wrapper : wrapper1
                            },
                            {
                                method : 'bar',
                                type : CallInfoType.Method,
                                wrapper : wrapper2
                            },
                            {
                                method : 'foo',
                                wrapper : wrapper3
                            },
                            {
                                method : 'bar',
                                type : CallInfoType.Method,
                                wrapper : wrapper4
                            }
                        ]);

                    var storage = proxy.byInstance.args[0][1];

                    test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                    test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 2);

                    var foo = storage.known['foo'];
                    var item = foo[CallInfoType.Method].head;

                    test.strictEqual('foo', item.method);
                    test.strictEqual(wrapper1, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);
                    test.strictEqual(null, item.next);

                    item = foo[CallInfoType.Any].head;

                    test.strictEqual('foo', item.method);
                    test.strictEqual(wrapper3, item.wrapper);
                    test.strictEqual(CallInfoType.Any, item.type);
                    test.strictEqual(null, item.next);

                    var bar = storage.known['bar'];
                    item = bar[CallInfoType.Method].head;

                    test.strictEqual('bar', item.method);
                    test.strictEqual(wrapper2, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);

                    item = item.next;

                    test.strictEqual('bar', item.method);
                    test.strictEqual(wrapper4, item.wrapper);
                    test.strictEqual(CallInfoType.Method, item.type);
                    test.strictEqual(null, item.next);

                    test.done();
                },

                intercept_throws_when_no_wrapper: function(test) {

                    var substitute = {
                        method : 'test',
                        type: CallInfoType.Method
                    };

                    var subject = function foo() {};

                    var delegate = function() {
                        interceptor.intercept(new subject(), [ substitute ]);
                    };

                    test.throws(delegate, function(error) {
                        test.strictEqual(error.message, 'Missing interceptor wrapper');
                        test.strictEqual(error.data, substitute);
                        return error instanceof Scaffold.Exceptions.ArgumentError;
                    });

                    test.expect(3);
                    test.done();
                }
            }
        };
    })()
}