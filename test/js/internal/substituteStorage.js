'use strict';

exports.internal = {

    substituteStorage: (function () {

        const Scaffold = require('../scaffold');
        const ScaffoldAddons = require('../scaffoldAddons');
        const SubstituteStorageModule = require('./../../../lib/interceptors/substituteStorage');
        const CallInfoType = ScaffoldAddons.Interceptors.CallInfoType;

        var storage;

        return {
            setUp: function (callback) {

                storage = new SubstituteStorageModule.SubstituteStorage();
                callback();
            },

            getSubstitutes_returns_null_when_not_found: (test) => {
                const actual = storage.getSubstitutes('test', []);

                test.strictEqual(actual, null);
                test.done();
            },

            getSubstitutes_retuns_unknows_for_no_type: (test) => {
                const substitute1 = {
                    wrapper: () => true
                };

                const substitute2 = {
                    wrapper: () => false
                };

                storage.add(substitute1);
                storage.add(substitute2);

                const actual = storage.getSubstitutes('test', []);

                test.ok(actual);
                test.strictEqual(actual.wrapper, substitute1.wrapper);
                test.strictEqual(actual.next.wrapper, substitute2.wrapper);
                test.ok(actual.next.next === undefined);
              
                test.done();
            },

            getSubstitutes_retuns_unknows_for_type: (test) => {
                const substitute1 = {
                    type: 4,
                    wrapper: () => true
                };

                const substitute2 = {
                    type: 1,
                    wrapper: () => true
                };

                const substitute3 = {
                    type: 2,
                    wrapper: () => false
                };

                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);

                const actual = storage.getSubstitutes('test', [1, 2, 3]);
           
                test.strictEqual(actual.wrapper, substitute2.wrapper);
                test.strictEqual(actual.next.wrapper, substitute3.wrapper);
                test.ok(actual.next.next === undefined);
              
                test.done();
            },

            getSubstitutes_retuns_knows_for_no_type: (test) => {
                const substitute1 = {
                    method: 'test',
                    wrapper: () => true
                };

                const substitute2 = {
                    method: 'test',
                    wrapper: () => true
                };
                
                storage.add(substitute1);
                storage.add(substitute2);
                
                const actual = storage.getSubstitutes('test', []);
           
                test.strictEqual(actual.wrapper, substitute1.wrapper);
                test.strictEqual(actual.next.wrapper, substitute2.wrapper);
                test.ok(actual.next.next === undefined);
              
                test.done();
            },

            getSubstitutes_retuns_knows_for_type: (test) => {
                const substitute1 = {
                    method: 'test',
                    type: 1,
                    wrapper: () => true
                };

                const substitute2 = {
                    method: 'test',
                    type: 2,
                    wrapper: () => true
                };

                const substitute3 = {
                    method: 'test',
                    wrapper: () => true
                };
                
                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);
                
                const actual = storage.getSubstitutes('test', [1, 2, 3]);
           
                test.strictEqual(actual.wrapper, substitute1.wrapper);
                test.strictEqual(actual.next.wrapper, substitute2.wrapper);
                test.strictEqual(actual.next.next.wrapper, substitute3.wrapper);
                test.ok(actual.next.next.next === undefined);
              
                test.done();
            },

            getSubstitutes_retuns_for_mixed: (test) => {
                const substitute1 = {
                    method: 'test',
                    type: 1,
                    wrapper: () => true
                };

                const substitute2 = {
                    method: 'test2',
                    type: 2,
                    wrapper: () => true
                };

                const substitute3 = {
                    method: 'test',
                    wrapper: () => true
                };

                const substitute4 = {
                    wrapper: () => true
                };
 
                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);
                storage.add(substitute4);
                
                const actual = storage.getSubstitutes('test', [1, 2, 3]);
           
                test.strictEqual(actual.wrapper, substitute1.wrapper);
                test.strictEqual(actual.next.wrapper, substitute3.wrapper);
                test.strictEqual(actual.next.next.wrapper, substitute4.wrapper);
                test.ok(actual.next.next.next === undefined);
              
                test.done();
            },

            getSubstitutes_throws_when_wrong_type: (test) => {
                const substitute1 = {
                    method: 'test',
                    type: 1,
                    wrapper: () => true
                };

                const substitute2 = {
                    method: 'test',
                    type: 4,
                    wrapper: () => true
                };

                storage.add(substitute1);
                storage.add(substitute2);
                
                const delegate = () => {
                    storage.getSubstitutes('test', [1, 2, 3]);
                };
                
                test.throws(delegate, function (err) {
                    return (err instanceof Scaffold.Exceptions.ProxyError) && 
                    /Could not match proxy type and property type. Expected one of: Method, Getter, Setter. Actual: GetterSetter/.test(err.message);
                });
                
                test.done();
            },

            getSubstitutes_skips_wrong_type_unknowns: (test) => {
            
                const substitute1 = {
                    type: 2,
                    wrapper: () => true
                };

                const substitute2 = {
                    method: 'test',
                    type: 1,
                    wrapper: () => true
                };

                const substitute3 = {
                    type: 3,
                    wrapper: () => true
                };

                storage.add(substitute1);
                storage.add(substitute2);
                storage.add(substitute3);
                
                const actual = storage.getSubstitutes('test', [1]);

                test.strictEqual(actual.wrapper, substitute2.wrapper);
                test.ok(actual.next === null);
             
                test.done();
            }                
        }
    })()
}