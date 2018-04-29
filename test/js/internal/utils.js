
'use strict';

exports.internal = {

    utils: (function () {

        const Scaffold = require('../scaffold');
        const Utils = Scaffold.Utils;


        return {

            getFactoryArgsCount_returns_params_count_for_factory: function (test) {
                var factory = function (c, a, b, s) { };

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 3);

                test.done();
            },
            
            getFactoryArgsCount_returns_params_count_for_lambda: function (test) {
                var factory = (c, a, b, s) => { };

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 3);

                test.done();
            },
            
            getFactoryArgsCount_returns_params_count_for_lambda_no_b: function (test) {
                var factory = (c, a, b, s) => 1;

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 3);

                test.done();
            },
            
            getFactoryArgsCount_returns_0_for_container_no_params: function (test) {
                var factory = function (c) { };

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 0);

                test.done();
            },
            
            getFactoryArgsCount_returns_0_for_lambda_container_no_params: function (test) {
                var factory = (c) => {};

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 0);

                test.done();
            },
            
            getFactoryArgsCount_returns_0_for_lambda_no_b_container_no_params: function (test) {
                var factory = (c) => 1;

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 0);

                test.done();
            },
            
            getFactoryArgsCount_returns_0_for_lambda_no_p_container_no_params: function (test) {
                var factory = c => {};

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 0);

                test.done();
            },
            
            getFactoryArgsCount_returns_0_for_lambda_no_pb_container_no_params: function (test) {
                var factory = c => 1;

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 0);

                test.done();
            },

            getFactoryArgsCount_returns_0_for_no_params: function (test) {
                var factory = function () { };

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 0);

                test.done();
            },
            
            getFactoryArgsCount_returns_0_for_lambda_no_params: function (test) {
                var factory = () => {};

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 0);

                test.done();
            },
            
            getFactoryArgsCount_returns_0_for_lambda_no_b_no_params: function (test) {
                var factory = () => 1;

                var result = Utils.Reflection.getFactoryArgsCount(factory);

                test.equal(result, 0);

                test.done();
            },

            isCompatible_returns_true_when_same_properties: function (test) {
                var obj1 = {
                    a: 1, b: function () {
                    }
                };

                var obj2 = {
                    a: 10, b: function () {
                    }
                };

                var result = Utils.Reflection.isCompatible(obj1, obj2);

                test.ok(result);

                test.done();
            },

            isCompatible_returns_false_when_no_same_properties: function (test) {
                var obj1 = {
                    a: 1, b: 11
                };

                var obj2 = {
                    a: 10, b: function () {
                    }
                };

                var result = Utils.Reflection.isCompatible(obj1, obj2);

                test.ok(result == false);

                test.done();
            },

            isCompatible_returns_true_when_inheritance: function (test) {

                var obj1 = function () {
                    this.a = 1;
                }
                obj1.prototype.b = function () {
                }
                obj1.prototype.d = function () {
                }

                var obj2 = function () {
                    this.c = 1;
                }

                obj2.prototype = Object.create(obj1.prototype);
                obj2.prototype.constructor = obj2;
                obj2.prototype.d2 = function () {
                }

                var result = Utils.Reflection.isCompatible(new obj2(), new obj1());

                test.ok(result);

                test.done();
            },

            isCompatible_returns_false_when_inheritance_and_extention: function (test) {

                var obj1 = function () {
                    this.a = 1;
                }
                obj1.prototype.b = function () {
                }
                obj1.prototype.d = function () {
                }

                var obj2 = function () {
                    this.c = 1;
                }

                obj2.prototype = Object.create(obj1.prototype);
                obj2.prototype.constructor = obj2;
                obj2.prototype.d2 = function () {
                }

                var result = Utils.Reflection.isCompatible(obj1.prototype, obj2.prototype);

                test.ok(result === false);

                test.done();
            },

            construct_create_instance_no_params: function (test) {
                var factory = function () {
                    this.a = 1;
                }

                var result = Utils.Reflection.construct(factory);

                test.ok(result);
                test.equal(1, result.a);

                test.done();
            },

            construct_create_instance_with_params: function (test) {
                var factory = function (a, b, c) {
                    this.a = a + b + c;
                }

                var result = Utils.Reflection.construct(factory, [1, 2, 3]);

                test.ok(result);
                test.equal(1 + 2 + 3, result.a);

                test.done();
            }
        };
    })()
}