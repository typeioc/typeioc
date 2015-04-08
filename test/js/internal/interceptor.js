'use strict';

exports.internal = {

    interceptor: (function () {

        var Scaffold = require('../../scaffold');
        var InterceptorModule = require('./../../../lib/interceptors/interceptor');
        var mockery = Scaffold.Mockery;

        var proxy;
        var interceptor;

        return {

            setUp: function (callback) {

                proxy = {
                    fromPrototype : mockery.stub()
                };

                interceptor = new InterceptorModule.Interceptor(proxy);

                callback();
            },

            intercept_creates_empty_storage_for_empty_substitute_infos : function(test) {

                var subject = function foo() {}

                interceptor.intercept(subject, []);

                var storage = proxy.fromPrototype.args[0][1];

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

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 2);

                var foo = storage.known['foo'];
                test.strictEqual(Object.getOwnPropertyNames(foo).length, 1);

                var item = foo[Scaffold.Types.CallInfoType.Any];

                test.strictEqual(item.head, item.tail);

                test.strictEqual('foo', item.head.method);
                test.strictEqual(wrapper1, item.head.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, item.head.type);
                test.strictEqual(null, item.head.next);

                var bar = storage.known['bar'];
                test.strictEqual(Object.getOwnPropertyNames(bar).length, 1);

                item = bar[Scaffold.Types.CallInfoType.Any];

                test.strictEqual(item.head, item.tail);

                test.strictEqual('bar', item.head.method);
                test.strictEqual(wrapper2, item.head.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, item.head.type);
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
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : wrapper
                        }
                    ]);

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.Method];

                test.strictEqual(item.head, item.tail);

                test.strictEqual('foo', item.head.method);
                test.strictEqual(wrapper, item.head.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Method, item.head.type);
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
                            type : Scaffold.Types.CallInfoType.Field,
                            wrapper : wrapper
                        }
                    ]);

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.Field];

                test.strictEqual(item.head, item.tail);

                test.strictEqual('foo', item.head.method);
                test.strictEqual(wrapper, item.head.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Field, item.head.type);
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
                            type : Scaffold.Types.CallInfoType.Getter,
                            wrapper : wrapper
                        }
                    ]);

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.Getter];

                test.strictEqual(item.head, item.tail);

                test.strictEqual('foo', item.head.method);
                test.strictEqual(wrapper, item.head.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Getter, item.head.type);
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
                            type : Scaffold.Types.CallInfoType.Setter,
                            wrapper : wrapper
                        }
                    ]);

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.Setter];

                test.strictEqual(item.head, item.tail);

                test.strictEqual('foo', item.head.method);
                test.strictEqual(wrapper, item.head.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Setter, item.head.type);
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
                            type : Scaffold.Types.CallInfoType.GetterSetter,
                            wrapper : wrapper
                        }
                    ]);

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.GetterSetter];

                test.strictEqual(item.head, item.tail);

                test.strictEqual('foo', item.head.method);
                test.strictEqual(wrapper, item.head.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.GetterSetter, item.head.type);
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

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.Any];

                test.strictEqual(item.head, item.tail);

                test.strictEqual('foo', item.head.method);
                test.strictEqual(wrapper, item.head.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, item.head.type);
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

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.Any];

                test.strictEqual(item.head, item.tail);

                test.strictEqual('foo', item.head.method);
                test.strictEqual(wrapper, item.head.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, item.head.type);
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

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.Any];

                test.strictEqual(item.head, item.tail);

                test.strictEqual('foo', item.head.method);
                test.strictEqual(wrapper, item.head.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, item.head.type);
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
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : wrapper1
                        },
                        {
                            method : 'foo',
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : wrapper2
                        },
                        {
                            method : 'foo',
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : wrapper3
                        }
                    ]);

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.Method].head;

                test.strictEqual('foo', item.method);
                test.strictEqual(wrapper1, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Method, item.type);

                item = item.next;
                test.strictEqual('foo', item.method);
                test.strictEqual(wrapper2, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Method, item.type);

                item = item.next;
                test.strictEqual('foo', item.method);
                test.strictEqual(wrapper3, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Method, item.type);

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
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : wrapper1
                        },
                        {
                            method : 'bar',
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : wrapper2
                        },
                        {
                            method : 'foo',
                            wrapper : wrapper3
                        },
                        {
                            method : 'bar',
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : wrapper4
                        }
                    ]);

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 0);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 2);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.Method].head;

                test.strictEqual('foo', item.method);
                test.strictEqual(wrapper1, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Method, item.type);
                test.strictEqual(null, item.next);

                item = foo[Scaffold.Types.CallInfoType.Any].head;

                test.strictEqual('foo', item.method);
                test.strictEqual(wrapper3, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, item.type);
                test.strictEqual(null, item.next);

                var bar = storage.known['bar'];
                item = bar[Scaffold.Types.CallInfoType.Method].head;

                test.strictEqual('bar', item.method);
                test.strictEqual(wrapper2, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Method, item.type);

                item = item.next;

                test.strictEqual('bar', item.method);
                test.strictEqual(wrapper4, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Method, item.type);
                test.strictEqual(null, item.next);

                test.done();
            },

            intercept_creates_multi_level_nested_substitutes_with_any : function(test) {

                var subject = function foo() {};

                var wrapper1 = function wr1(c) {};
                var wrapper2 = function wr2(c) {};
                var wrapper3 = function wr3(c) {};
                var wrapper4 = function wr4(c) {};
                var wrapper5 = function wr5(c) {};
                var wrapper6 = function wr6(c) {};

                interceptor.intercept(subject,
                    [
                        {
                            method : 'foo',
                            wrapper : wrapper1
                        },
                        {
                            wrapper : wrapper2
                        },
                        {
                            method : 'bar',
                            type : Scaffold.Types.CallInfoType.Any,
                            wrapper : wrapper3
                        },
                        {
                            method : 'foo',
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : wrapper4
                        },
                        {
                            wrapper : wrapper5
                        },
                        {
                            method : 'test',
                            wrapper : wrapper6
                        }
                    ]);

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 1);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 3);

                var foo = storage.known['foo'];
                var item = foo[Scaffold.Types.CallInfoType.Method].head;

                test.strictEqual('foo', item.method);
                test.strictEqual(wrapper4, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Method, item.type);
                test.strictEqual(null, item.next);

                item = foo[Scaffold.Types.CallInfoType.Any].head;

                test.strictEqual('foo', item.method);
                test.strictEqual(wrapper1, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, item.type);
                test.strictEqual(null, item.next);

                var bar = storage.known['bar'];
                item = bar[Scaffold.Types.CallInfoType.Any].head;

                test.strictEqual('bar', item.method);
                test.strictEqual(wrapper3, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, item.type);
                test.strictEqual(null, item.next);

                var any = storage.unknown[Scaffold.Types.CallInfoType.Any].head;

                test.strictEqual(undefined, any.method);
                test.strictEqual(wrapper2, any.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, any.type);

                any = any.next;

                test.strictEqual(undefined, any.method);
                test.strictEqual(wrapper5, any.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, any.type);

                test.strictEqual(null, item.next);

                test.done();
            },

            intercept_creates_substitutes_with_any : function(test) {

                var subject = function foo() {};

                var wrapper1 = function wr1(c) {};
                var wrapper2 = function wr2(c) {};
                var wrapper3 = function wr3(c) {};
                var wrapper4 = function wr4(c) {};
                var wrapper5 = function wr5(c) {};
                var wrapper6 = function wr6(c) {};

                interceptor.intercept(subject,
                    [
                        {
                            wrapper : wrapper1
                        },
                        {
                            type : Scaffold.Types.CallInfoType.GetterSetter,
                            wrapper : wrapper2
                        },
                        {
                            method : 'bar',
                            type : Scaffold.Types.CallInfoType.Any,
                            wrapper : wrapper3
                        },
                        {
                            type : Scaffold.Types.CallInfoType.Method,
                            wrapper : wrapper4
                        },
                        {
                            wrapper : wrapper5
                        },
                        {
                            type : Scaffold.Types.CallInfoType.Field,
                            wrapper : wrapper6
                        }
                    ]);

                var storage = proxy.fromPrototype.args[0][1];

                test.strictEqual(Object.getOwnPropertyNames(storage.unknown).length, 4);
                test.strictEqual(Object.getOwnPropertyNames(storage.known).length, 1);

                var bar = storage.known['bar'];
                var item = bar[Scaffold.Types.CallInfoType.Any].head;

                test.strictEqual('bar', item.method);
                test.strictEqual(wrapper3, item.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, item.type);
                test.strictEqual(null, item.next);

                var any = storage.unknown[Scaffold.Types.CallInfoType.Any].head;

                test.strictEqual(undefined, any.method);
                test.strictEqual(wrapper1, any.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, any.type);

                any = any.next;
                test.strictEqual(undefined, any.method);
                test.strictEqual(wrapper5, any.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Any, any.type);
                test.strictEqual(null, any.next);

                any = storage.unknown[Scaffold.Types.CallInfoType.GetterSetter].head;

                test.strictEqual(undefined, any.method);
                test.strictEqual(wrapper2, any.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.GetterSetter, any.type);
                test.strictEqual(null, any.next);

                any = storage.unknown[Scaffold.Types.CallInfoType.Method].head;

                test.strictEqual(undefined, any.method);
                test.strictEqual(wrapper4, any.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Method, any.type);
                test.strictEqual(null, any.next);

                any = storage.unknown[Scaffold.Types.CallInfoType.Field].head;

                test.strictEqual(undefined, any.method);
                test.strictEqual(wrapper6, any.wrapper);
                test.strictEqual(Scaffold.Types.CallInfoType.Field, any.type);
                test.strictEqual(null, any.next);

                test.done();
            },

            intercept_throws_when_no_wrapper: function(test) {

                var substitute = {
                    method : 'test',
                    type: Scaffold.Types.CallInfoType.Method
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
        };
    })()
}