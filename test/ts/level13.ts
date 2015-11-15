//'use strict';

import TestData = require('../data/decorators');
import scaffold = require('./../scaffold');


export module Level13 {

    var container : Typeioc.IContainer;

    export var embedded_container = {
        setUp(callback) {
            container = scaffold.getDecorator().build();

            callback();
        },

        plain_instantiation(test) {

            var actual = container.resolve<TestData.Registration.TestBase>(TestData.Registration.TestBase);

            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test : foo');

            test.done();
        },

        instantiation_with_parameter_resolution(test) {

            var actual = container.resolve<TestData.Registration.TestBase1>(TestData.Registration.TestBase1);

            test.ok(actual);
            test.strictEqual(actual.foo1(), 'Test : foo : foo1');

            test.done();
        },

        instantiation_with_multi_parameter_resolution(test) {

            var actual = container.resolve<TestData.Registration.TestBase2>(TestData.Registration.TestBase2);

            test.ok(actual);
            test.strictEqual(actual.foo2(), 'Test : foo | Test : foo : foo1 | foo2');

            test.done();
        },

        initializeBy_usage(test) {
            var actual = container.resolve<TestData.InitializeBy.TestBase>(TestData.InitializeBy.TestBase);

            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test : foo foo 2');

            actual = container.resolve<TestData.InitializeBy.TestBase1>(TestData.InitializeBy.TestBase1);

            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test : foo foo 3');

            test.done();
        },

        scope_none_can_resolve(test) {
            var actual = container.resolve<TestData.Scope.TestBase>(TestData.Scope.TestBase);

            test.strictEqual(actual.foo(), 'Test : foo test none');

            test.done();
        },

        scope_container_can_resolve_clone(test) {
            var actual = container.resolve<TestData.Scope.TestBase2>(TestData.Scope.TestBase2);

            test.strictEqual(actual.foo(), 'Test : foo test Container');

            var child = container.createChild();

            var actual2 = child.resolve<TestData.Scope.TestBase2>(TestData.Scope.TestBase2);

            test.strictEqual(actual2.foo(), 'Test : foo test Container');
            test.notStrictEqual(actual, actual2);

            test.done();
        },


        //add scope hierarchy test
    }
}