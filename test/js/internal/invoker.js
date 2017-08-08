'use strict';

const Scaffold = require('../../scaffold');
const RegistrationBaseModule = require('../../../lib/registration/base/registrationBase');
const InvoketModule = require('../../../lib/build/invoker');
const mockery = Scaffold.Mockery;

exports.internal = {

    invoker: {
        invokes_factory : function(test) {

            const factory = mockery.stub();
            const serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
            serviceEntry.factory = factory;
            serviceEntry.container = {};
            const invoker = new InvoketModule.Invoker(serviceEntry.container, {});

            invoker.invoke(serviceEntry, true, []);

            test.ok(factory.calledOnce);

            test.done();
        },

        invokes_factory_with_container_as_first_parameter : function(test) {

            const container = {};
            const firstArg = 1;
            const secondArg = 'a';
            const thirdArg = 'test';
            const factory = mockery.stub();

            const serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
            serviceEntry.factory = factory;
            serviceEntry.container = container;
            const invoker = new InvoketModule.Invoker(container, {});
            
            invoker.invoke(serviceEntry, true, [firstArg, secondArg, thirdArg]);

            test.ok(factory.withArgs(container, firstArg, secondArg, thirdArg).calledOnce);

            test.done();
        },

        invoke_does_not_mutate_arguments: function(test) {

            const serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
            serviceEntry.factory = mockery.stub();
            serviceEntry.container = {};
            const args = [1, 2, '3'];
            serviceEntry.args = args;
            const invoker = new InvoketModule.Invoker(serviceEntry.container, {});
            
            invoker.invoke(serviceEntry, true, args);

            test.strictEqual(args, serviceEntry.args);
            test.strictEqual(serviceEntry.args[0], 1);
            test.strictEqual(serviceEntry.args[1], 2);
            test.strictEqual(serviceEntry.args[2], '3');

            invoker.invoke(serviceEntry, true, args);

            test.strictEqual(args, serviceEntry.args);
            test.strictEqual(serviceEntry.args[0], 1);
            test.strictEqual(serviceEntry.args[1], 2);
            test.strictEqual(serviceEntry.args[2], '3');

            test.done();
        }
    }
}
