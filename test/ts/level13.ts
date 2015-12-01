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

        plain_instantiation1(test) {

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

        scope_hierarchy_can_resolve_same_instance(test) {
            var actual = container.resolve<TestData.Scope.TestBase3>(TestData.Scope.TestBase3);

            test.strictEqual(actual.foo(), 'Test : foo test Hierarchy');

            var child = container.createChild();

            var actual2 = child.resolve<TestData.Scope.TestBase3>(TestData.Scope.TestBase3);

            test.strictEqual(actual2.foo(), 'Test : foo test Hierarchy');
            test.strictEqual(actual, actual2);

            test.done();
        },

        container_owned_instances_are_disposed(test) {

            var child = container.createChild();
            var actual = child.resolve<TestData.Owner.TestBase1>(TestData.Owner.TestBase1);

            child.dispose();
            var result = actual.foo();

            test.strictEqual(result, 'Test : foo disposed');

            test.done();
        },

        external_owned_instances_are_not_disposed(test) {

            var child = container.createChild();
            var actual = child.resolve<TestData.Owner.TestBase2>(TestData.Owner.TestBase2);

            child.dispose();
            var result = actual.foo();

            test.strictEqual(result, 'Test : foo test');

            test.done();
        },

        named_instances_resolved(test) {
            var actual1 = container.resolveNamed<TestData.Named.TestBase>(TestData.Named.TestBase, "Some name");
            var actual2 = container.resolveNamed<TestData.Named.TestBase>(TestData.Named.TestBase, "Some name 2");

            test.notStrictEqual(actual1, actual2);
            test.strictEqual(actual1.foo(), "Test : foo test");
            test.strictEqual(actual2.foo(), "Test2 : foo test");

            test.done();
        },

        resolveValue_instantiation(test) {
            var actual = container.resolve<TestData.Resolve.ByValue.TestBase>(TestData.Resolve.ByValue.TestBase);

            test.strictEqual(actual.foo(), "Test1 : decorator value");

            test.done();
        },

        multiple_resolveValue_instantiation(test) {
            var actual = container.resolve<TestData.Resolve.ByValue.TestBase1>(TestData.Resolve.ByValue.TestBase1);

            test.strictEqual(actual.foo(), "Test1 : value 1 value 2 value 3");

            test.done();
        },

        resolve_by_service_instantiation(test) {

            var actual = container.resolve<TestData.Resolve.ByService.TestBase1>(TestData.Resolve.ByService.TestBase1);

            test.strictEqual(actual.foo(), "Test1 : Test Test2 Test");

            test.done();
        },

        resolve_by_args_instantiation(test) {

            var actual = container.resolve<TestData.Resolve.ByArgs.TestBase1>(TestData.Resolve.ByArgs.TestBase1);

            test.strictEqual(actual.foo(), "Test1 : Test 1 7");

            test.done();
        },

        resolve_by_args_directly(test) {
            var actual = container.resolve<TestData.Resolve.ByArgs.TestBase>(TestData.Resolve.ByArgs.TestBase, 11, 17);

            test.strictEqual(actual.foo(), "Test 11 17");

            test.done();
        },

        resolve_by_name(test) {
            var actual = container.resolve<TestData.Resolve.ByName.TestBase1>(TestData.Resolve.ByName.TestBase1);

            test.strictEqual(actual.foo(), "Test1 : Test Test Test");

            test.done();
        },

        resolve_by_attempt(test) {
            var actual = container.resolve<TestData.Resolve.ByAttempt.TestBase>(TestData.Resolve.ByAttempt.TestBase);

            test.strictEqual(actual.foo(), "Test no value");

            test.done();
        },

        resolve_by_cache(test) {
            var actual = container.resolve<TestData.Resolve.ByCache.TestBase1>(TestData.Resolve.ByCache.TestBase1);

            test.strictEqual(actual.foo(), "Test1 : Test");

            var actual2 = <TestData.Resolve.ByCache.TestBase>container.cache['TestBase'];

            test.ok(actual2);
            test.strictEqual(actual2.foo(), 'Test');

            test.done();
        }
    }
}