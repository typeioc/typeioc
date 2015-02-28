
'use strict';

exports.internal = {

    proxy: (function () {

        var Scaffold = require('../../scaffold');
        var ProxyModule = require('./../../../lib/interceptors/proxy');

        var proxy;

        return {

            setUp: function (callback) {

                proxy = new ProxyModule.Proxy();

                callback();
            },

            fromPrototype_should_decorate_prototype_method_by_name : function(test) {

                function parent(arg1) {
                    this.arg1 = arg1;
                }

                parent.prototype.foo = function(){
                    return this.arg1;
                };

                var substitute = {
                    method : 'foo',
                    wrapper : function(callInfo) {

                        return 2 * callInfo.invoke();
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto(2);

                test.strictEqual(4, instance.foo());

                test.done();
            },

            fromPrototype_should_decorate_prototype_method_by_function : function(test) {

                function parent(arg1) {
                    this.arg1 = arg1;
                }

                parent.prototype.foo = function(){
                    return this.arg1;
                };

                var substitute = {
                    method : parent.prototype.foo,
                    wrapper : function(callInfo) {

                        return 2 * callInfo.invoke();
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto(2);

                test.strictEqual(4, instance.foo());

                test.done();
            },

            fromPrototype_should_decorate_inherited_prototype_method : function(test) {

                var grandParent = { foo : function() { return 3;} };

                function parent() { }
                parent.prototype = grandParent;

                var substitute = {
                    method : parent.prototype.foo,
                    wrapper : function(callInfo) {

                        return 3 * callInfo.invoke();
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);
                var instance = new Proto();

                test.strictEqual(9, instance.foo());

                test.done();
            },

            fromPrototype_should_decorate_static_method : function(test) {

                function parent() { }
                parent.foo = function() { return 3; }

                var substitute = {
                    method : parent.foo,
                    wrapper : function(callInfo) {

                        return 3 * callInfo.invoke();
                    }
                };

                var Proto = proxy.fromPrototype(parent, [ substitute ]);

                test.strictEqual(9, Proto.foo());

                test.done();
            }

        };
    })()

}
