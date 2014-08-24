
'use strict';

exports.internal = {

    utils : (function() {

        var Scaffold = require('../../scaffold');
        var Utils = Scaffold.Utils;


        return  {
            getParamNames_returns_param_names : function(test) {
                var testFunc = function(a, b, c) { }

                var result = Utils.getParamNames(testFunc);
                test.ok(Array.isArray(result));
                test.strictEqual(result.length, 3);
                test.strictEqual(result[0], 'a');
                test.strictEqual(result[1], 'b');
                test.strictEqual(result[2], 'c');

                test.done();
            },

            getParamNames_returns_0_when_no_params : function(test) {
                var testFunc = function() { }

                var result = Utils.getParamNames(testFunc);
                test.ok(Array.isArray(result));
                test.strictEqual(result.length, 0);

                test.done();
            },

            getFactoryArgsCount_returns_params_count_for_factory : function(test) {
                var factory  = function(c, a, b, s) {}

                var result = Utils.getFactoryArgsCount(factory);

                test.equal(result, 31);

                test.done();
            },

            getFactoryArgsCount_returns_0_for_factory_container_no_params : function(test) {
                var factory  = function(c) {}

                var result = Utils.getFactoryArgsCount(factory);

                test.equal(result, 0);

                test.done();
            },

            getFactoryArgsCount_returns_0_for_factory_no_params : function(test) {
                var factory  = function() {}

                var result = Utils.getFactoryArgsCount(factory);

                test.equal(result, 0);

                test.done();
            },

            isCompatible_returns_true_when_same_properties : function(test) {
                var obj1 = {
                    a : 1, b : function() {}
                };

                var obj2 = {
                    a : 10, b : function() {}
                };

                var result = Utils.isCompatible(obj1, obj2);

                test.ok(result);

                test.done();
            },

            isCompatible_returns_false_when_no_same_properties : function(test) {
                var obj1 = {
                    a : 1, b : 11
                };

                var obj2 = {
                    a : 10, b : function() {}
                };

                var result = Utils.isCompatible(obj1, obj2);

                test.ok(result == false);

                test.done();
            },

            isCompatible_returns_true_when_inheritance : function(test) {

                var obj1 = function() {
                    this.a = 1;
                }
                obj1.prototype.b = function() {}
                obj1.prototype.d = function() {}

                var obj2 = function() {
                    this.c = 1;
                }

                obj2.prototype =  Object.create(obj1.prototype);
                obj2.prototype.constructor = obj2;
                obj2.prototype.d2 = function() {}

                var result = Utils.isCompatible(new obj2(), new obj1());

                test.ok(result);

                test.done();
            },

            isCompatible_returns_false_when_inheritance_and_extention : function(test) {

                var obj1 = function() {
                    this.a = 1;
                }
                obj1.prototype.b = function() {}
                obj1.prototype.d = function() {}

                var obj2 = function() {
                    this.c = 1;
                }

                obj2.prototype =  Object.create(obj1.prototype);
                obj2.prototype.constructor = obj2;
                obj2.prototype.d2 = function() {}

                var result = Utils.isCompatible(new obj1(), new obj2());

                test.ok(result === false);

                test.done();
            },

            construct_create_instance_no_params : function(test) {
                var factory  = function() {
                    this.a = 1;
                }

                var result = Utils.construct(factory);

                test.ok(result);
                test.equal(1, result.a);

                test.done();
            },

            construct_create_instance_with_params : function(test) {
                var factory  = function(a, b, c) {
                    this.a = a + b + c;
                }

                var result = Utils.construct(factory, [1, 2, 3]);

                test.ok(result);
                test.equal(1 + 2 + 3, result.a);

                test.done();
            }
        };
    })()
}

