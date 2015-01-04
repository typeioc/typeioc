

'use strict';

exports.internal = {

    moduleRegistration : (function() {

        var Scaffold = require('../../scaffold');
        var Types = Scaffold.Types;
        var Module = require('../../../lib/registration/module/moduleRegistration');
        var mockery = Scaffold.Mockery;


        var moduleRegistration;
        var registrationBase;
        var internalStorage;
        var registrationBaseService;

        return {

            setUp: function (callback) {

                registrationBase = {};
                internalStorage = {};
                registrationBaseService = {};


                moduleRegistration = new Module.ModuleRegistration(
                    registrationBase,
                    internalStorage,
                    registrationBaseService);
                callback();
            },

            getAsModuleRegistration_returns_as_method : function(test) {

                var funcResult = function(item) {};

                var as = {
                    bind : mockery.stub()
                };
                as.bind.withArgs(moduleRegistration).returns(funcResult);

                moduleRegistration.as = as;

                var result = moduleRegistration.getAsModuleRegistration();

                test.ok(as.bind.calledOnce);
                test.equal(result.as, funcResult);

                test.done();
            },

            getAsModuleRegistration_returns_min_set_of_methods : function(test) {

                var result = moduleRegistration.getAsModuleRegistration();

                var methods = Object.getOwnPropertyNames(result);

                var actual = methods.filter(function(item) {
                    return item != 'as';
                });

                test.strictEqual(actual.length, 0);

                test.done();
            },

            as_calls_asModuleInitializedReusedOwned : function(test) {

                var returnFunc = function(item) {};

                var asApi = mockery.stub();
                asApi.returns(returnFunc);

                moduleRegistration.asModuleInitializedReusedOwned = asApi;

                moduleRegistration.as(function test() {});

                test.ok(asApi.calledOnce);

                test.done();
            },

            within_set_scope_to_base : function(test) {

                var scope = Types.Scope.Hierarchy;

                moduleRegistration.within(scope);

                test.strictEqual(registrationBase.scope, scope);

                test.done();
            },

            within_returns_ownedBy_method : function(test) {

                var funcResult = function(item) {};

                var ownedBy = {
                    bind : mockery.stub()
                };
                ownedBy.bind.withArgs(moduleRegistration).returns(funcResult);

                moduleRegistration.ownedBy = ownedBy;

                var result = moduleRegistration.within(undefined);

                test.ok(ownedBy.bind.calledOnce);
                test.equal(result.ownedBy, funcResult);

                test.done();
            },

            ownedBy_set_owner_to_base : function(test) {

                var owner = Types.Owner.Externals;

                moduleRegistration.ownedBy(owner);

                test.strictEqual(registrationBase.owner, owner);

                test.done();
            },

            for_registers_into_internal_storage : function(test) {

                var service = function service () {};
                var factory = function factory(c, item1, item2) {};
                var options = {};

                var emptyRegoOptionsEntry = mockery.match(function (value) {

                    var realValue = value();

                    return realValue.factory === null && realValue.name === null;
                }, "emptyRegoOptionsEntry");

                var register = mockery.stub();
                register.withArgs(service, emptyRegoOptionsEntry).returns(options);
                internalStorage.register = register;

                moduleRegistration.forService(service, factory);

                test.ok(register.calledOnce);
                test.strictEqual(options.factory, factory);

                test.done();
            },

            for_calls_asModuleInitializedReusedOwned : function(test) {

                var register = mockery.stub();
                register.returns({});
                internalStorage.register = register;

                var asModuleInitializedReusedOwned = mockery.stub();

                moduleRegistration.asModuleInitializedReusedOwned = asModuleInitializedReusedOwned;
                moduleRegistration.forService(undefined, undefined);

                test.ok(asModuleInitializedReusedOwned.calledOnce);

                test.done();
            },

            forArgs_registers_into_internal_storage : function(test) {

                var service = function service () {};
                var options = {};

                var emptyRegoOptionsEntry = mockery.match(function (value) {

                    var realValue = value();

                    return realValue.factory === null && realValue.name === null;
                }, "emptyRegoOptionsEntry");

                var register = mockery.stub();
                register.withArgs(service, emptyRegoOptionsEntry).returns(options);
                internalStorage.register = register;

                moduleRegistration.forArgs(service);

                test.ok(register.calledOnce);
                test.ok(options.factory !== null);

                test.done();
            },

            forArgs_calls_asModuleInitializedReusedOwned : function(test) {

                var register = mockery.stub();
                register.returns({});
                internalStorage.register = register;

                var asModuleInitializedReusedOwned = mockery.stub();

                moduleRegistration.asModuleInitializedReusedOwned = asModuleInitializedReusedOwned;
                moduleRegistration.forArgs(undefined);

                test.ok(asModuleInitializedReusedOwned.calledOnce);

                test.done();
            },

            named_registers_into_internal_storage : function(test) {

                var service = function service () {};
                var name= 'test';
                var options = {};

                var emptyRegoOptionsEntry = mockery.match(function (value) {

                    var realValue = value();

                    return realValue.factory === null && realValue.name === null;
                }, "emptyRegoOptionsEntry");

                var register = mockery.stub();
                register.withArgs(service, emptyRegoOptionsEntry).returns(options);
                internalStorage.register = register;

                moduleRegistration.named(service, name);

                test.ok(register.calledOnce);
                test.strictEqual(options.name, name);

                test.done();
            },

            named_calls_asModuleInitializedReusedOwned : function(test) {

                var register = mockery.stub();
                register.returns({});
                internalStorage.register = register;

                var asModuleInitializedReusedOwned = mockery.stub();

                moduleRegistration.asModuleInitializedReusedOwned = asModuleInitializedReusedOwned;
                moduleRegistration.named(undefined);

                test.ok(asModuleInitializedReusedOwned.calledOnce);

                test.done();
            },

            createRegistration_returns_registration_with_defined_factory: function(test) {

                var scope = Types.Owner.Externals;
                var owner = Types.Scope.Hierarchy;
                var name = 'test';

                var data = {
                    service : function service (item) {},
                    substitute : function substitute(item) {}
                };

                var options = {
                    factory : function factory (item) {},
                    name : name
                };

                registrationBase.owner = owner;
                registrationBase.scope = scope;

                var emptyRegoOptionsEntry = mockery.match(function (value) {

                    var realValue = value();

                    return realValue.factory === null && realValue.name === null;
                }, "emptyRegoOptionsEntry");

                var register = mockery.stub();
                register.withArgs(data.substitute, emptyRegoOptionsEntry).returns(options);
                internalStorage.register = register;

                var create = mockery.stub();
                create.withArgs(data.service).returns({});
                registrationBaseService.create = create;

                var result = moduleRegistration.createRegistration(data);


                test.ok(register.calledOnce);
                test.ok(create.calledOnce);

                test.strictEqual(result.factory, options.factory);
                test.strictEqual(result.name, name);
                test.strictEqual(result.scope, scope);
                test.strictEqual(result.owner, owner);


                test.done();

            },

            createRegistration_returns_registration_with_created_factory: function(test) {

                var scope = Types.Owner.Externals;
                var owner = Types.Scope.Hierarchy;
                var name = 'test';

                var data = {
                    service : function service (item) {},
                    substitute : function substitute(item) {}
                };

                var options = {
                    factory : null,
                    name : name
                };

                registrationBase.owner = owner;
                registrationBase.scope = scope;

                var emptyRegoOptionsEntry = mockery.match(function (value) {

                    var realValue = value();

                    return realValue.factory === null && realValue.name === null;
                }, "emptyRegoOptionsEntry");

                var register = mockery.stub();
                register.withArgs(data.substitute, emptyRegoOptionsEntry).returns(options);
                internalStorage.register = register;

                var create = mockery.stub();
                create.withArgs(data.service).returns({});
                registrationBaseService.create = create;

                var result = moduleRegistration.createRegistration(data);


                test.ok(register.calledOnce);
                test.ok(create.calledOnce);

                test.ok(result.factory);

                var substitute = result.factory();
                test.ok(substitute);
                test.strictEqual(Object.getPrototypeOf(substitute).constructor, data.substitute);
                test.strictEqual(result.name, name);
                test.strictEqual(result.scope, scope);
                test.strictEqual(result.owner, owner);


                test.done();
            },

            asModuleInitializedReusedOwned_returns_within_method : function(test) {
                var funcResult = function(item) {};

                var within = {
                    bind : mockery.stub()
                };
                within.bind.withArgs(moduleRegistration).returns(funcResult);

                moduleRegistration.within = within;

                var result = moduleRegistration.asModuleInitializedReusedOwned();

                test.ok(within.bind.calledOnce);
                test.equal(result.within, funcResult);

                test.done();
            },

            asModuleInitializedReusedOwned_returns_ownedBy_method : function(test) {
                var funcResult = function(item) {};

                var ownedBy = {
                    bind : mockery.stub()
                };
                ownedBy.bind.withArgs(moduleRegistration).returns(funcResult);

                moduleRegistration.ownedBy = ownedBy;

                var result = moduleRegistration.asModuleInitializedReusedOwned();

                test.ok(ownedBy.bind.calledOnce);
                test.equal(result.ownedBy, funcResult);

                test.done();
            },

            asModuleInitializedReusedOwned_returns_for_method : function(test) {
                var funcResult = function(item) {};

                var forMethod = {
                    bind : mockery.stub()
                };
                forMethod.bind.withArgs(moduleRegistration).returns(funcResult);

                moduleRegistration.forService = forMethod;

                var result = moduleRegistration.asModuleInitializedReusedOwned();

                test.ok(forMethod.bind.calledOnce);
                test.equal(result.forService, funcResult);

                test.done();
            },

            asModuleInitializedReusedOwned_returns_forArgs_method : function(test) {
                var funcResult = function(item) {};

                var forArgs = {
                    bind : mockery.stub()
                };
                forArgs.bind.withArgs(moduleRegistration).returns(funcResult);

                moduleRegistration.forArgs = forArgs;

                var result = moduleRegistration.asModuleInitializedReusedOwned();

                test.ok(forArgs.bind.calledOnce);
                test.equal(result.forArgs, funcResult);

                test.done();
            },

            asModuleInitializedReusedOwned_returns_named_method : function(test) {
                var funcResult = function(item) {};

                var named = {
                    bind : mockery.stub()
                };
                named.bind.withArgs(moduleRegistration).returns(funcResult);

                moduleRegistration.named = named;

                var result = moduleRegistration.asModuleInitializedReusedOwned();

                test.ok(named.bind.calledOnce);
                test.equal(result.named, funcResult);

                test.done();
            },

            asModuleInitializedReusedOwned_returns_min_set_of_methods : function(test) {

                var result = moduleRegistration.asModuleInitializedReusedOwned();

                var methods = Object.getOwnPropertyNames(result);

                var actual = methods.filter(function(item) {
                    return item != 'within' &&
                        item != 'ownedBy' &&
                        item != 'forService' &&
                        item != 'forArgs' &&
                        item != 'named';
                });

                test.strictEqual(actual.length, 0);

                test.done();
            },

            emptyRegoOptionsEntry_returns_empty_options : function(test) {

                var result = moduleRegistration.emptyRegoOptionsEntry();

                test.ok(result.factory === null);
                test.ok(result.name === null);

                test.done();
            },

            registrations_returns_one_rego_for_compatible_function : function(test) {

                var service = function(){};
                service.prototype.a = function() {}
                service.prototype.b = function() {}

                var substitute = function(){};
                substitute.prototype.a = function() {}
                substitute.prototype.b = function() {}

                var moduleA = {
                    serviceClass : service
                };

                var moduleB = {
                    substituteClass : substitute
                };


                var createRegoOptions = mockery.match(function (value) {

                    return value.service && value.substitute;
                }, "createRegoOptions");


                var createRego = mockery.stub();
                createRego.withArgs(createRegoOptions).returns({});
                moduleRegistration.createRegistration = createRego;

                registrationBase.service = moduleA;
                moduleRegistration
                    .getAsModuleRegistration()
                    .as(moduleB);

                var regoes = moduleRegistration.registrations;

                test.ok(createRego.calledOnce);
                test.ok(regoes);
                test.strictEqual(1, regoes.length);
                test.ok(regoes[0]);


                test.done();
            },

            registrations_returns_zero_rego_for_noncompatible_function : function(test) {

                var service = function(){};
                service.prototype.a = function() {}
                service.prototype.b = function() {}

                var substitute = function(){};
                substitute.prototype.a = function() {}
                substitute.prototype.d = function() {}

                var moduleA = {
                    serviceClass : service
                };

                var moduleB = {
                    substituteClass : substitute
                };

               registrationBase.service = moduleA;
                moduleRegistration
                    .getAsModuleRegistration()
                    .as(moduleB);

                var regoes = moduleRegistration.registrations;

                test.ok(regoes);
                test.strictEqual(0, regoes.length);

                test.done();
            }
        };
    })()
}



















