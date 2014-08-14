
'use strict';

exports.internal = {

    internalStorage : (function() {

        var Scaffold = require('../../scaffold');
        var InternalStorageModule = require('../../../lib/storage/internalStorage');

        var internalStorage;

        return {

            setUp: function (callback) {
                internalStorage = new InternalStorageModule.InternalStorage();
                callback();
            },

            add_get_key_stores_retrieves_data : function(test) {

                var key = 'key';
                var value = { test : 777 };

                internalStorage.add(key, value);

                var actual = internalStorage.get(key);

                test.equal(actual, value);
                test.deepEqual(actual, value);

                test.done();
            },

            add_get_key_operates_with_objects : function(test) {

                var key =  { key : 111 };
                var value = { test : 777 };

                internalStorage.add(key, value);

                var actual = internalStorage.get(key);

                test.equal(actual, value);
                test.deepEqual(actual, value);

                test.done();
            },

            add_get_key_operates_with_functions : function(test) {

                var key =  function fkey() {};
                var value = { test : 777 };

                internalStorage.add(key, value);

                var actual = internalStorage.get(key);

                test.equal(actual, value);
                test.deepEqual(actual, value);

                test.done();
            },

            add_get_key_throws_when_wrong_key : function(test) {

                var key =  { key : 111 };
                var key2 = { key : 111 };
                var value = { test : 777 };

                internalStorage.add(key, value);

                var delegate = function() {
                    internalStorage.get(key2);
                }

                test.throws(delegate, function(error) {
                    return (error instanceof Scaffold.Exceptions.StorageKeyNotFoundError);
                });

                test.done();
            },

            get_key_throws_when_no_item_in_collection : function(test) {

                var key =  { key : 111 };

                var delegate = function() {
                    internalStorage.get(key);
                }

                test.throws(delegate, function(error) {
                    test.strictEqual(key, error.data.key);

                    return (error instanceof Scaffold.Exceptions.StorageKeyNotFoundError);
                });

                test.done();
            },

            get_key_throws_with_data_key : function(test) {

                var key =  { key : 111 };

                var delegate = function() {
                    internalStorage.get(key);
                }

                test.throws(delegate, function(error) {

                    test.equal(key, error.data.key);

                    return true;
                });

                test.expect(2);

                test.done();
            },

            tryGet_returns_undefined_when_no_value : function(test) {
                var key =  { key : 111 };

                var value = internalStorage.tryGet(key);

                test.ok(value === undefined);

                test.done();
            },

            tryGet_returns_value : function(test) {
                var key =  { key : 111 };
                var value = {prop : 777};
                internalStorage.add(key, value);

                var result = internalStorage.tryGet(key);

                test.equal(value, result);
                test.equal(value.prop, result.prop);

                test.done();
            },

            register_adds_default_value_when_no_key : function(test) {
                var key =  { key : 111 };
                var value = {prop : 777};

                var returnValue = internalStorage.register(key, function() {
                    return value;
                });

                var result = internalStorage.get(key);

                test.equal(value, returnValue);
                test.equal(value, result);
                test.equal(value.prop, returnValue.prop);
                test.equal(value.prop, result.prop);

                test.done();
            },

            register_returns_value_for_existing_key : function(test) {
                var key =  { key : 111 };
                var value = {prop : 777};
                var defaultValue = {prop : -1};

                internalStorage.add(key, value);

                var returnValue = internalStorage.register(key, function() {
                    return defaultValue;
                });

                var getResult = internalStorage.get(key);

                test.equals(value, returnValue);
                test.equals(value.prop, returnValue.prop);
                test.equals(value, getResult);
                test.equals(value.prop, getResult.prop);
                test.notEqual(defaultValue, returnValue);
                test.notEqual(defaultValue, getResult);

                test.done();
            },

            contains_returns_true_when_key_present : function(test) {
                var key =  { key : 111 };
                var value = {prop : 777};

                internalStorage.add(key, value);

                var result = internalStorage.contains(key);

                test.ok(result);

                test.done();
            },

            contains_returns_false_when_no_key_present : function(test) {
                var key =  { key : 111 };

                var result = internalStorage.contains(key);

                test.ok(result === false);

                test.done();
            }
        };
    })()
}