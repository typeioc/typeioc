"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestData = require("../data/decorators");
const scaffold = require("./../scaffold");
var Level13;
(function (Level13) {
    var container;
    var container2;
    Level13.decorators = {
        setUp(callback) {
            container = TestData.decorator.build();
            container2 = TestData.decorator2.build();
            callback();
        },
        plain_instantiation(test) {
            var actual = container.resolve(TestData.Registration.TestBase);
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test : foo');
            test.done();
        },
        plain_instantiation_asTypeClass: function (test) {
            class TestBase {
                foo() { }
            }
            class TestBase2 {
                foo() { }
            }
            class Test1 {
                foo() { return 'Test : foo'; }
            }
            class Test2 {
                constructor(test1) {
                    this.test1 = test1;
                }
                foo() { return 'Test2 : foo ' + this.test1.foo(); }
            }
            const builder = scaffold.createBuilder();
            builder.register(TestBase).asType(Test1);
            builder.register(TestBase).asType(Test2, TestBase).named("A");
            var container = builder.build();
            var actual = container.resolve(TestBase);
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test : foo');
            var actual2 = container.resolveNamed(TestBase, "A");
            test.strictEqual(actual2.foo(), 'Test2 : foo Test : foo');
            test.done();
        },
        instantiation_with_parameter_resolution(test) {
            var actual = container.resolve(TestData.Registration.TestBase1);
            test.ok(actual);
            test.strictEqual(actual.foo1(), 'Test : foo : foo1');
            test.done();
        },
        instantiation_with_multi_parameter_resolution(test) {
            var actual = container.resolve(TestData.Registration.TestBase2);
            test.ok(actual);
            test.strictEqual(actual.foo2(), 'Test : foo | Test : foo : foo1 | foo2');
            test.done();
        },
        initializeBy_usage(test) {
            var actual = container.resolve(TestData.InitializeBy.TestBase);
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test : foo foo 2');
            actual = container.resolve(TestData.InitializeBy.TestBase1);
            test.ok(actual);
            test.strictEqual(actual.foo(), 'foo 3 interceptor');
            test.done();
        },
        scope_none_can_resolve(test) {
            const actual1 = container.resolve(TestData.Scope.TestBase);
            const actual2 = container.resolve(TestData.Scope.TestBase);
            const actual3 = container.resolve('None');
            const actual4 = container.resolve('None');
            test.ok(actual1 !== actual2);
            test.strictEqual(actual1.foo(), 'Test : foo test none');
            test.strictEqual(actual2.foo(), 'Test : foo test none');
            test.ok(actual3 !== actual4);
            test.strictEqual(actual3.foo(), 'Test : foo test none');
            test.strictEqual(actual4.foo(), 'Test : foo test none');
            test.done();
        },
        scope_container_can_resolve_clone(test) {
            const actual1 = container.resolve(TestData.Scope.TestBase2);
            const actual11 = container.resolve('Container');
            const child = container.createChild();
            const actual2 = child.resolve(TestData.Scope.TestBase2);
            const actual21 = child.resolve('Container');
            test.strictEqual(actual1.foo(), 'Test : foo test Container');
            test.strictEqual(actual2.foo(), 'Test : foo test Container');
            test.notStrictEqual(actual1, actual2);
            test.strictEqual(actual11.foo(), 'Test : foo test Container');
            test.strictEqual(actual21.foo(), 'Test : foo test Container');
            test.notStrictEqual(actual11, actual21);
            test.done();
        },
        scope_hierarchy_can_resolve_same_instance(test) {
            const actual1 = container.resolve(TestData.Scope.TestBase3);
            const actual11 = container.resolve('Single');
            const child = container.createChild();
            const actual2 = child.resolve(TestData.Scope.TestBase3);
            const actual21 = child.resolve('Single');
            test.strictEqual(actual1.foo(), 'Test : foo test Hierarchy');
            test.strictEqual(actual2.foo(), 'Test : foo test Hierarchy');
            test.strictEqual(actual1, actual2);
            test.strictEqual(actual11.foo(), 'Test : foo test Hierarchy');
            test.strictEqual(actual21.foo(), 'Test : foo test Hierarchy');
            test.strictEqual(actual11, actual21);
            test.done();
        },
        container_owned_instances_are_disposed(test) {
            var child = container.createChild();
            const actual1 = child.resolve(TestData.Owner.TestBase1);
            const actual2 = child.resolve(TestData.OwnerApi.TestBase1);
            child.dispose();
            const result1 = actual1.foo();
            const result2 = actual2.foo();
            test.strictEqual(result1, 'Test : foo disposed');
            test.strictEqual(result2, 'Test : foo disposed');
            test.done();
        },
        external_owned_instances_are_not_disposed(test) {
            var child = container.createChild();
            const actual1 = child.resolve(TestData.Owner.TestBase2);
            const actual2 = child.resolve(TestData.OwnerApi.TestBase2);
            child.dispose();
            const result1 = actual1.foo();
            const result2 = actual2.foo();
            test.strictEqual(result1, 'Test : foo test');
            test.strictEqual(result2, 'Test : foo test');
            test.done();
        },
        named_instances_resolved(test) {
            var actual1 = container.resolveNamed(TestData.Named.TestBase, "Some name");
            var actual2 = container.resolveNamed(TestData.Named.TestBase, "Some name 2");
            test.notStrictEqual(actual1, actual2);
            test.strictEqual(actual1.foo(), "Test : foo test");
            test.strictEqual(actual2.foo(), "Test2 : foo test");
            test.done();
        },
        resolveValue_instantiation(test) {
            var actual = container.resolve(TestData.Resolve.ByValue.TestBase);
            test.strictEqual(actual.foo(), "Test1 : decorator value");
            test.done();
        },
        multiple_resolveValue_instantiation(test) {
            var actual = container.resolve(TestData.Resolve.ByValue.TestBase1);
            test.strictEqual(actual.foo(), "Test1 : value 1 value 2 value 3");
            test.done();
        },
        resolve_by_service_instantiation(test) {
            var actual = container.resolve(TestData.Resolve.ByService.TestBase1);
            test.strictEqual(actual.foo(), "Test1 : Test Test2 Test");
            test.done();
        },
        resolve_by_multiple_service_instantiation(test) {
            var actual1 = container.resolve(TestData.Resolve.ByMultipleService.TestBase1);
            var actual2 = container.resolve(TestData.Resolve.ByMultipleService.TestBase2);
            test.strictEqual(actual1.foo(), "Test1 Test Test");
            test.strictEqual(actual2.foo(), "Test2 Test1 Test Test Test");
            test.done();
        },
        resolve_by_args_instantiation(test) {
            var deligate = () => {
                var actual = container.resolve(TestData.Resolve.ByArgs.TestBase1);
                test.strictEqual(actual.foo(), "Test1 : Test 1 7");
            };
            if (process.env.NODE_ENV === 'coverage') {
                try {
                    deligate();
                }
                catch (err) { }
            }
            else {
                deligate();
            }
            test.done();
        },
        resolve_by_args_directly(test) {
            var actual = container.resolve(TestData.Resolve.ByArgs.TestBase, 11, 17);
            test.strictEqual(actual.foo(), "Test 11 17");
            test.done();
        },
        resolve_by_name(test) {
            var actual = container.resolve(TestData.Resolve.ByName.TestBase1);
            test.strictEqual(actual.foo(), "Test1 : Test Test Test");
            test.done();
        },
        resolve_by_attempt(test) {
            var actual = container.resolve(TestData.Resolve.ByAttempt.TestBase);
            test.strictEqual(actual.foo(), "Test no value Test1");
            var actual2 = container.tryResolve(TestData.Resolve.ByAttempt.TestBase);
            test.strictEqual(actual2.foo(), "Test no value Test1");
            test.done();
        },
        resolve_by_cache(test) {
            var actual = container.resolve(TestData.Resolve.ByCache.TestBase1);
            test.strictEqual(actual.foo(), "Test1 : Test");
            var actual2 = container.cache['TestBase'];
            test.ok(actual2);
            test.strictEqual(actual2.foo(), 'Test');
            test.done();
        },
        decorator_target_error: function (test) {
            var delegate = function () {
                var classDecorator = scaffold.createDecorator().provide('Test').register();
                classDecorator('Test');
            };
            test.throws(delegate, function (err) {
                test.strictEqual(err.data.target, 'Test');
                return (err instanceof scaffold.Exceptions.DecoratorError) &&
                    /Decorator target not supported, not a prototype/.test(err.message);
            });
            test.done();
        },
        resolve_full_api: function (test) {
            var actual = container
                .resolveWith(TestData.Resolve.FullResolution.TestBase3)
                .args(1, 2)
                .name('Some name')
                .cache()
                .exec();
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test 1 2');
            actual = container.cache['Some name'];
            test.strictEqual(actual.foo(), 'Test 1 2');
            test.done();
        },
        resolve_with_dependency: function (test) {
            var dependencies = [{
                    service: TestData.Resolve.FullResolution.TestBase,
                    factoryType: TestData.Resolve.FullResolution.TestDep
                }];
            var actual = container
                .resolveWith(TestData.Resolve.FullResolution.TestBase1)
                .dependencies(dependencies)
                .exec();
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test dependency');
            test.done();
        },
        resolve_with_multiple_dependencies: function (test) {
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
                    factoryType: TestData.Resolve.FullResolution.TestDep3,
                    named: 'Some name'
                }];
            var actual = container
                .resolveWith(TestData.Resolve.FullResolution.TestBase2)
                .dependencies(dependencies)
                .exec();
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test dependency dependency 1 dependency 3');
            test.done();
        },
        resolve_with_multiple_dependencies_with_resolution_value: function (test) {
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
                    factoryType: TestData.Resolve.FullResolution.TestDep3,
                    named: 'Some name'
                }];
            var actual = container
                .resolveWith(TestData.Resolve.FullResolution.TestBase4)
                .dependencies(dependencies)
                .exec();
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test dependency dependency 1 decorator value dependency 3');
            test.done();
        },
        resolve_with_named_dependencies: function (test) {
            var dependencies = [{
                    service: TestData.Resolve.DependenciesProperties.TestBase,
                    factoryType: TestData.Resolve.DependenciesProperties.TestDep,
                    named: 'Some test name'
                }];
            var actual = container
                .resolveWith(TestData.Resolve.DependenciesProperties.TestBase1)
                .dependencies(dependencies)
                .exec();
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test dependency Some test name');
            test.done();
        },
        resolve_with_initialized_dependencies: function (test) {
            var actual = container
                .resolveWith('some TestInit')
                .exec();
            var actual2 = container
                .resolveWith('some TestInit')
                .dependencies({
                service: TestData.Resolve.DependenciesInit.TestBase,
                factoryType: TestData.Resolve.DependenciesInit.TestDep,
                initializer: (c, item) => {
                    item.foo = function () { return 'Dependency initialized'; };
                    return item;
                }
            })
                .exec();
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test Initialized');
            test.strictEqual(actual2.foo(), 'Test Dependency initialized');
            test.done();
        },
        resolve_with_required_dependencies: function (test) {
            var actual = container
                .resolveWith(TestData.Resolve.DependenciesNonRequired.TestBase)
                .dependencies({
                service: TestData.Resolve.DependenciesNonRequired.TestBase1,
                factoryType: TestData.Resolve.DependenciesNonRequired.TestDep,
                required: false
            })
                .exec();
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test dependency');
            test.done();
        },
        resolve_by_object_string: function (test) {
            var actual = container
                .resolve(TestData.Resolve.ObjectResolution.TestBase);
            test.strictEqual(actual.foo(), 'Test Test1');
            test.done();
        },
        resolve_by_object_number: function (test) {
            var actual = container
                .resolve(TestData.Resolve.NumberResolution.TestBase);
            test.strictEqual(actual.foo(), 'Test Test1');
            test.done();
        },
        multiple_decorators: function (test) {
            var actual = container
                .resolve(TestData.Resolve.MultipleDecorators.TestBase1);
            var actual2 = container2
                .resolve(TestData.Resolve.MultipleDecorators.TestBase1);
            test.notStrictEqual(actual, actual2);
            test.strictEqual(actual.foo(), 'Test 1  Test Test2 Test3');
            test.strictEqual(actual2.foo(), 'Test 1  Test Test2 Test3');
            test.done();
        }
    };
})(Level13 = exports.Level13 || (exports.Level13 = {}));
//# sourceMappingURL=level13.js.map