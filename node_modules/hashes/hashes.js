
//A key-value pair constructor function for internal use
var KeyValuePair = function (key, value) {
    this._key = key;
    this._value = value;
};

///Various static methods. Override these methods to change the behavior of all hashes objects
var statics = (function () {
    return {
        //Makes sure that the key is valid for the HashTable
        verifyKey: function (key) {
            if (key === undefined || key === null) {
                throw new Error("Key cannot be undefined or null");
            }

            return true;
        },
        ///Converts a string to a numeric hash
        stringToHash: function stringToHash(s) {
            var i, stringData = s, result = 0;

            if (s === null || s === undefined) {
                return 0;
            }
            if (typeof (s) !== "string") {
                stringData = s.toString();
            }
            if (!stringData) {
                return 0;
            }
            if (typeof (stringData) !== "string") {
                throw new Error("stringToHash: A string argument expected or any object that implements toString()");
            }
            i = stringData.length - 1;
            while (i > 0) {
                result = stringData.charCodeAt(i) * 31 + result;
                result = result & result;
                i -= 1;
            }
            return result & result;
        },

        /// Compares the first item to the second items and returns true if the two items are equal and false otherwise
        defaultEqual: function (first, second) {
            return first === second;
        },

        /// Returns the hash of a given key based on the provided options
        getHash: function (key, options) {
            if (options && options.hasOwnProperty("getHashCode")) {
                return options.getHashCode(key);
            }

            if (key.getHashCode !== undefined && typeof (key.getHashCode) === "function") {
                return key.getHashCode();
            }

            return key.toString();
        },

        /// Returns the most appropriate equal function based on the options and the key
        getEqual: function (key, options) {
            if (options && options.equal) {
                return options.equal;
            } else {
                if (key.equal !== undefined && typeof (key.equal) === "function") {
                    return key.equal;
                } else {
                    return statics.defaultEqual;
                }
            }
        },

        /// Shallow copies only the relevant properties and functions from the options object
        copyOptions: function (options) {
            if (options === undefined || options === null) {
                return undefined;
            }

            var result = {};
            if (options.hasOwnProperty("getHashCode")) {
                result.getHashCode = options.getHashCode;
            }
            if (options.hasOwnProperty("equal")) {
                result.equal = options.equal;
            }

            return result;
        }
    };

})();

var HashTable = (function () {

    function HashTable(options) {
        this._buckets = {
        };
        this._count = 0;
        this._options = statics.copyOptions(options);
    }

    //Static functions

    //Searches the given key within the given bucket. If the key is found then returns the index in the bucket,
    //otherwise returns -1
    HashTable.getKeyIndex = function (bucket, key, options) {
        var i, bucketLength = bucket.length, equality, currentItem;
        equality = statics.getEqual(key, options);
        for (i = 0; i < bucketLength; i += 1) {
            currentItem = bucket[i];
            if (currentItem !== undefined && equality(currentItem._key, key)) {
                return i;
            }
        }

        return -1;
    };

    ///A static function that adds the given key value pair to the given bucket
    HashTable.addToBucket = function (bucket, key, value, options) {
        bucket.push(new KeyValuePair(key, value));
    };


    //Removes the key from the given bucket. Returns false if the key was not found in the bucket
    HashTable.removeKey = function (bucket, key, options) {
        var index = HashTable.getKeyIndex(bucket, key, options), bucketLength = bucket.length;
        if (index < 0) {
            return false;
        }

        if (bucketLength > 1 && index !== (bucketLength - 1)) {
            bucket[index] = bucket[bucketLength - 1];
        }

        bucket.length = bucketLength - 1;
        return true;
    };

    ///Creates a new HashTable which is a union of the first and second HashTables. You may specify an optional options parameter and
    ///an optional overwriteIfExists parameter. The options are used to create the result HashTable and all the key-value pairs are added accordingly.
    //When overwriteIfExists is true and a key from the second HashTable already exists in the first HashTable the entire key-value pair will be overwritten in the result. 
    ///If overwriteIfExists is false then the key-value pair is ignored.
    HashTable.union = function (first, second, options, overwriteIfExists) {
        var result = new HashTable(options),
            keyValuePairs;

        keyValuePairs = first.getKeyValuePairs();
        result.addRange(keyValuePairs, overwriteIfExists);
        keyValuePairs = second.getKeyValuePairs();
        result.addRange(keyValuePairs, overwriteIfExists);

        return result;
    };

    ///Creates a new HashTable which is an intersection of the first and second HashTables. You may specify an optional options parameter and
    ///an optional overwriteIfExists parameter. The options are used to create the result HashTable and all the key-value pairs are added accordingly.
    ///overwriteIfExists is used to add the elements to the resulting HashTable that might have different options (see the add function for details).
    ///In any case the key-value pairs from the first HashTable are in the result.
    HashTable.intersection = function (first, second, options, overwriteIfExists) {
        var firstLength = first.count(),
            secondLength = second.count(),
            result, i, keyValuePairs, tempPair;
        result = new HashTable(options);
        if (firstLength < secondLength) {
            keyValuePairs = first.getKeyValuePairs();
            for (i = 0; i < firstLength; i += 1) {
                if (second.contains(keyValuePairs[i].key)) {
                    result.add(keyValuePairs[i].key, keyValuePairs[i].value, overwriteIfExists);
                }
            }
        } else {
            keyValuePairs = second.getKeyValuePairs();
            for (i = 0; i < secondLength; i += 1) {
                tempPair = first.get(keyValuePairs[i].key);
                if (tempPair !== null) {
                    result.add(tempPair.key, tempPair.value, overwriteIfExists);
                }
            }
        }

        return result;
    };

    ///Creates a new HashTable which is the difference of the first and second HashTables (i.e. all the key-value pairs which are in the first HashTable but not in the second HashTable). 
    ///You may specify an optional options parameter and an optional overwriteIfExists parameter. The options are used to create the result HashTable and all the key-value pairs are added accordingly.
    ///overwriteIfExists is used to add the elements to the resulting HashTable that might have different options (see the add function for details).
    ///In any case the key-value pairs from the first HashTable are in the result.
    HashTable.difference = function (first, second, options, overwriteIfExists) {
        var i, length, keyValuePairs, result = new HashTable(options), pair;
        keyValuePairs = first.getKeyValuePairs();
        length = first.count();

        for (i = 0; i < length; i += 1) {
            pair = keyValuePairs[i];
            if (!second.contains(pair.key, pair.value)) {
                result.add(pair.key, pair.value, overwriteIfExists);
            }
        }

        return result;
    };


    ///Creates a new HashTable which is the symmetric difference of the first and second HashTables (i.e. all the key-value pairs which are in the first HashTable but not in the second HashTable 
    //or in the second HashTable but not in the first). 
    ///You may specify an optional options parameter and an optional overwriteIfExists parameter. The options are used to create the result HashTable and all the key-value pairs are added accordingly.
    ///overwriteIfExists is used to add the elements to the resulting HashTable that might have different options (see the add function for details).
    HashTable.symmetricDifference = function (first, second, options, overwriteIfExists) {
        var i, length, keyValuePairs, result = new HashTable(options), pair;
        keyValuePairs = first.getKeyValuePairs();
        length = first.count();

        for (i = 0; i < length; i += 1) {
            pair = keyValuePairs[i];
            if (!second.contains(pair.key, pair.value)) {
                result.add(pair.key, pair.value, overwriteIfExists);
            }
        }

        keyValuePairs = second.getKeyValuePairs();
        length = second.count();

        for (i = 0; i < length; i += 1) {
            pair = keyValuePairs[i];
            if (!first.contains(pair.key, pair.value)) {
                result.add(pair.key, pair.value, false);
            }
        }

        return result;
    };

    //Prototype functions

    ///Adds a key value pair to the HashTable, returns true if any item was added and false otherwise.
    ///you may specify the overwriteIfExists flag. When overwriteIfExists is true the value of the given key will be replaced (the key will also be replaced) 
    ///if this key already exists in the HashTable. When overwriteIfExists is false and the key already exists then nothing will happen but the 
    ///function will return false (since nothing was added)

    HashTable.prototype.add = function (key, value, overwriteIfExists) {
        var hash, addedItem, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            this._buckets[hash] = [];
        }
        bucket = this._buckets[hash];
        itemIndex = HashTable.getKeyIndex(bucket, key, this._options);
        if (itemIndex >= 0) {
            if (overwriteIfExists) {
                bucket[itemIndex] = new KeyValuePair(key, value);
                return true;
            }

            return false;
        } else {
            addedItem = HashTable.addToBucket(this._buckets[hash], key, value, this._options);
            this._count += 1;
            return true;
        }
    };

    ///Adds a collection of keys and values to the HashTable, returns the number of items added.
    ///There are two possible uses:
    ///1) addRange(keyValuePairs,[overwriteIfExists]) - provide a collection of objects that have key and value property and an optional overwriteIfExists argument (see add for details)
    ///2) addRange(keys, values, [overwriteIfExists]) - provide two collections (one of keys and the other of values) and an optional overwriteIfExists argument (see add for details)
    HashTable.prototype.addRange = function (arg1, arg2, arg3) {

        var i, keysLength, valuesLength, minLength, result = 0;
        if (arguments.length === 1 || (arguments.length === 2 && (typeof (arguments[1]) === "boolean" || arguments[1] === undefined))) {
            for (i = 0, keysLength = arg1.length; i < keysLength; i += 1) {
                if (this.add(arg1[i].key, arg1[i].value, arg2)) {
                    result += 1;
                }
            }
        } else {
            keysLength = arg1.length;
            valuesLength = arg2.length;
            minLength = Math.min(keysLength, valuesLength);
            for (i = 0; i < minLength; i += 1) {
                if (this.add(arg1[i], arg2[i], arg3)) {
                    result += 1;
                }
            }
        }

        return result;
    };

    ///Retrieves the value associated with the given key. If the key doesn't exist null is returned.
    HashTable.prototype.get = function (key) {
        var hash, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return null;
        }

        bucket = this._buckets[hash];
        itemIndex = HashTable.getKeyIndex(bucket, key, this._options);
        if (itemIndex < 0) {
            return null;
        }

        return {
            value: bucket[itemIndex]._value,
            key: bucket[itemIndex]._key
        };
    };

    /// Removes the key-value pair with the given key. Returns false if the key wasn't found in the HashTable
    HashTable.prototype.remove = function (key) {
        var hash, bucket, keyRemoved;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return false;
        }

        bucket = this._buckets[hash];
        keyRemoved = HashTable.removeKey(bucket, key, this._options);
        if (keyRemoved) {
            this._count -= 1;
            if (bucket.length === 0) {
                delete (this._buckets[hash]);
            }
        }
        return keyRemoved;

    };

    /// Returns true if the HashTable contains the key and false otherwise
    HashTable.prototype.contains = function (key) {
        var hash, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return false;
        }

        bucket = this._buckets[hash];
        itemIndex = HashTable.getKeyIndex(bucket, key, this._options);
        if (itemIndex < 0) {
            return false;
        }
        return true;
    };

    ///Returns all the hashes that are currently in the HashTable
    HashTable.prototype.getHashes = function () {
        var result = [], hash;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                result.push(hash);
            }
        }

        return result;
    };

    ///Returns an array of all the key-value pairs in the HashTable
    HashTable.prototype.getKeyValuePairs = function () {
        var result = [], hash, bucket, i, bucketLength;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                bucket = this._buckets[hash];
                for (i = 0, bucketLength = bucket.length; i < bucketLength; i += 1) {
                    result.push({
                        key: bucket[i]._key,
                        value: bucket[i]._value
                    });
                }
            }
        }

        return result;
    };

    ///Returns the total number of items in the HashTable
    HashTable.prototype.count = function () {
        return this._count;
    };

    ///Removes all the items from the HashTable
    HashTable.prototype.clear = function () {
        this._count = 0;
        this._buckets = {};
    };

    ///Returns a new HashTable which is a shallow copy of this HashTable
    HashTable.prototype.clone = function () {
        var result = new HashTable(statics.copyOptions(this._options)),
        hash, bucket, newBucket, i, bucketLength;
        result._count = this._count;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                bucket = this._buckets[hash];
                bucketLength = bucket.length;
                newBucket = [];
                newBucket.length = bucketLength;
                result._buckets[hash] = newBucket;
                for (i = 0; i < bucketLength; i += 1) {
                    newBucket[i] = new KeyValuePair(bucket[i]._key, bucket[i]._value);
                }
            }
        }
        return result;
    };

    ///Returns a new HashTable where all the key value pairs are rehashed according to the new options
    HashTable.prototype.rehash = function (options, overwriteIfExists) {
        var result = new HashTable(options),
         pairs = this.getKeyValuePairs(),
         i, length = pairs.length, pair;
        for (i = 0; i < length; i += 1) {
            pair = pairs[i];
            result.add(pair.key, pair.value, overwriteIfExists);
        }

        return result;
    };

    ///Prints the content of the HashTable to the console. This is used for debugging
    HashTable.prototype.print = function () {
        var hash, bucket, i, length;
        console.log("Count: ", this._count);
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                console.log("*");
                console.log("Bucket:", hash);
                bucket = this._buckets[hash];
                length = bucket.length;
                console.log("There are", length, "item slots");
                for (i = 0; i < length; i += 1) {
                    if (bucket[i] === undefined) {
                        console.log("  ", i, ":", undefined);
                    } else {
                        console.log("  ", i, ":", "Key:", bucket[i]._key, "Value:", bucket[i]._value);
                    }
                }
            }
        }
    };

    return HashTable;
})();

var HashSet = (function () {

    function HashSet(options) {
        this._buckets = {
        };
        this._count = 0;
        this._options = statics.copyOptions(options);
    }

    //Static functions

    //Searches the given key within the given bucket. If the key is found then returns the index in the bucket,
    //otherwise returns -1
    HashSet.getKeyIndex = function (bucket, key, options) {
        var i, bucketLength = bucket.length, equality, currentItem;
        equality = statics.getEqual(key, options);
        for (i = 0; i < bucketLength; i += 1) {
            currentItem = bucket[i];
            if (currentItem !== undefined && equality(currentItem, key)) {
                return i;
            }
        }

        return -1;
    };

    ///A static function that adds the given key to the given bucket
    HashSet.addToBucket = function (bucket, key, options) {
        bucket.push(key);
    };


    //Removes the key from the given bucket. Returns false if the key was not found in the bucket
    HashSet.removeKey = function (bucket, key, options) {
        var index = HashSet.getKeyIndex(bucket, key, options), bucketLength = bucket.length;
        if (index < 0) {
            return false;
        }

        if (bucketLength > 1 && index !== (bucketLength - 1)) {
            bucket[index] = bucket[bucketLength - 1];
        }

        bucket.length = bucketLength - 1;
        return true;
    };

    ///Creates a new HashSet which is a union of the first and second HashSet. You may specify an optional options parameter and
    ///an optional overwriteIfExists parameter. The options are used to create the result HashSet and all the keys added accordingly.
    //When overwriteIfExists is true and a key from the second HashSet already exists in the first HashTable it will be overwritten in the result. 
    ///If overwriteIfExists is false then the key is ignored.
    HashSet.union = function (first, second, options, overwriteIfExists) {
        var result = new HashSet(options),
            keys;

        keys = first.getKeys();
        result.addRange(keys, overwriteIfExists);
        keys = second.getKeys();
        result.addRange(keys);

        return result;
    };

    ///Creates a new HashSet which is an intersection of the first and second HashSets. You may specify an optional options parameter and
    ///an optional overwriteIfExists parameter. The options are used to create the result HashSet and all the keys are added accordingly.
    ///overwriteIfExists is used to add the elements to the resulting HashSet that might have different options (see the add function for details).
    ///In any case the keys from the first HashSet are in the result.
    HashSet.intersection = function (first, second, options, overwriteIfExists) {
        var firstLength = first.count(),
            secondLength = second.count(),
            result, i, keys, tempKey;
        result = new HashSet(options);
        if (firstLength < secondLength) {
            keys = first.getKeys();
            for (i = 0; i < firstLength; i += 1) {
                tempKey = keys[i];
                if (second.contains(tempKey)) {
                    result.add(tempKey, overwriteIfExists);
                }
            }
        } else {
            keys = second.getKeys();
            for (i = 0; i < secondLength; i += 1) {
                tempKey = first.get(keys[i]);
                if (tempKey !== null) {
                    result.add(tempKey, overwriteIfExists);
                }
            }
        }

        return result;
    };

    ///Creates a new HashSet which is the difference of the first and second HashSets (i.e. all the keys which are in the first HashSet but not in the second HashSet). 
    ///You may specify an optional options parameter and an optional overwriteIfExists parameter. The options are used to create the result HashSet and all the keys are added accordingly.
    ///overwriteIfExists is used to add the elements to the resulting HashSet that might have different options (see the add function for details).
    ///In any case the keys from the first HashSet are in the result.
    HashSet.difference = function (first, second, options, overwriteIfExists) {
        var i, length, keys, result = new HashSet(options), tempKey;
        keys = first.getKeys();
        length = first.count();

        for (i = 0; i < length; i += 1) {
            tempKey = keys[i];
            if (!second.contains(tempKey)) {
                result.add(tempKey, overwriteIfExists);
            }
        }

        return result;
    };


    ///Creates a new HashSet which is the symmetric difference of the first and second HashSets (i.e. all the keys which are in the first HashSet but not in the second HashSet 
    //or in the second HashSet but not in the first). 
    ///You may specify an optional options parameter and an optional overwriteIfExists parameter. The options are used to create the result HashSet and all the keys are added accordingly.
    ///overwriteIfExists is used to add the elements to the resulting HashSet that might have different options (see the add function for details).
    HashSet.symmetricDifference = function (first, second, options, overwriteIfExists) {
        var i, length, keys, result = new HashSet(options), tempKey;
        keys = first.getKeys();
        length = first.count();

        for (i = 0; i < length; i += 1) {
            tempKey = keys[i];
            if (!second.contains(tempKey)) {
                result.add(tempKey, overwriteIfExists);
            }
        }

        keys = second.getKeys();
        length = second.count();

        for (i = 0; i < length; i += 1) {
            tempKey = keys[i];
            if (!first.contains(tempKey)) {
                result.add(tempKey, false);
            }
        }

        return result;
    };


    //Prototype functions

    ///Adds a key to the HashSet, returns true if any item was added and false otherwise.
    ///you may specify the overwriteIfExists flag. When overwriteIfExists is true the key will be replaced
    ///if this key already exists in the HashSet. When overwriteIfExists is false and the key already exists then nothing 
    ///will happen but the function will return false (since nothing was added)
    HashSet.prototype.add = function (key, overwriteIfExists) {
        var hash, addedItem, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            this._buckets[hash] = [];
        }
        bucket = this._buckets[hash];
        itemIndex = HashSet.getKeyIndex(bucket, key, this._options);
        if (itemIndex >= 0) {
            if (overwriteIfExists) {
                bucket[itemIndex] = key;
                return true;
            }

            return false;
        } else {
            addedItem = HashSet.addToBucket(this._buckets[hash], key, this._options);
            this._count += 1;
            return true;
        }
    };

    ///Adds a collection of keys to the HashSet, returns the number of keys added.
    ///you may specify the overwriteIfExists flag. When overwriteIfExists is true the key will be replaced
    ///if this key already exists in the HashSet. When overwriteIfExists is false and the key already exists then nothing 
    ///will happen.
    HashSet.prototype.addRange = function (keys, overwriteIfExists) {
        var i, length, result = 0;
        for (i = 0, length = keys.length; i < length; i += 1) {
            if (this.add(keys[i], overwriteIfExists)) {
                result += 1;
            }
        }

        return result;
    };

    ///Retrieves the key which is equal to the given key. If the key doesn't exist null is returned.
    HashSet.prototype.get = function (key) {
        var hash, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return null;
        }

        bucket = this._buckets[hash];
        itemIndex = HashSet.getKeyIndex(bucket, key, this._options);
        if (itemIndex < 0) {
            return null;
        }

        return bucket[itemIndex];
    };

    /// Removes the key. Returns false if the key wasn't found in the HashSet
    HashSet.prototype.remove = function (key) {
        var hash, bucket, keyRemoved;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return false;
        }

        bucket = this._buckets[hash];
        keyRemoved = HashSet.removeKey(bucket, key, this._options);
        if (keyRemoved) {
            this._count -= 1;
            if (bucket.length === 0) {
                delete (this._buckets[hash]);
            }
        }
        return keyRemoved;

    };

    /// Returns true if the HashSet contains the key and false otherwise
    HashSet.prototype.contains = function (key) {
        var hash, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return false;
        }

        bucket = this._buckets[hash];
        itemIndex = HashSet.getKeyIndex(bucket, key, this._options);
        if (itemIndex < 0) {
            return false;
        }
        return true;
    };

    ///Returns all the hashes that are currently in the HashSet
    HashSet.prototype.getHashes = function () {
        var result = [], hash;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                result.push(hash);
            }
        }

        return result;
    };

    ///Returns an array of all the keys in the HashSet
    HashSet.prototype.getKeys = function () {
        var result = [], hash, bucket, i, bucketLength;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                bucket = this._buckets[hash];
                for (i = 0, bucketLength = bucket.length; i < bucketLength; i += 1) {
                    result.push(bucket[i]);
                }
            }
        }

        return result;
    };

    ///Returns the total number of items in the HashSet
    HashSet.prototype.count = function () {
        return this._count;
    };

    ///Removes all the items from the HashSet
    HashSet.prototype.clear = function () {
        this._count = 0;
        this._buckets = {};
    };

    ///Returns a new HashSet which is a shallow copy of this HashSet
    HashSet.prototype.clone = function () {
        var result = new HashSet(statics.copyOptions(this._options)),
        hash, bucket, newBucket, i, bucketLength;
        result._count = this._count;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                bucket = this._buckets[hash];
                bucketLength = bucket.length;
                newBucket = [];
                newBucket.length = bucketLength;
                result._buckets[hash] = newBucket;
                for (i = 0; i < bucketLength; i += 1) {
                    newBucket[i] = bucket[i];
                }
            }
        }
        return result;
    };

    ///Returns a new HashSet where all the keys are rehashed according to the new options
    HashSet.prototype.rehash = function (options, overwriteIfExists) {
        var result = new HashSet(options),
         keys = this.getKeys(),
         i, length = keys.length;
        for (i = 0; i < length; i += 1) {
            result.add(keys[i], overwriteIfExists);
        }

        return result;
    };

    ///Prints the content of the HashSet to the console. This is used for debugging
    HashSet.prototype.print = function () {
        var hash, bucket, i, length;
        console.log("Count: ", this._count);
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                console.log("*");
                console.log("Bucket:", hash);
                bucket = this._buckets[hash];
                length = bucket.length;
                console.log("There are", length, "item slots");
                for (i = 0; i < length; i += 1) {
                    if (bucket[i] === undefined) {
                        console.log("  ", i, ":", undefined);
                    } else {
                        console.log("  ", i, ":", "Key:", bucket[i]);
                    }
                }
            }
        }
    };

    return HashSet;
})();

exports.statics = statics;

exports.HashTable = HashTable;

exports.HashSet = HashSet;

