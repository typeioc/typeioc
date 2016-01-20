//'use strict';

import TestData = require('../data/decorators');
import scaffold = require('./../scaffold');


export module Level13 {

    var container : Typeioc.IContainer;

    export var decorators = {
        setUp(callback) {
            container = TestData.decorator.build();

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
            test.strictEqual(actual.foo(), 'foo 3 interceptor');

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

        resolve_by_multiple_service_instantiation(test) {

            var actual1 = container.resolve<TestData.Resolve.ByMultipleService.TestBase1>(TestData.Resolve.ByMultipleService.TestBase1);
            var actual2 = container.resolve<TestData.Resolve.ByMultipleService.TestBase2>(TestData.Resolve.ByMultipleService.TestBase2);

            test.strictEqual(actual1.foo(), "Test1 Test 1 2 Test 3 4");
            test.strictEqual(actual2.foo(), "Test2 Test1 Test 1 2 Test 3 4 Test 5 6");

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

            test.strictEqual(actual.foo(), "Test no value Test1");

            var actual2 = container.tryResolve<TestData.Resolve.ByAttempt.TestBase>(TestData.Resolve.ByAttempt.TestBase);

            test.strictEqual(actual2.foo(), "Test no value Test1");

            test.done();
        },

        resolve_by_cache(test) {
            var actual = container.resolve<TestData.Resolve.ByCache.TestBase1>(TestData.Resolve.ByCache.TestBase1);

            test.strictEqual(actual.foo(), "Test1 : Test");

            var actual2 = <TestData.Resolve.ByCache.TestBase>container.cache['TestBase'];

            test.ok(actual2);
            test.strictEqual(actual2.foo(), 'Test');

            test.done();
        },

        decorator_target_error: function(test) {

            var delegate = function() {
                scaffold.createDecorator().provide('Test').register()('Test');
            };

            test.throws(delegate, function (err) {

                test.strictEqual(err.data.target, 'Test');

                return (err instanceof scaffold.Exceptions.DecoratorError) &&
                    /Decorator target not supported, not a prototype/.test(err.message);
            });

            test.done();
        },

        resolve_full_api : function(test) {

            var actual = container
                .resolveWith<TestData.Resolve.FullResolution.TestBase3>(TestData.Resolve.FullResolution.TestBase3)
                .args(1, 2)
                .name('Some name')
                .cache()
                .exec();

            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test 1 2');

            actual = <TestData.Resolve.FullResolution.TestBase>container.cache['Some name'];
            test.strictEqual(actual.foo(), 'Test 1 2');

            test.done();
        },

        resolve_with_dependency : function(test) {

            var dependencies = [{
                service: TestData.Resolve.FullResolution.TestBase,
                factoryType: TestData.Resolve.FullResolution.TestDep
            }];

            var actual = container
                .resolveWith<TestData.Resolve.FullResolution.TestBase1>(TestData.Resolve.FullResolution.TestBase1)
                .dependencies(dependencies)
                .exec();

            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test dependency');

            test.done();
        },

        resolve_with_multiple_dependencies : function(test) {

            var dependencies = [{
                    service: TestData.Resolve.FullResolution.TestBase,
                    factoryType: TestData.Resolve.FullResolution.TestDep
                },
                {
                    service: TestData.Resolve.FullResolution.TestBase1,
                    factoryType: TestData.Resolve.FullResolution.TestDep1
                },
                {
                    service: TestData.Resolve.FullResolution.TestBase3,
                    factoryType: TestData.Resolve.FullResolution.TestDep3
                }];

            var actual = container
                .resolveWith<TestData.Resolve.FullResolution.TestBase2>(TestData.Resolve.FullResolution.TestBase2)
                .dependencies(dependencies)
                .exec();

            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test dependency dependency 1 dependency 3');

            test.done();
        },

        resolve_with_multiple_dependencies_with_resolution_value : function(test) {

            var dependencies = [{
                service: TestData.Resolve.FullResolution.TestBase,
                factoryType: TestData.Resolve.FullResolution.TestDep
            },
                {
                    service: TestData.Resolve.FullResolution.TestBase1,
                    factoryType: TestData.Resolve.FullResolution.TestDep1
                },
                {
                    service: TestData.Resolve.FullResolution.TestBase3,
                    factoryType: TestData.Resolve.FullResolution.TestDep3
                }];

            var actual = container
                .resolveWith<TestData.Resolve.FullResolution.TestBase4>(TestData.Resolve.FullResolution.TestBase4)
                .dependencies(dependencies)
                .exec();

            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test dependency dependency 1 decorator value dependency 3');

            test.done();
        },

        resolve_with_named_dependencies : function(test) {

            var dependencies = [{
                service: TestData.Resolve.DependenciesProperties.TestBase,
                factoryType: TestData.Resolve.DependenciesProperties.TestDep,
                named : 'Some test name'
            }];

            var actual = container
                .resolveWith<TestData.Resolve.DependenciesProperties.TestBase1>(TestData.Resolve.DependenciesProperties.TestBase1)
                .dependencies(dependencies)
                .exec();

            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test dependency Some test name');

            test.done();
        },

        resolve_with_initialized_dependencies : function(test) {

            var actual = container
                .resolveWith<TestData.Resolve.DependenciesInit.TestBase>('some TestInit')
                .exec();

            var actual2 = container
                .resolveWith<TestData.Resolve.DependenciesInit.TestBase>('some TestInit')
                .dependencies({
                    service: TestData.Resolve.DependenciesInit.TestBase,
                    factoryType: TestData.Resolve.DependenciesInit.TestDep,
                    initializer : (c, item) => {
                        item.foo = function() {return 'Dependency initialized'; }
                        return item;
                    }
                })
                .exec();

            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test Initialized');

            test.strictEqual(actual2.foo(), 'Test Dependency initialized');

            test.done();
        },

        resolve_with_required_dependencies : function(test) {

            var actual = container
                .resolveWith<TestData.Resolve.DependenciesNonRequired.TestBase>(TestData.Resolve.DependenciesNonRequired.TestBase)
                .dependencies({
                    service: TestData.Resolve.DependenciesNonRequired.TestBase1,
                    factoryType: TestData.Resolve.DependenciesNonRequired.TestDep,
                    required : false
                })
                .exec();

            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test dependency');

            test.done();
        },

        resolve_by_object_string : function(test) {

            var actual = container
                .resolve<TestData.Resolve.ObjectResolution.TestBase>(TestData.Resolve.ObjectResolution.TestBase);

            test.strictEqual(actual.foo(), 'Test Test1');

            test.done();
        },

        resolve_by_object_number : function(test) {

            var actual = container
                .resolve<TestData.Resolve.NumberResolution.TestBase>(TestData.Resolve.NumberResolution.TestBase);

            test.strictEqual(actual.foo(), 'Test Test1');

            test.done();
        }
    }
}