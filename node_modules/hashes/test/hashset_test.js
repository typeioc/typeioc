/*global describe:true, it:true*/
describe('HashSet', function () {

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
    key1 = {}, key2 = { someKey: "someKey", getHashCode: function () { return "key"; } }, key3 = {},
    value1 = "Some string", value2 = "Another string",

    hashset = new jsHash.HashSet();

    //Prototype functions tests

    it('Initial HashSet should be empty', function () {
        hashset.count().should.equal(0);
    });

    it('should add a key, value pair to the HashSet', function () {
        hashset.add(key1);
        hashset.count().should.equal(1);
    });

    it('should get key1 from the HashSet', function () {
        var data = hashset.get(key1);
        should.exist(data);
        data.should.equal(key1);
    });

    it('should not add a key, value pair to the HashSet', function () {
        hashset.add(key1, false);
        hashset.count().should.equal(1);
    });

    it('should overwrite a given key', function () {
        hashset.add(key1, true);
        hashset.count().should.equal(1);
        var data = hashset.get(key1);
        should.exist(data);
        data.should.equal(key1);
    });

    it('should clear the HashSet', function () {
        var value;
        hashset.clear();
        hashset.count().should.equal(0);
        value = hashset.get(key1);
        should.not.exist(value);
    });

    it('should add keys with different hashes', function () {
        hashset.add(key1);
        hashset.count().should.equal(1);
        hashset.add(key2);
        hashset.count().should.equal(2);
    });

    it('should remove a value from the HashSet', function () {
        var value;
        value = hashset.remove(key1);
        value.should.equal(true);
        hashset.count().should.equal(1);
    });

    it('should check if a HashSet contains a key', function () {
        var value;
        value = hashset.contains(key1);
        value.should.equal(false);
        value = hashset.contains(key2);
        value.should.equal(true);
    });

    it('should get all the hashes in the HashSet', function () {
        var hashes;
        hashset.add(key1);
        hashes = hashset.getHashes();
        should.exist(hashes);
        hashes.length.should.equal(2);
    });

    it('should get all the keys in the HashSet', function () {
        var keys = hashset.getKeys();
        should.exist(keys);
        keys.length.should.equal(2);
        keys[1].should.equal(key1); //Not so robust :(
    });

    it('should clone a HashSet', function () {
        var otherSet = hashset.clone(), value;
        value = otherSet.contains(key3);
        value.should.equal(false);
        value = otherSet.contains(key2);
        value.should.equal(true);
        value = otherSet.get(key2);
        should.exist(value);
        value.should.equal(key2);
        otherSet.count().should.equal(hashset.count());
    });

    it('should add a range of elements', function () {
        var count, data = ["a", "b", "c"],
            special = {
                getHashCode: function () { return "a"; },
                equal: function (other) { if (other === "a") return true; }
            },
            hashset = new jsHash.HashSet()

        count = hashset.addRange(data);
        count.should.equal(3);
        hashset.count().should.equal(3);
        hashset.get("a").should.equal("a");

        hashset.clear();
        count = hashset.addRange(data, false);
        count.should.equal(3);
        hashset.count().should.equal(3);
        hashset.get("a").should.equal("a");

        data.push(special);
        hashset.clear();
        count = hashset.addRange(data, true);
        count.should.equal(4);
        hashset.count().should.equal(3);
    });

    it('should union two HashSets using the static method', function () {
        var hashset1 = new jsHash.HashSet(),
            hashset2 = new jsHash.HashSet(),
            special = {
                getHashCode: function () { return "a"; },
                equal: function (other) { if (other === "a") return true; }
            }, result;

        hashset1.add("a");
        hashset2.add("c");
        result = jsHash.HashSet.union(hashset1, hashset2);
        should.exist(result);
        result.count().should.equal(2);
        result.get("a").should.equal("a");
        result.get("c").should.equal("c");
        hashset2.add(special);
        result = jsHash.HashSet.union(hashset1, hashset2, {}, true);
        result.count().should.equal(2);
        result.get("c").should.equal("c");
    });

    it('should intersect two HashSets using the static method', function () {
        var hashset1 = new jsHash.HashSet(),
            hashset2 = new jsHash.HashSet(),
            result;
        hashset1.add("a");
        hashset1.add("e");

        hashset2.add("a");
        hashset2.add("c");

        result = jsHash.HashSet.intersection(hashset1, hashset2);
        should.exist(result);
        result.count().should.equal(1);
        result.get("a").should.equal("a");
    });

    it('should calculate the difference of two HashSets using the static method', function () {
        var hashset1 = new jsHash.HashSet(),
            hashset2 = new jsHash.HashSet(),
            result;
        hashset1.add("a");
        hashset1.add("e");

        hashset2.add("a");
        hashset2.add("c");

        result = jsHash.HashSet.difference(hashset1, hashset2);
        should.exist(result);
        result.count().should.equal(1);
        result.get("e").should.equal("e");
    });

    it('should calculate the symmetric difference of two HashSets using the static method', function () {
        var hashset1 = new jsHash.HashSet(),
            hashset2 = new jsHash.HashSet(),
            result;
        hashset1.add("a");
        hashset1.add("e");

        hashset2.add("a");
        hashset2.add("c");

        result = jsHash.HashSet.symmetricDifference(hashset1, hashset2);
        should.exist(result);
        result.count().should.equal(2);
        result.get("e").should.equal("e");
        result.get("c").should.equal("c");
    });



});