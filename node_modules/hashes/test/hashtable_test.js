/*global describe:true, it:true*/
describe('HashTable', function () {

    var jsHash = require("./../hashes.js"),
        should = require("should"),
        options = {
            "getHashCode": function (key) {
                if (key === undefined) {
                    return "undefined";
                }

                if (key === null) {
                    return "null";
                }

                return key.toString();
            },

            "equal": function (first, second) {
                return first === second;
            }

        },
    key1 = {}, key2 = { someKey: "someKey", getHashCode: function () { return "key"; } }, key3 = {}, key4 = {},
    value1 = "Some string", value2 = "Another string",
    keyValuePairs = [
    {
        key: "a",
        value: "b"
    },
    {
        key: "a",
        value: "c"
    },
    {
        key: "b",
        value: "d"
    }
    ], keys = ["a", "b", "c", "a", "k"],
    values = ["d", "e", "f", "g"],




    hashtable = new jsHash.HashTable();

    it('should convert string to hash correctly', function () {
        jsHash.statics.stringToHash("AAA").should.equal(4030);
        jsHash.statics.stringToHash("This is a long string").should.equal(57784);
    });

    //Prototype functions tests

    it('Initial HashTable should be empty', function () {
        hashtable.count().should.equal(0);
    });

    it('should add a key, value pair to the HashTable', function () {
        hashtable.add(key1, value1);
        hashtable.count().should.equal(1);
    });

    it('should get the value of key1 from the HashTable', function () {
        var data = hashtable.get(key1);
        should.exist(data.value);
        data.value.should.equal(value1);
        should.exist(data.key);
        data.key.should.equal(key1);
    });

    it('should not add a key, value pair to the HashTable', function () {
        hashtable.add(key1, value1, false).should.equal(false);
        hashtable.count().should.equal(1);
    });

    it('should overwrite a give key', function () {
        hashtable.add(key1, value2, true).should.equal(true);
        hashtable.count().should.equal(1);
        var value = hashtable.get(key1).value;
        should.exist(value);
        value.should.equal(value2);
    });

    it('should clear the HashTable', function () {
        var value;
        hashtable.clear();
        hashtable.count().should.equal(0);
        value = hashtable.get(key1);
        should.not.exist(value);
    });

    it('should add multiple keys with the same hash', function () {
        hashtable.add(key1, "1", false);
        hashtable.add(key3, "3", false);
        hashtable.add(key4, "4", false);
        hashtable.count().should.equal(3);
        var value = hashtable.get(key3).value;
        should.exist(value);
        value.should.equal("3");
    });

    it('should remove a value from the HashTable', function () {
        var value;
        value = hashtable.remove(key4);
        value.should.equal(true);
        value = hashtable.remove(key1);
        value.should.equal(true);
        hashtable.count().should.equal(1);
    });

    it('should check if a HashTable contains a key', function () {
        var value;
        value = hashtable.contains(key1);
        value.should.equal(false);
        value = hashtable.contains(key3);
        value.should.equal(true);
    });

    it('should add multiple hash codes', function () {
        hashtable.add(key2, "2", false);
        hashtable.count().should.equal(2);
        var value = hashtable.get(key2).value;
        should.exist(value);
        value.should.equal("2");
    });

    it('should get all the hashes in the HashTable', function () {
        var hashes = hashtable.getHashes();
        should.exist(hashes);
        hashes.length.should.equal(2);
    });

    it('should get all the key-value pairs in the HashTable', function () {
        var keyValuePairs = hashtable.getKeyValuePairs();
        should.exist(keyValuePairs);
        keyValuePairs.length.should.equal(2);
        keyValuePairs[0].key.should.equal(key3); //Not so robust :(
        keyValuePairs[0].value.should.equal("3");
    });

    it('should clone a HashTable', function () {
        var otherTable = hashtable.clone(), value;
        value = otherTable.contains(key1);
        value.should.equal(false);
        value = otherTable.contains(key3);
        value.should.equal(true);
        value = otherTable.get(key2).value;
        should.exist(value);
        value.should.equal("2");
        otherTable.count().should.equal(hashtable.count());
    });



    it('should add a range of elements', function () {
        var count;
        hashtable.clear();
        count = hashtable.addRange(keyValuePairs);
        count.should.equal(2);
        hashtable.count().should.equal(2);
        hashtable.get(keyValuePairs[0].key).value.should.equal("b");

        hashtable.clear();
        count = hashtable.addRange(keyValuePairs, false);
        count.should.equal(2);
        hashtable.count().should.equal(2);
        hashtable.get(keyValuePairs[0].key).value.should.equal("b");

        hashtable.clear();
        count = hashtable.addRange(keyValuePairs, true);
        count.should.equal(3);
        hashtable.count().should.equal(2);
        hashtable.get(keyValuePairs[0].key).value.should.equal("c");
    });

    it('should add a range of elements 2', function () {
        var count;
        hashtable.clear();
        count = hashtable.addRange(keys, values);
        count.should.equal(3);
        hashtable.count().should.equal(3);
        hashtable.get(keyValuePairs[0].key).value.should.equal("d");

        hashtable.clear();
        count = hashtable.addRange(keys, values, false);
        count.should.equal(3);
        hashtable.count().should.equal(3);
        hashtable.get(keyValuePairs[0].key).value.should.equal("d");

        hashtable.clear();
        count = hashtable.addRange(keys, values, true);
        count.should.equal(4);
        hashtable.count().should.equal(3);
        hashtable.get(keyValuePairs[0].key).value.should.equal("g");
    });

    it('should union two HashTables using the static method', function () {
        var hashtable1 = new jsHash.HashTable(),
            hashtable2 = new jsHash.HashTable(),
            result;
        hashtable1.add("a", "b");
        hashtable2.add("c", "d");
        result = jsHash.HashTable.union(hashtable1, hashtable2);
        should.exist(result);
        result.count().should.equal(2);
        result.get("a").value.should.equal("b");
        result.get("c").value.should.equal("d");
        hashtable2.add("a", "e");
        result = jsHash.HashTable.union(hashtable1, hashtable2, {}, true);
        result.count().should.equal(2);
        result.get("a").value.should.equal("e");
        result.get("c").value.should.equal("d");
    });

    it('should intersect two HashTables using the static method', function () {
        var hashtable1 = new jsHash.HashTable(),
            hashtable2 = new jsHash.HashTable(),
            result;
        hashtable1.add("a", "b");
        hashtable1.add("e", "f");

        hashtable2.add("a", "b");
        hashtable2.add("c", "d");

        result = jsHash.HashTable.intersection(hashtable1, hashtable2);
        should.exist(result);
        result.count().should.equal(1);
        result.get("a").value.should.equal("b");
    });

    it('should calculate the difference of two HashTables using the static method', function () {
        var hashtable1 = new jsHash.HashTable(),
            hashtable2 = new jsHash.HashTable(),
            result;
        hashtable1.add("a", "b");
        hashtable1.add("e", "f");

        hashtable2.add("a", "b");
        hashtable2.add("c", "d");

        result = jsHash.HashTable.difference(hashtable1, hashtable2);
        should.exist(result);
        result.count().should.equal(1);
        result.get("e").value.should.equal("f");
    });

    it('should calculate the symmetric difference of two HashTables using the static method', function () {
        var hashtable1 = new jsHash.HashTable(),
            hashtable2 = new jsHash.HashTable(),
            result;
        hashtable1.add("a", "b");
        hashtable1.add("e", "f");

        hashtable2.add("a", "ff");
        hashtable2.add("c", "d");

        result = jsHash.HashTable.symmetricDifference(hashtable1, hashtable2);
        should.exist(result);
        result.count().should.equal(2);
        result.get("e").value.should.equal("f");
        result.get("c").value.should.equal("d");
    });

});