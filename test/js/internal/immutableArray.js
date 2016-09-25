'use strict';

exports.internal = {

    immutableArray: (function () {

        var Scaffold = require('../../scaffold');
        var ImmutableArray = require('./../../../lib/utils/immutableArray').default;

        function createArray(data) {
            return new ImmutableArray(data);
        }


        return {

            constructor_should_throw_when_null : function(test) {

                var delegate = function() { createArray(null); };

                test.throws(delegate, function(error) {
                    test.strictEqual('data', error.argumentName);
                    return (error instanceof Scaffold.Exceptions.ArgumentNullError);
                });

                test.expect(2);

                test.done();
            },

            constructor_should_throw_when_undefined : function(test) {

                var delegate = function() { createArray(undefined); };

                test.throws(delegate, function(error) {
                    test.strictEqual('data', error.argumentName);
                    return (error instanceof Scaffold.Exceptions.ArgumentNullError);
                });

                test.expect(2);

                test.done();
            },

            constructor_should_throw_when_not_array : function(test) {

                var delegate = function() { createArray(123); };

                test.throws(delegate, function(error) {
                    test.strictEqual('data', error.argumentName);
                    return (error instanceof Scaffold.Exceptions.ArgumentError);
                });

                test.expect(2);

                test.done();
            },

            constructor_should_throw_when_string : function(test) {

                var delegate = function() { createArray('test'); };

                test.throws(delegate, function(error) {
                    test.strictEqual('data', error.argumentName);
                    return (error instanceof Scaffold.Exceptions.ArgumentError);
                });

                test.expect(2);

                test.done();
            },

            should_create_array_of_empty_data : function(test) {

                var array = createArray([]);

                var value = array.value;

                test.ok(value);
                test.ok(Array.isArray(value));
                test.strictEqual(0, value.length);

                test.done();
            },

            should_create_array_of_data : function(test) {

                var array = createArray([1, 2, 3]);

                var value = array.value;

                test.ok(value);
                test.ok(Array.isArray(value));
                test.strictEqual(3, value.length);
                test.strictEqual(1, value[0]);
                test.strictEqual(2, value[1]);
                test.strictEqual(3, value[2]);

                test.done();
            },

            should_create_array_of_data_types : function(test) {

                var array = createArray([1, '2', { prop : 3}]);

                var value = array.value;

                test.ok(value);
                test.ok(Array.isArray(value));
                test.strictEqual(3, value.length);
                test.strictEqual(1, value[0]);
                test.strictEqual('2', value[1]);
                test.strictEqual(3, value[2].prop);

                test.done();
            },

            should_create_immutable_array : function(test) {

                var array = createArray([1, 2, 3]);

                var value1 = array.value;
                var value2 = array.value;

                test.notStrictEqual(value1, value2);
                test.strictEqual(value1[0], value2[0]);
                test.strictEqual(value1[1], value2[1]);
                test.strictEqual(value1[2], value2[2]);

                test.done();
            },

            should_alter_value : function(test) {

                var array = createArray([1, 2, 3]);

                var value = array.value;

                value.push(4);

                test.strictEqual(4, value[3]);

                test.done();
            },

            should_seal_array_elements : function(test) {

                var array = createArray([1, '2', function() { var t = 111;}, { prop : 3}]);

                var value = array.value;

                value[0] = 7;
                test.strictEqual(7, value[0]);

                value[1] = '7';
                test.strictEqual('7', value[1]);

                value[2] = function aaa() {};
                test.strictEqual('aaa', value[2].name);

                var lastValue  = value[3];

                value[3] = { prop: 7 };
                test.strictEqual(7, value[3].prop);

                var delegate = function() { lastValue.prop = 7; }

                test.throws(delegate, function(error) {
                    var index = error.message.indexOf('Cannot assign to read only property \'prop\''); 
                    test.ok(index >= 0);
                    return (error instanceof TypeError);
                });

                test.done();
            }
        }
    })()

}