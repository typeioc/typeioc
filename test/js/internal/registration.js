
'use strict';

exports.internal = {

    registration : (function() {

        var Scaffold = require('../../scaffold');
        var RegistrationInstanceModule = require('./../../../lib/registration/instance/registration');
        var mockery = Scaffold.Mockery;
        var Types = Scaffold.Types;

        var baseRegistration;
        var instanceRegistration;

        return {

            setUp: function (callback) {

                baseRegistration = {};
                instanceRegistration = new RegistrationInstanceModule.Registration(baseRegistration);

                callback();
            },

            as_sets_factory_to_base : function(test) {

                var factory = function(c, item) {};
                instanceRegistration.as(factory);

                test.strictEqual(baseRegistration.factory, factory);
                test.done();
            },

            as_returns_initializeBy : function(test) {
                var funcResult = function(item) {};

                var initializeBy = {
                    bind : mockery.stub()
                };
                initializeBy.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.initializeBy = initializeBy;
                var result = instanceRegistration.as(null);

                test.ok(initializeBy.bind.calledOnce);
                test.equal(result.initializeBy, funcResult);
                test.done();
            },

            as_returns_dispose : function(test) {
                var funcResult = function(item) {};

                var dispose = {
                    bind : mockery.stub()
                };
                dispose.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.dispose = dispose;
                var result = instanceRegistration.as(null);

                test.ok(dispose.bind.calledOnce);
                test.equal(result.dispose, funcResult);

                test.done();
            },

            as_returns_named : function(test) {
                var funcResult = function(item) {};

                var named = {
                    bind : mockery.stub()
                };
                named.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.named = named;
                var result = instanceRegistration.as(null);

                test.ok(named.bind.calledOnce);
                test.equal(result.named, funcResult);

                test.done();
            },

            as_returns_within : function(test) {
                var funcResult = function(item) {};

                var within = {
                    bind : mockery.stub()
                };
                within.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.within = within;
                var result = instanceRegistration.as(null);

                test.ok(within.bind.calledOnce);
                test.equal(result.within, funcResult);

                test.done();
            },

            as_returns_ownedBy : function(test) {
                var funcResult = function(item) {};

                var ownedBy = {
                    bind : mockery.stub()
                };
                ownedBy.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.ownedBy = ownedBy;
                var result = instanceRegistration.as(null);

                test.ok(ownedBy.bind.calledOnce);
                test.equal(result.ownedBy, funcResult);

                test.done();
            },

            as_returns_min_set_of_methods : function(test) {

                const result = instanceRegistration.as(null);
                const methods = Object.getOwnPropertyNames(result);

                const expectedMethods = [
                    'initializeBy',
                    'dispose',
                    'named',
                    'within',
                    'ownedBy',
                    'ownedInternally',
                    'ownedExternally'
                ];

                const expected = methods
                    .every(method => expectedMethods.includes(method));

                test.ok(expected);
                test.done();
            },

            named_sets_name_to_base : function(test) {

                var name = 'test';

                instanceRegistration.named(name);

                test.strictEqual(baseRegistration.name, name);

                test.done();
            },

            named_returns_within : function(test) {
                var funcResult = function(item) {};

                var within = {
                    bind : mockery.stub()
                };
                within.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.within = within;
                var result = instanceRegistration.named(null);

                test.ok(within.bind.calledOnce);
                test.equal(result.within, funcResult);

                test.done();
            },

            named_returns_ownedBy : function(test) {
                var funcResult = function(item) {};

                var ownedBy = {
                    bind : mockery.stub()
                };
                ownedBy.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.ownedBy = ownedBy;
                var result = instanceRegistration.named(null);

                test.ok(ownedBy.bind.calledOnce);
                test.equal(result.ownedBy, funcResult);

                test.done();
            },

            named_returns_min_set_of_methods : function(test) {

                const result = instanceRegistration.named(null);
                const methods = Object.getOwnPropertyNames(result);

                const expectedMethods = [
                    'within',
                    'ownedBy',
                    'ownedInternally',
                    'ownedExternally'
                ];

                const expected = methods
                    .every(method => expectedMethods.includes(method));

                test.ok(expected);
                test.done();
            },

            within_sets_scope_to_base : function(test) {

                var scope = Types.Scope.Hierarchy;

                instanceRegistration.within(scope);

                test.strictEqual(baseRegistration.scope, scope);

                test.done();
            },

            within_returns_ownedBy : function(test) {
                var funcResult = function(item) {};

                var ownedBy = {
                    bind : mockery.stub()
                };
                ownedBy.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.ownedBy = ownedBy;
                var result = instanceRegistration.within(null);

                test.ok(ownedBy.bind.calledOnce);
                test.equal(result.ownedBy, funcResult);

                test.done();
            },

            within_returns_min_set_of_methods : function(test) {

                const result = instanceRegistration.within(null);
                const methods = Object.getOwnPropertyNames(result);

                const expectedMethods = [
                    'ownedBy',
                    'ownedInternally',
                    'ownedExternally'
                ];

                const expected = methods
                    .every(method => expectedMethods.includes(method));

                test.ok(expected);
                test.done();
            },

            ownedBy_sets_owner_to_base : function(test) {

                var owner = Types.Owner.Externals;

                instanceRegistration.ownedBy(owner);

                test.strictEqual(baseRegistration.owner, owner);

                test.done();
            },

            initializeBy_sets_initializer_to_base : function(test) {

                var initializer = function(item) {};

                instanceRegistration.initializeBy(initializer);

                test.strictEqual(baseRegistration.initializer, initializer);

                test.done();
            },

            initializeBy_returns_dispose : function(test) {
                var funcResult = function(item) {};

                var dispose = {
                    bind : mockery.stub()
                };
                dispose.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.dispose = dispose;
                var result = instanceRegistration.initializeBy(null);

                test.ok(dispose.bind.calledOnce);
                test.equal(result.dispose, funcResult);

                test.done();
            },

            initializeBy_returns_named : function(test) {
                var funcResult = function(item) {};

                var named = {
                    bind : mockery.stub()
                };
                named.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.named = named;
                var result = instanceRegistration.initializeBy(null);

                test.ok(named.bind.calledOnce);
                test.equal(result.named, funcResult);

                test.done();
            },

            initializeBy_returns_within : function(test) {
                var funcResult = function(item) {};

                var within = {
                    bind : mockery.stub()
                };
                within.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.within = within;
                var result = instanceRegistration.initializeBy(null);

                test.ok(within.bind.calledOnce);
                test.equal(result.within, funcResult);

                test.done();
            },

            initializeBy_returns_ownedBy : function(test) {
                var funcResult = function(item) {};

                var ownedBy = {
                    bind : mockery.stub()
                };
                ownedBy.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.ownedBy = ownedBy;
                var result = instanceRegistration.initializeBy(null);

                test.ok(ownedBy.bind.calledOnce);
                test.equal(result.ownedBy, funcResult);

                test.done();
            },

            initializeBy_returns_min_set_of_methods : function(test) {

                const result = instanceRegistration.initializeBy(null);
                const methods = Object.getOwnPropertyNames(result);

                const expectedMethods = [
                    'dispose',
                    'named',
                    'within',
                    'ownedBy',
                    'ownedInternally',
                    'ownedExternally'
                ];

                const expected = methods
                    .every(method => expectedMethods.includes(method));

                test.ok(expected);
                test.done();
            },

            dispose_sets_disposer_to_base : function(test) {

                var disposer = function(item) {};

                instanceRegistration.dispose(disposer);

                test.strictEqual(baseRegistration.disposer, disposer);

                test.done();
            },

            dispose_returns_named : function(test) {
                var funcResult = function(item) {};

                var named = {
                    bind : mockery.stub()
                };
                named.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.named = named;
                var result = instanceRegistration.dispose(null);

                test.ok(named.bind.calledOnce);
                test.equal(result.named, funcResult);

                test.done();
            },

            dispose_returns_within : function(test) {
                var funcResult = function(item) {};

                var within = {
                    bind : mockery.stub()
                };
                within.bind.withArgs(instanceRegistration).returns(funcResult);


                instanceRegistration.within = within;
                var result = instanceRegistration.dispose(null);

                test.ok(within.bind.calledOnce);
                test.equal(result.within, funcResult);

                test.done();
            },

            dispose_returns_ownedBy : function(test) {
                var funcResult = function(item) {};

                var ownedBy = {
                    bind : mockery.stub()
                };
                ownedBy.bind.withArgs(instanceRegistration).returns(funcResult);

                instanceRegistration.ownedBy = ownedBy;
                var result = instanceRegistration.dispose(null);

                test.ok(ownedBy.bind.calledOnce);
                test.equal(result.ownedBy, funcResult);

                test.done();
            },

            dispose_returns_min_set_of_methods : function(test) {

                const result = instanceRegistration.dispose(null);
                const methods = Object.getOwnPropertyNames(result);

                const expectedMethods = [
                    'named',
                    'within',
                    'ownedBy',
                    'ownedInternally',
                    'ownedExternally'
                ];

                const expected = methods
                    .every(method => expectedMethods.includes(method));

                test.ok(expected);
                test.done();
            },

            ownedInternally_sets_internal_owner: function(test) {
                baseRegistration.owner = null;
                instanceRegistration.ownedInternally();

                test.strictEqual(baseRegistration.owner, Scaffold.Types.Owner.Container);
                test.done();
            },

            ownedExternally_sets_external_owner: function(test) {
                baseRegistration.owner = null;
                instanceRegistration.ownedExternally();

                test.strictEqual(baseRegistration.owner, Scaffold.Types.Owner.Externals);
                test.done();
            },

            asSelf_sets_params: function(test) {
                baseRegistration.service = function() {};
                instanceRegistration.asType = mockery.stub();

                instanceRegistration.asSelf('one', 2);

                test.ok(instanceRegistration.asType.withArgs(baseRegistration.service, 'one', 2).calledOnce);
                test.done();
            }
        };
    })()
}



















