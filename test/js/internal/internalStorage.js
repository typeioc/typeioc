
'use strict';

var InternalStorageModule = require('../../../lib/storage/internalStorage');

exports.internal = {};
exports.internal.InternalStorage = (function() {

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
        }
    };
})();