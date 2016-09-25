'use strict';

exports.internal = {

    internalContainer: (function () {

        var InternalContainerModule = require('../../../lib/build/internalContainer');

        var internalContainer;


        return {

            setUp: function (callback) {
                var InternalContainerModule = require('../../../lib/build/internalContainer');

                var regoStorage = { create: () => { }, };
                var disposeStorage = { create: () => { }, };

                internalContainer = new InternalContainerModule.InternalContainer(regoStorage, disposeStorage);
                callback();
            },

            resolveAsync_throws: function (test) {

                 var delegate = () => internalContainer.resolveAsync();

                test.throws(delegate, function (err) {
                    test.strictEqual(err, 'Not implemented');
                    
                    return true;
                });

                test.done();
            },
            
            disposeAsync_throws: function (test) {

                 var delegate = () => internalContainer.disposeAsync();

                test.throws(delegate, function (err) {
                    test.strictEqual(err, 'Not implemented');
                    
                    return true;
                });

                test.done();
            },
            
            tryResolveAsync_throws: function (test) {

                 var delegate = () => internalContainer.tryResolveAsync();

                test.throws(delegate, function (err) {
                    test.strictEqual(err, 'Not implemented');
                    
                    return true;
                });

                test.done();
            },
            
            resolveNamedAsync_throws: function (test) {

                 var delegate = () => internalContainer.resolveNamedAsync();

                test.throws(delegate, function (err) {
                    test.strictEqual(err, 'Not implemented');
                    
                    return true;
                });

                test.done();
            },
            
            tryResolveNamedAsync_throws: function (test) {

                 var delegate = () => internalContainer.tryResolveNamedAsync();

                test.throws(delegate, function (err) {
                    test.strictEqual(err, 'Not implemented');
                    
                    return true;
                });

                test.done();
            },
            
            resolveWithDependenciesAsync_throws: function (test) {

                 var delegate = () => internalContainer.resolveWithDependenciesAsync();

                test.throws(delegate, function (err) {
                    test.strictEqual(err, 'Not implemented');
                    
                    return true;
                });

                test.done();
            }
        }

    })()
}