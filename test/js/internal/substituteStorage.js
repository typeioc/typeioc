'use strict';

exports.internal = {

    substituteStorage: (function () {

        var Scaffold = require('../../scaffold');
        var SubstituteStorageModule = require('./../../../lib/interceptors/substituteStorage');
        var CallInfoType = Scaffold.Types.CallInfoType;

        var storage;

        return {
            setUp: function (callback) {

                storage = new SubstituteStorageModule.SubstituteStorage();

                callback();
            },

            constructor_creates_empty_storage : function(test) {

                test.ok(storage.known);
                test.strictEqual(0, Object.keys(storage.known).length);

                test.ok(storage.unknown);
                test.strictEqual(0, Object.keys(storage.unknown).length);

                test.done();
            },

            add_adds_known_substitute : function(test) {

                var substitute = {
                    method : 'test',
                    type : CallInfoType.Method,
                    wrapper : function() {},
                    next : null
                };

                storage.add(substitute);

                var bag = storage.known['test'];
                var list = bag[substitute.type];

                test.strictEqual(0, Object.keys(storage.unknown).length);
                test.strictEqual(1, Object.keys(storage.known).length);
                test.strictEqual(1, Object.keys(bag).length);

                test.strictEqual(list.head, substitute);
                test.strictEqual(list.tail, substitute);

                var item = list.head;
                test.strictEqual(item.method, substitute.method);
                test.strictEqual(item.type, substitute.type);
                test.strictEqual(item.wrapper, substitute.wrapper);
                test.strictEqual(item.next, null);

                test.done();
            },

            add_adds_unknown_substitute : function(test) {

                var substitute = {
                    type : CallInfoType.Method,
                    wrapper : function() {},
                    next : null
                };

                storage.add(substitute);

                var list = storage.unknown[substitute.type];

                test.strictEqual(1, Object.keys(storage.unknown).length);
                test.strictEqual(0, Object.keys(storage.known).length);

                test.strictEqual(list.head, substitute);
                test.strictEqual(list.tail, substitute);

                var item = list.head;
                test.strictEqual(item.method, substitute.method);
                test.strictEqual(item.type, substitute.type);
                test.strictEqual(item.wrapper, substitute.wrapper);
                test.strictEqual(item.next, null);

                test.done();
            },

            add_adds_multiple_same_node_same_type_known_substitutes : function(test) {

                var substitute1 = {
                    method : 'test',
                    type : CallInfoType.Method,
                    wrapper : function() {},
                    next : null
                };

                var substitute2 = {
                    method : 'test',
                    type : CallInfoType.Method,
                    wrapper : function() {},
                    next : null
                };

                var substitute3 = {
                    method : 'test',
                    type : CallInfoType.Method,
                    wrapper : function() {},
                    next : null
                };

                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);

                var bag = storage.known['test'];
                var list = bag[substitute1.type];

                test.strictEqual(0, Object.keys(storage.unknown).length);
                test.strictEqual(1, Object.keys(storage.known).length);
                test.strictEqual(1, Object.keys(bag).length);

                test.strictEqual(0, Object.keys(storage.unknown).length);
                test.strictEqual(1, Object.keys(storage.known).length);
                test.strictEqual(1, Object.keys(bag).length);

                test.strictEqual(list.head, substitute1);
                test.strictEqual(list.head.next, substitute2);
                test.strictEqual(list.head.next.next, substitute3);
                test.strictEqual(list.tail, substitute3);
                test.strictEqual(list.tail.next, null);

                test.done();
            },

            add_adds_multiple_same_node_different_type_known_substitutes : function(test) {

                var substitute1 = {
                    method : 'test',
                    type : CallInfoType.Method,
                    wrapper : function() {},
                    next : null
                };

                var substitute2 = {
                    method : 'test',
                    type : CallInfoType.Any,
                    wrapper : function() {},
                    next : null
                };

                var substitute3 = {
                    method : 'test',
                    type : CallInfoType.Setter,
                    wrapper : function() {},
                    next : null
                };

                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);

                var bag = storage.known['test'];
                var list = bag[substitute1.type];

                test.strictEqual(0, Object.keys(storage.unknown).length);
                test.strictEqual(1, Object.keys(storage.known).length);
                test.strictEqual(3, Object.keys(bag).length);

                test.strictEqual(list.head, substitute1);
                test.strictEqual(list.tail, substitute1);
                test.strictEqual(list.tail.next, null);

                list = bag[substitute2.type];

                test.strictEqual(list.head, substitute2);
                test.strictEqual(list.tail, substitute2);
                test.strictEqual(list.tail.next, null);

                list = bag[substitute3.type];

                test.strictEqual(list.head, substitute3);
                test.strictEqual(list.tail, substitute3);
                test.strictEqual(list.tail.next, null);

                test.done();
            },

            add_adds_multiple_different_node_different_type_known_substitutes : function(test) {

                var substitute1 = {
                    method : 'test',
                    type : CallInfoType.Method,
                    wrapper : function() {},
                    next : null
                };

                var substitute2 = {
                    method : 'test1',
                    type : CallInfoType.Any,
                    wrapper : function() {},
                    next : null
                };

                var substitute3 = {
                    method : 'test2',
                    type : CallInfoType.Setter,
                    wrapper : function() {},
                    next : null
                };

                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);

                var bag = storage.known[substitute1.method];
                var list = bag[substitute1.type];

                test.strictEqual(0, Object.keys(storage.unknown).length);
                test.strictEqual(3, Object.keys(storage.known).length);
                test.strictEqual(1, Object.keys(bag).length);

                test.strictEqual(list.head, substitute1);
                test.strictEqual(list.tail, substitute1);
                test.strictEqual(list.tail.next, null);

                bag = storage.known[substitute2.method];
                list = bag[substitute2.type];

                test.strictEqual(1, Object.keys(bag).length);
                test.strictEqual(list.head, substitute2);
                test.strictEqual(list.tail, substitute2);
                test.strictEqual(list.tail.next, null);

                bag = storage.known[substitute3.method];
                list = bag[substitute3.type];

                test.strictEqual(1, Object.keys(bag).length);
                test.strictEqual(list.head, substitute3);
                test.strictEqual(list.tail, substitute3);
                test.strictEqual(list.tail.next, null);

                test.done();
            },

            add_adds_multiple_same_type_unknown_substitutes : function(test) {

                var substitute1 = {
                    type : CallInfoType.Setter,
                    wrapper : function() {},
                    next : null
                };

                var substitute2 = {
                    type : CallInfoType.Setter,
                    wrapper : function() {},
                    next : null
                };

                var substitute3 = {
                    type : CallInfoType.Setter,
                    wrapper : function() {},
                    next : null
                };

                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);

                var list = storage.unknown[substitute1.type];

                test.strictEqual(1, Object.keys(storage.unknown).length);
                test.strictEqual(0, Object.keys(storage.known).length);

                test.strictEqual(list.head, substitute1);
                test.strictEqual(list.tail, substitute3);
                test.strictEqual(list.head.next, substitute2);
                test.strictEqual(list.head.next.next, substitute3);
                test.strictEqual(list.head.next.next.next, null);

                test.done();
            },

            add_adds_multiple_different_type_unknown_substitutes : function(test) {

                var substitute1 = {
                    type : CallInfoType.Method,
                    wrapper : function() {},
                    next : null
                };

                var substitute2 = {
                    type : CallInfoType.Getter,
                    wrapper : function() {},
                    next : null
                };

                var substitute3 = {
                    type : CallInfoType.Setter,
                    wrapper : function() {},
                    next : null
                };

                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);

                test.strictEqual(3, Object.keys(storage.unknown).length);
                test.strictEqual(0, Object.keys(storage.known).length);


                var list = storage.unknown[substitute1.type];
                test.strictEqual(list.head, substitute1);
                test.strictEqual(list.tail, substitute1);
                test.strictEqual(list.tail.next, null);

                list = storage.unknown[substitute2.type];
                test.strictEqual(list.head, substitute2);
                test.strictEqual(list.tail, substitute2);
                test.strictEqual(list.tail.next, null);

                list = storage.unknown[substitute3.type];
                test.strictEqual(list.head, substitute3);
                test.strictEqual(list.tail, substitute3);
                test.strictEqual(list.tail.next, null);

                test.done();
            },

            add_adds_multiple_any_unknown_substitutes : function(test) {

                var substitute1 = {
                    type : CallInfoType.Any,
                    wrapper : function() {},
                    next : null
                };

                var substitute2 = {
                    type : CallInfoType.Getter,
                    wrapper : function() {},
                    next : null
                };

                var substitute3 = {
                    type : CallInfoType.Any,
                    wrapper : function() {},
                    next : null
                };

                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);

                test.strictEqual(2, Object.keys(storage.unknown).length);
                test.strictEqual(0, Object.keys(storage.known).length);


                var list = storage.unknown[substitute1.type];
                test.strictEqual(list.head, substitute1);
                test.strictEqual(list.tail, substitute3);
                test.strictEqual(list.head.next, substitute3);
                test.strictEqual(list.head.next.next, null);

                list = storage.unknown[substitute2.type];
                test.strictEqual(list.head, substitute2);
                test.strictEqual(list.tail, substitute2);
                test.strictEqual(list.tail.next, null);

                test.done();
            },

            getKnownTypes_returns_empty_array_when_not_found : function(test) {

                var types = storage.getKnownTypes('test');
                test.ok(Array.isArray(types));
                test.strictEqual(types.length, 0);

                test.done();
            },

            getKnownTypes_gets_types_for_known_substitute_bag : function(test) {

                var substitute1 = {
                    method : 'test',
                    type : CallInfoType.Method,
                    wrapper : function() {},
                    next : null
                };

                var substitute2 = {
                    method : 'test',
                    type : CallInfoType.Any,
                    wrapper : function() {},
                    next : null
                };

                var substitute3 = {
                    method : 'test',
                    type : CallInfoType.Setter,
                    wrapper : function() {},
                    next : null
                };

                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);

                var bag = storage.known['test'];

                var types = storage.getKnownTypes('test');
                test.ok(Array.isArray(types));
                test.strictEqual(types.length, 3);
                test.strictEqual(types.indexOf(CallInfoType.Method) > -1, true);
                test.strictEqual(types.indexOf(CallInfoType.Any) > -1, true);
                test.strictEqual(types.indexOf(CallInfoType.Setter) > -1, true);

                test.done();
            },

            getSubstitutes_gets_substitute_known : function(test) {

                var method = 'test';
                var substitute = {
                    method : method,
                    type : CallInfoType.Method,
                    wrapper : function() {},
                    next : null
                };

                storage.add(substitute);

                var types = storage.getKnownTypes(method);
                var substitutes = storage.getSubstitutes(method, types);

                test.strictEqual(Array.isArray(substitutes), true);
                test.strictEqual(substitutes.length, 1);

                var actual = substitutes[0];
                test.strictEqual(actual.method, substitute.method);
                test.strictEqual(actual.type, substitute.type);
                test.strictEqual(actual.wrapper, substitute.wrapper);
                test.strictEqual(actual.next, null);

                test.done();
            },

            getSubstitutes_returns_empty_array_when_no_substitutes : function(test) {

                var items = storage.getSubstitutes('test', []);

                test.ok(Array.isArray(items));
                test.strictEqual(items.length, 0);

                test.done();
            },

            getSubstitutes_returns__multiple_different_substitutes : function(test) {

                var method = 'test';

                var substitute1 = {
                    method : method,
                    type : CallInfoType.Method,
                    wrapper : function _1() {},
                    next : null
                };

                var substitute2 = {
                    type : CallInfoType.Any,
                    wrapper : function _2() {},
                    next : null
                };

                var substitute3 = {
                    type : CallInfoType.Method,
                    wrapper : function _3() {},
                    next : null
                };

                var substitute4 = {
                    method : method,
                    type : CallInfoType.Any,
                    wrapper : function _4() {},
                    next : null
                };

                var substitute5 = {
                    method : method,
                    type : CallInfoType.Method,
                    wrapper : function _5() {},
                    next : null
                };

                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);
                storage.add(substitute4);
                storage.add(substitute5);

                test.strictEqual(2, Object.keys(storage.unknown).length);
                test.strictEqual(1, Object.keys(storage.known).length);

                var types = storage.getKnownTypes(method);
                var substitutes = storage.getSubstitutes(method, types);

                test.strictEqual(1, substitutes.length);
                var substitute = substitutes[0];

                test.strictEqual(substitute.method, method);
                test.strictEqual(substitute.type, CallInfoType.Any);
                test.strictEqual(substitute.wrapper, substitute2.wrapper);

                substitute = substitute.next;

                test.strictEqual(substitute.method, method);
                test.strictEqual(substitute.type, CallInfoType.Method);
                test.strictEqual(substitute.wrapper, substitute3.wrapper);

                substitute = substitute.next;

                test.strictEqual(substitute.method, method);
                test.strictEqual(substitute.type, CallInfoType.Any);
                test.strictEqual(substitute.wrapper, substitute4.wrapper);

                substitute = substitute.next;

                test.strictEqual(substitute.method, method);
                test.strictEqual(substitute.type, CallInfoType.Method);
                test.strictEqual(substitute.wrapper, substitute1.wrapper);

                substitute = substitute.next;

                test.strictEqual(substitute.method, method);
                test.strictEqual(substitute.type, CallInfoType.Method);
                test.strictEqual(substitute.wrapper, substitute5.wrapper);

                test.done();
            }
        }
    })()
}