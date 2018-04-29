
'use strict';

exports.internal = {

    disposableStorage : (function() {

        const Scaffold = require('../scaffold');
        const DisposableStorageModule = require('../../../lib/storage/disposableStorage');
        const mockery = Scaffold.Mockery;

        var disposableStorage;

        return {

            setUp: function (callback) {
                disposableStorage = new DisposableStorageModule.DisposableStorage();
                callback();
            },

            createDisposableItem_returns_week_Reference_and_disposer : function(test) {
                var obj = {
                    dispose : function() {}
                };

                var disposer = function(o) {
                    o.dispose();
                };

                var result = disposableStorage.createDisposableItem(obj, disposer);

                test.equal(disposer, result.disposer);
                test.ok(result.weakReference);

                test.done();
            },

            disposeItems_disposes_all_items : function(test) {

                var disposeStub = mockery.stub();

                var obj = {
                    dispose : disposeStub
                };

                var disposer = function(o) {
                    o.dispose();
                }

                disposableStorage.add(obj, disposer);
                disposableStorage.disposeItems();

                test.ok(disposeStub.calledOnce);


                test.done();
            }
        };

    })()
}