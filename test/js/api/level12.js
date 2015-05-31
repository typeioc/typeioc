'use strict';

exports.api = {

    level12: (function () {

        var Scaffold = require('./../../scaffold');
        var ScaffoldAddons = require('./../../scaffoldAddons');
        var CallInfoType = ScaffoldAddons.Interceptors.CallInfoType;

        var interceptor = null;
        var containerBuilder = null;

        function resolve(subject, substitutes) {
            var register1 = 'test';
            var register2 = function () {
            };

            containerBuilder.register(register2)
                .as(function (c) {
                    var r1 = c.resolve(register1);
                    return interceptor.intercept(r1, substitutes);
                });

            containerBuilder.register(register1)
                .as(function () {
                    return subject
                });

            var container = containerBuilder.build();
            return container.resolve(register2);
        }

        function resolveByPrototype(subject, substitutes) {
            var register1 = 'test';
            var register2 = function () {
            };

            containerBuilder.register(register2)
                .as(function (c) {
                    var r1 = c.resolve(register1);
                    return interceptor.interceptPrototype(r1, substitutes);
                });

            containerBuilder.register(register1)
                .as(function () {
                    return subject
                });

            var container = containerBuilder.build();
            return container.resolve(register2);
        }

        function resolveByInstance(subject, substitutes) {
            var register1 = 'test';
            var register2 = function () {
            };

            containerBuilder.register(register2)
                .as(function (c) {
                    var r1 = c.resolve(register1);
                    return interceptor.interceptInstance(r1, substitutes);
                });

            containerBuilder.register(register1)
                .as(function () {
                    return subject
                });

            var container = containerBuilder.build();
            return container.resolve(register2);
        }

        function setUp(callback) {
            containerBuilder = Scaffold.createBuilder();
            interceptor = ScaffoldAddons.Interceptors.create();
            callback();
        }


        return {

            intercept_byPrototype: {
                setUp: setUp,

                should_decorate_recursive_method: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };
                    parent.prototype.rec = function(number) {
                        if(!number) return number;

                        this.start = number;

                        return number + this.rec(number - 1);
                    };

                    var Proto = resolve(parent);
                    var instance = new Proto(-1);

                    test.strictEqual(6, instance.rec(3));
                    test.strictEqual(1, instance.start);

                    test.done();
                },

                should_proxy_recursive_method_by_override: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };
                    parent.prototype.rec = function(number) {
                        if(!number) return number;

                        this.start = number;

                        return number + this.rec(number - 1);
                    };

                    var substitute = {
                        method: 'rec',
                        wrapper : function(callInfo) {
                            return callInfo.args[0] + 1;
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto(-1);

                    test.strictEqual(4, instance.rec(3));
                    test.strictEqual(-1, instance.start);

                    test.done();
                },

                should_proxy_recursive_method: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };
                    parent.prototype.rec = function(number) {
                        if(!number) return number;

                        this.start = number;

                        return number + this.rec(number - 1);
                    };

                    var substitute = {
                        method: 'rec',
                        wrapper : function(callInfo) {
                            callInfo.args[0]--;

                            return callInfo.invoke(callInfo.args);
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto(-1);

                    test.strictEqual(2, instance.rec(3));
                    test.strictEqual(2, instance.start);

                    test.done();
                },

                should_proxy_recursive_property: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            if(!this.start) return this.start;

                            this.start--;

                            return this.foo;
                        },
                        set: function (value) {

                            if(!value) return;

                            this.start = value;

                            this.foo = value - 1;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var Proto = resolve(parent);
                    var instance = new Proto(0);
                    instance.foo = 10;

                    test.strictEqual(1, instance.start);

                    instance.start = 10;
                    test.strictEqual(0, instance.foo);

                    test.done();
                },

                should_decorate_recursive_property_by_override: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            if(!this.start) return this.start;

                            this.start--;

                            return this.foo;
                        },
                        set: function (value) {

                            if(!value) return;

                            this.start = value;

                            this.foo = value - 1;
                        },
                        enumerable: true,
                        configurable: true
                    });

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

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto(0);
                    instance.foo = 10;

                    test.strictEqual(11, instance.start);

                    instance.start = 10;
                    test.strictEqual(3, instance.foo);

                    test.done();
                },

                should_decorate_recursive_property: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            if(!this.start) return this.start;

                            this.start--;

                            return this.foo;
                        },
                        set: function (value) {

                            if(!value) return;

                            this.start = value;

                            this.foo = value - 1;
                        },
                        enumerable: true,
                        configurable: true
                    });

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

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto(0);
                    instance.foo = 10;

                    test.strictEqual(1, instance.start);

                    instance.start = 10;
                    test.strictEqual(9, instance.foo);

                    test.done();
                },

                should_use_get_set_for_callInfo_invoke: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            return this.start;
                        },
                        set: function (value) {
                            this.start = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

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

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto(0);
                    instance.foo = 10;

                    test.strictEqual(11, instance.start);
                    test.strictEqual(12, instance.foo);

                    test.done();
                },

                should_set_get_and_set_to_null_form_method : function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    parent.prototype.foo = function() {
                        return this.start;
                    };

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            test.strictEqual(null, callInfo.get);
                            test.strictEqual(null, callInfo.set);
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto(0);
                    instance.foo();

                    test.expect(2);

                    test.done();
                },

                should_call_invoke_with_non_array_parameter : function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    parent.prototype.foo = function(value) {
                        return this.start = value;
                    };

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            return callInfo.invoke(callInfo.args[0]) + callInfo.invoke(callInfo.args);
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto(0);

                    test.strictEqual(200, instance.foo(100));
                    test.strictEqual(100, instance.start);

                    test.done();
                },

                should_call_set_with_exact_value: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            return this.start;
                        },
                        set: function (value) {
                            this.start = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Setter,
                        wrapper : function(callInfo) {
                            callInfo.set(callInfo.args);
                        }
                    };

                    var Proto = resolve(parent, [ substitute ]);
                    var instance = new Proto(0);
                    instance.foo = 10;

                    test.strictEqual(10, instance.start[0]);

                    test.done();
                },

                should_resolve_by_prototype_method_with_args_value: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    parent.prototype.foo = function(value) {
                        return this.start = value;
                    };

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            return callInfo.invoke(callInfo.args[0]) + callInfo.invoke(callInfo.args);
                        }
                    };

                    var Proto = resolveByPrototype(parent, [ substitute ]);
                    var instance = new Proto(0);

                    test.strictEqual(200, instance.foo(100));
                    test.strictEqual(100, instance.start);

                    test.done();
                },

                should_decorate_triple_proxy: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    parent.prototype.foo = function(value) {
                        return this.start + value;
                    };

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

                    var Proto = resolveByPrototype(parent, [ substitute, substitute1, substitute2 ]);
                    var instance = new Proto(1);

                    test.strictEqual(7.5, instance.foo(1));

                    test.done();
                },

                should_decorate_100_method_proxies: function(test) {

                    var parent = function() { };

                    parent.prototype.foo = function(value) {
                        return value;
                    };

                    var accumulator = function(start) {
                        this.start = start;
                    }

                    accumulator.prototype.add = function(value) {
                        this.start += value;
                    }

                    var substitutes = [];
                    var index = 0;
                    var limit = 100;
                    var acc = new accumulator(0);
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

                    var Proto = resolveByPrototype(parent, substitutes);
                    var instance = new Proto();

                    var actual = instance.foo(1);
                    test.strictEqual(acc.start, actual);


                    test.done();
                },

                should_decorate_100_getter_proxies: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };


                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            return this.start;
                        },
                        enumerable: false,
                        configurable: false
                    });

                    var accumulator = function(start) {
                        this.start = start;
                    }

                    accumulator.prototype.add = function(value) {
                        this.start += value;
                    }

                    var substitutes = [];
                    var index = 0;
                    var limit = 100;
                    var acc = new accumulator(0);
                    while(substitutes.length < limit) {

                        substitutes.push({
                            method: 'foo',
                            wrapper : function(callInfo) {

                                index++;
                                acc.add(1);
                                return callInfo.get() + (index === limit ? 0 : callInfo.next());
                            }
                        });
                    }

                    var Proto = resolveByPrototype(parent, substitutes);
                    var instance = new Proto(1);

                    var actual = instance.foo;
                    test.strictEqual(acc.start, actual);

                    test.done();
                }
            },

            intercept_byInstance: {

                setUp: setUp,

                should_proxy_math_pow: function (test) {

                    var math = resolve(Math);

                    test.strictEqual(8, math.pow(2, 3));
                    test.strictEqual(8, Math.pow(2, 3));

                    test.done();
                },

                should_decorate_math_pow: function (test) {

                    var substitute = {
                        method: 'pow',
                        wrapper: function (callInfo) {

                            return callInfo.args[0] + callInfo.args[1];
                        }
                    };

                    var math = resolve(Math, [substitute]);

                    test.strictEqual(5, math.pow(2, 3));
                    test.strictEqual(8, Math.pow(2, 3));

                    test.done();
                },

                should_decorate_array_length: function (test) {

                    var substitute = {
                        method: 'length',
                        wrapper: function (callInfo) {

                            return -1;
                        }
                    };

                    var substitute2 = {
                        method: 'toString',
                        wrapper: function (callInfo) {

                            return 'empty';
                        }
                    };

                    var array = [1, 2, 3];
                    var instance = resolve(array, [substitute, substitute2]);

                    test.strictEqual(-1, instance.length);
                    test.strictEqual(3, array.length);
                    test.strictEqual('empty', instance.toString());
                    test.strictEqual('1,2,3', array.toString());

                    test.done();
                },

                should_use_get_set_for_callInfo_invoke: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            return this.start;
                        },
                        set: function (value) {
                            this.start = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

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

                    var p = new parent(0);
                    var instance = resolve(p, [ substitute ]);
                    instance.foo = 10;

                    test.strictEqual(11, instance.start);
                    test.strictEqual(12, instance.foo);

                    test.done();
                },

                should_set_get_and_set_to_null_form_method : function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    parent.prototype.foo = function() {
                        return this.start;
                    };

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            test.strictEqual(null, callInfo.get);
                            test.strictEqual(null, callInfo.set);
                        }
                    };

                    var p = new parent(10);
                    var instance = resolve(p, [ substitute ]);
                    instance.foo(10);

                    test.expect(2);

                    test.done();
                },

                should_call_invoke_with_non_array_parameter : function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    parent.prototype.foo = function(value) {
                        return this.start = value;
                    };

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            return callInfo.invoke(callInfo.args[0]) + callInfo.invoke(callInfo.args);
                        }
                    };

                    var p = new parent(10);
                    var instance = resolve(p, [ substitute ]);

                    test.strictEqual(200, instance.foo(100));
                    test.strictEqual(100, instance.start);

                    test.done();
                },

                should_call_set_with_exact_value: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            return this.start;
                        },
                        set: function (value) {
                            this.start = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var substitute = {
                        method : 'foo',
                        type : CallInfoType.Setter,
                        wrapper : function(callInfo) {
                            callInfo.set(callInfo.args);
                        }
                    };

                    var p = new parent(0);
                    var instance = resolve(p, [ substitute ]);
                    instance.foo = 10;

                    test.strictEqual(10, instance.start[0]);

                    test.done();
                },

                should_resolve_by_instance_method_with_args_value: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    parent.prototype.foo = function(value) {
                        return this.start = value;
                    };

                    var substitute = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            return callInfo.invoke(callInfo.args[0]) + callInfo.invoke(callInfo.args);
                        }
                    };

                    var instance = resolveByInstance(new parent(0), [ substitute ]);

                    test.strictEqual(200, instance.foo(100));
                    test.strictEqual(100, instance.start);

                    test.done();
                },

                should_decorate_triple_proxy: function(test) {

                    var parent = function(start) {
                        this.start = start;
                    };

                    parent.prototype.foo = function(value) {
                        return this.start + value;
                    };

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

                    var instance = resolveByInstance(new parent(1), [ substitute, substitute1, substitute2 ]);

                    test.strictEqual(7.5, instance.foo(1));

                    test.done();
                },

                should_decorate_100_method_proxies: function(test) {

                    var parent = function() { };

                    parent.prototype.foo = function(value) {
                        return value;
                    };

                    var accumulator = function(start) {
                        this.start = start;
                    }

                    accumulator.prototype.add = function(value) {
                        this.start += value;
                    }

                    var substitutes = [];
                    var index = 0;
                    var limit = 100;
                    var acc = new accumulator(0);
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

                    var instance = resolveByInstance(new parent(), substitutes);

                    var actual = instance.foo(1);
                    test.strictEqual(acc.start, actual);

                    test.done();
                },

                should_decorate_100_property_proxies: function(test) {

                    var parent = function() {
                        this.start = 0;
                    };

                    Object.defineProperty(parent.prototype, 'foo', {
                        get : function() {

                            return this.start;
                        },
                        set: function (value) {

                            this.start = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var accumulator = function(start) {
                        this.start = start;
                    };

                    accumulator.prototype.add = function(value) {
                        this.start += value;
                    };

                    var substitutes = [];
                    var index = 0;
                    var limit = 100;
                    var acc = new accumulator(0);

                    while(substitutes.length < limit) {

                        substitutes.push({
                            method: 'foo',
                            type : CallInfoType.Setter,
                            wrapper : function(callInfo) {

                                index++;
                                acc.add(index);

                                var result = callInfo.result ? callInfo.result + index : index;

                                callInfo.set(result);

                                if(index !== limit) {
                                    callInfo.next(result)
                                };
                            }
                        });
                    }

                    var instance = resolveByInstance(new parent(), substitutes);

                    var actual = instance.foo = 1;
                    test.strictEqual(acc.start, instance.foo);

                    test.done();
                },

                should_decorate_multiple_method_interceptions: function(test) {

                    var substitute1 = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            return 'substitute 1';
                        }
                    };

                    var substitute2 = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            return 'substitute 2'
                        }
                    };

                    var substitute3 = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            return 'substitute 3'
                        }
                    };

                    var parent1 = function(value) {
                        this.value = value;
                    };

                    parent1.prototype.foo = function() {
                        return this.value;
                    };

                    var parent2 = function() { }

                    parent2.prototype.foo = function() {
                        return '--------';
                    };

                    var parent3 = function(value) {
                        this.value = value;
                    };

                    parent3.prototype.foo = function() {
                        return this.value;
                    };

                    var proto1 = interceptor.intercept(parent1,[ substitute1 ]);
                    var proto2 = interceptor.intercept(parent2,[ substitute2 ]);
                    var proto3 = interceptor.intercept(parent3,[ substitute3 ]);

                    var instance1 = new proto1(1);
                    var instance2 = new proto2();
                    var instance3 = new proto3(3);

                    test.strictEqual(instance1.foo('some value 1'), 'substitute 1');
                    test.strictEqual(instance2.foo('some value 2'), 'substitute 2');
                    test.strictEqual(instance3.foo('some value 3'), 'substitute 3');

                    test.done();
                },

                should_decorate_multiple_property_interceptions: function(test) {

                    var substitute1 = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            return 'substitute 1';
                        }
                    };

                    var substitute2 = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            return 'substitute 2'
                        }
                    };

                    var substitute3 = {
                        method : 'foo',
                        wrapper : function(callInfo) {

                            return 'substitute 3'
                        }
                    };

                    var parent1 = function(value) {
                        this.value = value;
                    };

                    Object.defineProperty(parent1.prototype, 'foo', {
                        get : function() {
                            return this.value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var parent2 = function() { }

                    Object.defineProperty(parent2.prototype, 'foo', {
                        get : function() {
                            return '---------';
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var parent3 = function(value) {
                        this.value = value;
                    };

                    Object.defineProperty(parent3.prototype, 'foo', {
                        get : function() {
                            return this.value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    var proto1 = interceptor.intercept(parent1,[ substitute1 ]);
                    var proto2 = interceptor.intercept(parent2,[ substitute2 ]);
                    var proto3 = interceptor.intercept(parent3,[ substitute3 ]);

                    var instance1 = new proto1(1);
                    var instance2 = new proto2();
                    var instance3 = new proto3(3);

                    test.strictEqual(instance1.foo, 'substitute 1');
                    test.strictEqual(instance2.foo, 'substitute 2');
                    test.strictEqual(instance3.foo, 'substitute 3');

                    test.done();
                }
            },

            should_decorate_method_single_interception: function(test) {

                var substitute1 = {
                    method : 'foo',
                    wrapper : function(callInfo) {

                        return 'substitute 1';
                    }
                };

                var parent1 = function(value) {
                    this.value = value;
                };

                parent1.prototype.foo = function() {
                    return this.value;
                };


                var proto1 = interceptor.intercept(parent1, substitute1);
                var instance1 = new proto1(1);

                test.strictEqual(instance1.foo('some value 1'), 'substitute 1');

                test.done();
            }

        }
    })()
}