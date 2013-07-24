jsHash
======

A node package that implements the HashTable and HashSet data structures.

Install:

```
$ npm install hashes
```

###General

A HashTable (a.k.a Dictionary or HashMap) is a data structures that contains pairs of key and value. 
The key may provide a _getHashCode_ function that returns a non-unique string value that represents that key and/or
an _equal(1)_ function that checks if the given key is equal to the given argument. **Note: If two keys are equal they must have the same hash code!**
This data structure allows fast retrieval of the stored values using the keys. Please refer to the [WiKi article](http://en.wikipedia.org/wiki/Hash_table) for more information.
In this implementation each of the two aforementioned functions is calculated in the following order:

1. The function that was provided in the options.
2. The function on the key object.
3. A default function from the _statics_ object.

A HashSet is similar to the HashTable but it stores only the keys. The data should be stored within the key. All the rules of the HashTable apply to the HashSet.

##API

To use the module in your code simply type

```javascript
var hashes = require('hashes');
```

###Options
You may provide an optional argument to the constructors called _options_. The options object can have any of the following methods and properties:

* **getHashCode(key)** - Returns the hash code of the given _key_ object.

* **equal(first, second)** - Returns true if the given arguments are equal, and false otherwise.

The options object is used throughout the different API calls. By default, providing any of these functions will override 
the default functions and the key specific functions by that name.

###HashTable
To create a new HashTable use the _new_ keyword:

```
var myHashTable = new hashes.HashTable();
``` 

* **HashTable([options])** - Creates a new instance of the HashTable object. An optional _options_ argument can be provided (see above).

* **add(key, value, [overwriteIfExists])** - Adds the given key-value pair to the HashTable. _overwriteIfExists_ is an optional argument that is used when the given key already exists in the HashTable.
If _overwriteIfExists_ is truthy then the given key-value pair will overwrite the existing key-value pair, otherwise the given key-value pair will not be added to the HashTable. Returns true if the HashTable was modified and false otherwise.

* **addRange(keys, values, [overwriteIfExists])** - Adds the given keys and values as key-value pairs to the HashTable. If the length of the two arguments is different, the minimum length is used. 
_overwriteIfExists_ is an optional argument that is used when the given key already exists in the HashTable.
If _overwriteIfExists_ is truthy then the given key-value pair will overwrite the existing key-value pair, otherwise the given key-value pair will not be added to the HashTable. 
Returns the number of key-value pairs that were added to the HashTable.

* **addRange(keyValuePairs, [overwriteIfExists])** - Adds the given key-value pairs to the HashTable (each object in the given collection must contain a _key_ and a _value_ property). 
_overwriteIfExists_ is an optional argument that is used when the given key already exists in the HashTable.
If _overwriteIfExists_ is truthy then the given key-value pair will overwrite the existing key-value pair, otherwise the given key-value pair will not be added to the HashTable. 
Returns the number of key-value pairs that were added to the HashTable.

* **get(key)** - Returns the key-value pair associated with the given key. If there is no key-value pair associated with the given key, null is returned. The returned object is ```{key:key, value:value}```.
(Note that a pair is returned because the key in the HashTable may differ from the provided key.)

* **remove(key)** - Removes the key-value pair associated with the given key from the HashTable. Returns true if a key-value pair was removed and false otherwise (e.g. when there is no value associated with the given key).

* **contains(key)** - Returns true if there is a value associated with the given key and false otherwise.

* **getHashes()** - Returns a string array of all the hashes that are currently in the HashTable.

* **getKeyValuePairs()** - Returns an array of all the key-value pairs in the HashTable **in no particular order**. Each object in the returned array is ```{key:key, value:value}```.

* **count()** - Returns the number of key-value pairs in the HashTable.

* **clear()** - Removes all the key-value pairs from the HashTable.

* **clone()** - Returns a copy of the HashTable. All user elements are copied by reference.

* **rehash(options, overwriteIfExists)** - Returns a copy of the HashTable but all the key-value pairs are re-insrted using the new options. _overwriteIfExists_ is handled the same way as in the _add_ function.

#### Static Functions

* **[static] union(first, second, [options], [overwriteIfExists])** - Creates a new HashTable which is a union of the first and second HashTables. 
You may specify an optional _options_ parameter and an optional _overwriteIfExists_ parameter. The options are used to create the result HashTable and all the key-value pairs are added accordingly.
When _overwriteIfExists_ is true and a key from the second HashTable already exists in the first HashTable the entire key-value pair is overwritten in the result. 
If _overwriteIfExists_ is false then the key-value pair from the second HashTable is ignored. In any case the key-value pairs from the first HashTable are in the result.

* **[static] intersection(first, second, [options], [overwriteIfExists])** - Creates a new HashTable which is an intersection of the first and second HashTables. 
You may specify an optional _options_ parameter and an optional _overwriteIfExists_ parameter. The options are used to create the result HashTable and all the key-value pairs are added accordingly.
When _overwriteIfExists_ is true and a key from the second HashTable already exists in the first HashTable the entire key-value pair is overwritten in the result. 
If _overwriteIfExists_ is false then the key-value pair from the second HashTable is ignored. In any case the key-value pairs from the first HashTable are in the result.

* **[static] difference(first, second, [options], [overwriteIfExists])** - Creates a new HashTable which is the difference of the first and second HashTables (i.e. all the key-value pairs which are in the first HashTable but not in the second HashTable). 
You may specify an optional _options_ parameter and an optional _overwriteIfExists_ parameter. The options are used to create the result HashTable and all the key-value pairs are added accordingly.
When _overwriteIfExists_ is true and a key from the second HashTable already exists in the first HashTable the entire key-value pair is overwritten in the result. 
If _overwriteIfExists_ is false then the key-value pair from the second HashTable is ignored.    

* **[static] symmetricDifference(first, second, [options], [overwriteIfExists])** - Creates a new HashTable which is the symmetric difference of the first and second HashTables (i.e. all the key-value pairs which are in the first HashTable but not in the second HashTable 
or in the second HashTable but not in the first). 
You may specify an optional _options_ parameter and an optional _overwriteIfExists_ parameter. The options are used to create the result HashTable and all the key-value pairs are added accordingly.
When _overwriteIfExists_ is true and a key from the second HashTable already exists in the first HashTable the entire key-value pair is overwritten in the result. 
If _overwriteIfExists_ is false then the key-value pair from the second HashTable is ignored. 


###HashSet
To create a new HashSet use the _new_ keyword:

```
var myHashSet = new hashes.HashSet();
``` 

* **HashSet([options])** - Creates a new instance of the HashSet object. An optional _options_ argument can be provided (see above).

* **add(key, [overwriteIfExists])** - Adds the given key to the HashSet. _overwriteIfExists_ is an optional argument that is used when the given key already exists in the HashSet.
If _overwriteIfExists_ is truthy then the given key will overwrite the existing key, otherwise the given key is ignored.

* **addRange(keys, [overwriteIfExists])** - Adds the given keys to the HashSet. 
_overwriteIfExists_ is an optional argument that is used when the given key already exists in the HashSet.
If _overwriteIfExists_ is truthy then the given key will overwrite the existing key, otherwise the given key pair will not be added to the HashSet. 
Returns the number of keys that were added to the HashSet.

* **get(key)** - Returns the key in the HashSet which is equal to the given key. If there is no key equal to the given key, null is returned.

* **remove(key)** - Removes the key from the HashSet. Returns true if a key was removed and false otherwise.

* **contains(key)** - Returns true if the given key is in the HashSet and false otherwise.

* **getHashes()** - Returns a string array of all the hashes that are currently in the HashSet.

* **getKeys()** - Returns an array of all the keys in the HashSet **in no particular order**.

* **count()** - Returns the number of keys the HashSet.

* **clear()** - Removes all the keys from the HashSet.

* **clone()** - Returns a copy of the HashSet. All user elements are copied by reference.

* **rehash(options, overwriteIfExists)** - Returns a copy of the HashSet but all the keys  are re-insrted using the new options. _overwriteIfExists_ is handled the same way as in the _add_ function.


#### Static Functions

* **[static] union(first, second, [options], [overwriteIfExists])** - Creates a new HashSet which is a union of the first and second HashSets. 
You may specify an optional _options_ parameter and an optional _overwriteIfExists_ parameter. The options are used to create the result HashSet and all the keys added accordingly.
When _overwriteIfExists_ is true and a key from the second HashSet already exists in the first HashTable it will be overwritten in the result. 
If _overwriteIfExists_ is false then the key is ignored.

* **[static] intersection(first, second, [options], [overwriteIfExists])** - Creates a new HashSet which is an intersection of the first and second HashSets. 
You may specify an optional _options_ parameter and an optional _overwriteIfExists_ parameter. The options are used to create the result HashSet and all the keys are added accordingly.
When _overwriteIfExists_ is true and a key from the second HashSet already exists in the first HashSet the key is overwritten in the result. 
If _overwriteIfExists_ is false then the key from the second HashSet is ignored. In any case the keys from the first HashSet are in the result.

* **[static] difference(first, second, [options], [overwriteIfExists])** - Creates a new HashSet which is the difference of the first and second HashSets (i.e. all the keys which are in the first HashSet but not in the second HashSet). 
You may specify an optional _options_ parameter and an optional _overwriteIfExists_ parameter. The options are used to create the result HashSet and all the keys are added accordingly.
When _overwriteIfExists_ is true and a key from the second HashSet already exists in the first HashSet the key is overwritten in the result. 
If _overwriteIfExists_ is false then the key from the second HashSet is ignored.

* **[static] symmetricDifference(first, second, [options], [overwriteIfExists])** - Creates a new HashSet which is the symmetric difference of the first and second HashSets (i.e. all the keys which are in the first HashSet but not in the second HashSet 
or in the second HashSet but not in the first). 
You may specify an optional _options_ parameter and an optional _overwriteIfExists_ parameter. The options are used to create the result HashSet and all the keys are added accordingly.
When _overwriteIfExists_ is true and a key from the second HashSet already exists in the first HashSet the key is overwritten in the result. 
If _overwriteIfExists_ is false then the key from the second HashSet is ignored.

###statics object
The _statics_ object is used internally to control the behavior of **all** the HashTable and HashSet instances.
You may override the functions of this object but this is an advanced use-case.


## Contributions
Please feel free to contribute code to this module. Make sure that the contributed code is in the spirit of the existing code.
Thanks!


## Test
The module uses [Mocha](http://visionmedia.github.com/mocha/) testing framework for all the tests. To run the tests simply type
```mocha``` in a command line while in the module main directory.

## ChangeLog
0.1.1 -> 0.1.2

* Added static intersection, difference and symmetricDiffrence functions to both HashTable and HashSet

0.1.0 -> 0.1.1

* Added the addRange functions
* Added static union functions
* Minor documentation fixes
* Fixed a bug where options argument had to include both getHashCode and equal functions

0.0.2 -> 0.1.0

* **Breaking** - Renamed the class from Hashtable to HashTable (note the capital 'T')
* **Breaking** - Moved some static functions of HashTable class to the statics object to accommodate the new HashSet class
* Added the HashSet class
* Added the _clone_ and _rehash_ functions to the HashTable class
* Fixed a bug in the get method where the key was not returned
* Fixed some global leaks
* Fixed some other code issues that jsHint didn't like
* Fixed a bug with the clone method not setting count properly
* Changed so that now only the relevant options are copied from the options object provided and a reference to the original object is not stored.

## License

(The MIT License)

Copyright (c) 2012 Boris Kozorovitzky

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.