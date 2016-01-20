'use strict';

exports.api = {

    level13: (function () {

        var TestData = require('../../data/decorators');
        var Scaffold = require('./../../scaffold');
        var ScaffoldAddons = require('./../../scaffoldAddons');
        var Types = Scaffold.Types;
        var decorator = null;
        var container = null;
        var builder = null;

        return {
            decorators : {

                setUp : function(callback) {
                    decorator = TestData.decorator;
                    container = decorator.build();
                    builder = Scaffold.createBuilder();
                    callback();
                },

                plain_instantiation : function(test) {

                    var Test1 = function() {};
                    Test1.prototype.foo = function() { };

                    var Test = function() {};
                    Test.prototype.foo = function() { return 'Test : foo';}

                    builder.register(Test1).asType(Test);

                    var container = builder.build();
                    var actual = container.resolve(Test1);

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test : foo');

                    test.done();
                },

                plain_instantiation_of_generated_code: function(test) {

                    var actual = container.resolve(TestData.Registration.TestBase);

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test : foo');

                    test.done();
                },

                instantiation_with_parameter_resolution: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() { };

                    var TestBase2 = function() {};
                    TestBase2.prototype.foo = function() { };

                    var Test1 = function() {};
                    Test1.prototype.foo = function() { return 'Test1 : foo';}

                    var Test2 = function(testBase) { this.value = testBase; };
                    Test2.prototype.foo = function() { return 'Test2 : foo ' + this.value.foo();}

                    builder.register(TestBase).asType(Test1);
                    builder.register(TestBase2).asType(Test2, TestBase);

                    var container = builder.build();
                    var actual = container.resolve(TestBase2);

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test2 : foo Test1 : foo');

                    test.done();
                },

                instantiation_with_parameter_resolution_generated_code: function(test) {

                    var actual = container.resolve(TestData.Registration.TestBase1);

                    test.ok(actual);
                    test.strictEqual(actual.foo1(), 'Test : foo : foo1');

                    test.done();
                },

                instantiation_with_multi_parameter_resolution: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var TestBase1 = function() {};
                    TestBase1.prototype.foo1 = function() {};

                    var TestBase2 = function() {};
                    TestBase2.prototype.foo2 = function() {};

                    var Test = function() {};
                    Test.prototype.foo = function() {
                        return 'Test : foo';
                    };

                    var Test1 = function(testBase) {
                        this.testBase = testBase;
                    };
                    Test1.prototype.foo1 = function() {
                        return this.testBase.foo() + ' : foo1';
                    };

                    var Test2 = function(testBase, testBase1) {
                        this.testBase = testBase;
                        this.testBase1 = testBase1;
                    };
                    Test2.prototype.foo2 = function() {
                        return [this.testBase.foo(), this.testBase1.foo1(), ': foo2'].join(' | ');
                    };

                    builder.register(TestBase).asType(Test);
                    builder.register(TestBase1).asType(Test1, TestBase);
                    builder.register(TestBase2).asType(Test2, TestBase, TestBase1);

                    var container = builder.build();
                    var actual = container.resolve(TestBase2);


                    test.ok(actual);
                    test.strictEqual(actual.foo2(), 'Test : foo | Test : foo : foo1 | : foo2');

                    test.done();
                },

                instantiation_with_multi_parameter_resolution_generated_code: function(test) {

                    var actual = container.resolve(TestData.Registration.TestBase2);

                    test.ok(actual);
                    test.strictEqual(actual.foo2(), 'Test : foo | Test : foo : foo1 | foo2');

                    test.done();
                },

                initializeBy_usage: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var TestBase1 = function() {};
                    TestBase1.prototype.foo1 = function() {};

                    var Test2 = function() {
                        this.text = null;
                    };
                    Test2.prototype.foo = function() {
                        return 'Test2 : foo ' + this.text;
                    };

                    var Test3 = function() {
                        this.text = null;
                    };
                    Test3.prototype.foo = function() {
                        return 'Test3 : foo ' + this.text;
                    };

                    builder.register(TestBase)
                        .asType(Test2)
                        .initializeBy(function (c, item) { item.text = 'foo 2'; return item;})

                    builder.register(TestBase1).asType(Test3)
                        .initializeBy(function (c, item) {

                            var interceptor = ScaffoldAddons.Interceptors.create();

                            item.text = 'foo 3';
                            item = interceptor.interceptInstance(item, {
                                method : 'foo',
                                wrapper : function(callInfo) { return  this.text +  ' interceptor'; }
                            });
                            return item;
                        });

                    var container = builder.build();
                    var actual = container.resolve(TestBase);

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test2 : foo foo 2');

                    actual = container.resolve(TestBase1);

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'foo 3 interceptor');

                    test.done();
                },

                initializeBy_usage_generated_code: function(test) {
                    var actual = container.resolve(TestData.InitializeBy.TestBase);

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test : foo foo 2');

                    actual = container.resolve(TestData.InitializeBy.TestBase1);

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'foo 3 interceptor');

                    test.done();
                },

                scope_none_can_resolve: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var Test = function() {
                        this.text = ' test none';
                    };
                    Test.prototype.foo = function() {
                        return 'Test : foo' + this.text;
                    };

                    builder.register(TestBase).asType(Test)
                        .within(Types.Scope.None);

                    var container = builder.build();
                    var actual = container.resolve(TestBase);

                    test.strictEqual(actual.foo(), 'Test : foo test none');

                    test.done();
                },

                scope_none_can_resolve_generated_code: function(test) {
                    var actual = container.resolve(TestData.Scope.TestBase);

                    test.strictEqual(actual.foo(), 'Test : foo test none');

                    test.done();
                },

                scope_container_can_resolve_clone: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var Test = function() {
                        this.text = ' test Container';
                    };
                    Test.prototype.foo = function() {
                        return 'Test : foo' + this.text;
                    };

                    builder.register(TestBase).asType(Test)
                        .within(Types.Scope.Container);

                    var container = builder.build();
                    var actual = container.resolve(TestBase);

                    test.strictEqual(actual.foo(), 'Test : foo test Container');

                    var child = container.createChild();

                    var actual2 = child.resolve(TestBase);

                    test.strictEqual(actual2.foo(), 'Test : foo test Container');
                    test.notStrictEqual(actual, actual2);

                    test.done();
                },

                scope_container_can_resolve_clone_generated_code: function(test) {
                    var actual = container.resolve(TestData.Scope.TestBase2);

                    test.strictEqual(actual.foo(), 'Test : foo test Container');

                    var child = container.createChild();

                    var actual2 = child.resolve(TestData.Scope.TestBase2);

                    test.strictEqual(actual2.foo(), 'Test : foo test Container');
                    test.notStrictEqual(actual, actual2);

                    test.done();
                },

                scope_hierarchy_can_resolve_same_instance: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var Test = function() {
                        this.text = ' test Hierarchy';
                    };
                    Test.prototype.foo = function() {
                        return 'Test : foo' + this.text;
                    };

                    builder.register(TestBase).asType(Test)
                        .within(Types.Scope.Hierarchy);

                    var container = builder.build();
                    var actual = container.resolve(TestBase);

                    test.strictEqual(actual.foo(), 'Test : foo test Hierarchy');

                    var child = container.createChild();

                    var actual2 = child.resolve(TestBase);

                    test.strictEqual(actual2.foo(), 'Test : foo test Hierarchy');
                    test.strictEqual(actual, actual2);

                    test.done();
                },

                scope_hierarchy_can_resolve_same_instance_generated_code: function(test) {
                    var actual = container.resolve(TestData.Scope.TestBase3);

                    test.strictEqual(actual.foo(), 'Test : foo test Hierarchy');

                    var child = container.createChild();

                    var actual2 = child.resolve(TestData.Scope.TestBase3);

                    test.strictEqual(actual2.foo(), 'Test : foo test Hierarchy');
                    test.strictEqual(actual, actual2);

                    test.done();
                },

                container_owned_instances_are_disposed: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};
                    TestBase.prototype.dispose = function() {};

                    var Test = function() {
                        this.text = 'test';
                    };
                    Test.prototype.foo = function() {
                        return 'Test : foo ' + this.text;
                    };
                    Test.prototype.dispose = function() {
                        this.text = 'disposed';
                    };

                    builder.register(TestBase).asType(Test)
                        .dispose(function(item) { item.dispose(); })
                        .ownedBy(Types.Owner.Container);

                    var container = builder.build();
                    var child = container.createChild();
                    var actual = child.resolve(TestBase);

                    test.strictEqual(actual.foo(), 'Test : foo test');
                    child.dispose();

                    test.strictEqual(actual.foo(), 'Test : foo disposed');

                    test.done();
                },

                container_owned_instances_are_disposed_generated_code: function(test) {

                    var child = container.createChild();
                    var actual = child.resolve(TestData.Owner.TestBase1);

                    child.dispose();
                    var result = actual.foo();

                    test.strictEqual(result, 'Test : foo disposed');

                    test.done();
                },

                external_owned_instances_are_not_disposed: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};
                    TestBase.prototype.dispose = function() {};

                    var Test = function() {
                        this.text = 'test';
                    };
                    Test.prototype.foo = function() {
                        return 'Test : foo ' + this.text;
                    };
                    Test.prototype.dispose = function() {
                        this.text = 'disposed';
                    };

                    builder.register(TestBase).asType(Test)
                        .dispose(function(item) { item.dispose(); })
                        .ownedBy(Types.Owner.Externals);

                    var container = builder.build();
                    var child = container.createChild();
                    var actual = child.resolve(TestBase);

                    test.strictEqual(actual.foo(), 'Test : foo test');
                    child.dispose();
                    test.strictEqual(actual.foo(), 'Test : foo test');

                    test.done();
                },

                external_owned_instances_are_not_disposed_generated_code: function(test) {

                    var child = container.createChild();
                    var actual = child.resolve(TestData.Owner.TestBase2);

                    child.dispose();
                    var result = actual.foo();

                    test.strictEqual(result, 'Test : foo test');

                    test.done();
                },

                named_instances_resolved: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var Test = function() {
                        this.text = 'test';
                    };
                    Test.prototype.foo = function() {
                        return 'Test : foo ' + this.text;
                    };

                    var Test2 = function() {
                        this.text = 'test';
                    };
                    Test2.prototype.foo = function() {
                        return 'Test2 : foo ' + this.text;
                    };

                    builder.register(TestBase).asType(Test)
                        .named('Some name');

                    builder.register(TestBase).asType(Test2)
                        .named('Some name 2');

                    var container = builder.build();
                    var actual1 = container.resolveNamed(TestBase, "Some name");
                    var actual2 = container.resolveNamed(TestBase, "Some name 2");

                    test.notStrictEqual(actual1, actual2);
                    test.strictEqual(actual1.foo(), "Test : foo test");
                    test.strictEqual(actual2.foo(), "Test2 : foo test");

                    test.done();
                },

                named_instances_resolved_generated_code: function(test) {
                    var actual1 = container.resolveNamed(TestData.Named.TestBase, "Some name");
                    var actual2 = container.resolveNamed(TestData.Named.TestBase, "Some name 2");

                    test.notStrictEqual(actual1, actual2);
                    test.strictEqual(actual1.foo(), "Test : foo test");
                    test.strictEqual(actual2.foo(), "Test2 : foo test");

                    test.done();
                },

                resolveValue_instantiation: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var Test = function(value) {
                        this.text = value;
                    };
                    Test.prototype.foo = function() {
                        return 'Test : ' + this.text;
                    };

                    builder.register(TestBase).asType(Test);

                    var container = builder.build();
                    var actual = container.resolve(TestBase, 'decorator value');

                    test.strictEqual(actual.foo(), "Test : decorator value");

                    test.done();
                },

                resolveValue_instantiation_generated_code: function(test) {
                    var actual = container.resolve(TestData.Resolve.ByValue.TestBase);

                    test.strictEqual(actual.foo(), "Test1 : decorator value");

                    test.done();
                },

                multiple_resolveValue_instantiation: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var Test = function(value1, value2, value3) {
                        this.value1 = value1;
                        this.value2 = value2;
                        this.value3 = value3;
                    };
                    Test.prototype.foo = function() {
                        return ['Test1 :', this.value1, this.value2, this.value3].join(' ');
                    };

                    builder.register(TestBase).asType(Test);

                    var container = builder.build();
                    var actual = container.resolve(TestBase, 'value 1', 'value 2', 'value 3');

                    test.strictEqual(actual.foo(), "Test1 : value 1 value 2 value 3");

                    test.done();
                },

                multiple_resolveValue_instantiation_generated_code: function(test) {
                    var actual = container.resolve(TestData.Resolve.ByValue.TestBase1);

                    test.strictEqual(actual.foo(), "Test1 : value 1 value 2 value 3");

                    test.done();
                },

                resolve_by_service_instantiation: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var TestBase1 = function() {};
                    TestBase1.prototype.foo = function() {};

                    var TestBase2 = function() {};
                    TestBase2.prototype.foo = function() {};

                    var Test = function() {};
                    Test.prototype.foo = function() {
                        return 'Test';
                    };

                    var Test2 = function() {};
                    Test2.prototype.foo = function() {
                        return 'Test2';
                    };

                    var Test1 = function(value1, value2, value3) {
                        this.value1 = value1;
                        this.value2 = value2;
                        this.value3 = value3;
                    };
                    Test1.prototype.foo = function() {
                        return ['Test1 :', this.value1.foo(), this.value2.foo(), this.value3.foo()].join(' ');
                    };

                    builder.register(TestBase).asType(Test);
                    builder.register(TestBase2).asType(Test2);
                    builder.register(TestBase1).as(function(c){
                        var test = c.resolve(TestBase);
                        var test2 = c.resolve(TestBase2);
                        var testSecond = c.resolve(TestBase);

                        return new Test1(test, test2, testSecond);
                    });

                    var container = builder.build();
                    var actual = container.resolve(TestBase1);

                    test.strictEqual(actual.foo(), "Test1 : Test Test2 Test");

                    test.done();
                },

                resolve_by_service_instantiation_generated_code: function(test) {

                    var actual = container.resolve(TestData.Resolve.ByService.TestBase1);

                    test.strictEqual(actual.foo(), "Test1 : Test Test2 Test");

                    test.done();
                },

                resolve_by_multiple_service_instantiation: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var TestBase1 = function() {};
                    TestBase1.prototype.foo = function() {};

                    var TestBase2 = function() {};
                    TestBase2.prototype.foo = function() {};

                    var Test = function(value1, value2) {
                        this.value1 = value1;
                        this.value2 = value2;
                    };
                    Test.prototype.foo = function() {
                        return ['Test', this.value1, this.value2].join(' ');
                    };

                    var Test1 = function(value1, value2) {
                        this.value1 = value1;
                        this.value2 = value2;
                    };
                    Test1.prototype.foo = function() {
                        return ['Test', this.value1.foo(), this.value2.foo()].join(' ');
                    };

                    var Test2 = function(value1, value2) {
                        this.value1 = value1;
                        this.value2 = value2;
                    };
                    Test2.prototype.foo = function() {
                        return ['Test', this.value1.foo(), this.value2.foo()].join(' ');
                    };

                    builder.register(TestBase).asType(Test);
                    builder.register(TestBase1).as(function(c) {

                        var val = c.resolve(TestBase, 1, 2);
                        var val2 = c.resolve(TestBase, 3, 4);

                        return new Test1(val, val2);
                    });

                    builder.register(TestBase2).as(function(c) {

                        var val = c.resolve(TestBase1);
                        var val2 = c.resolve(TestBase, 5, 6);

                        return new Test2(val, val2);
                    });

                    var container = builder.build();
                    var actual1 = container.resolve(TestBase1);
                    var actual2 = container.resolve(TestBase2);

                    test.strictEqual(actual1.foo(), "Test Test 1 2 Test 3 4");
                    test.strictEqual(actual2.foo(), "Test Test Test 1 2 Test 3 4 Test 5 6");

                    test.done();
                },

                resolve_by_multiple_service_instantiation_generated_code: function(test) {

                    var actual1 = container.resolve(TestData.Resolve.ByMultipleService.TestBase1);
                    var actual2 = container.resolve(TestData.Resolve.ByMultipleService.TestBase2);

                    test.strictEqual(actual1.foo(), "Test1 Test 1 2 Test 3 4");
                    test.strictEqual(actual2.foo(), "Test2 Test1 Test 1 2 Test 3 4 Test 5 6");

                    test.done();
                },

                resolve_by_args_instantiation: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var TestBase1 = function() {};
                    TestBase1.prototype.foo = function() {};

                    var Test = function(value1, value2) {
                        this.value1 = value1;
                        this.value2 = value2;
                    };
                    Test.prototype.foo = function() {
                        return ['Test', this.value1, this.value2].join(' ');
                    };

                    var Test1 = function(value) {
                        this.value = value;
                    };
                    Test1.prototype.foo = function() {
                        return ['Test1 :', this.value.foo()].join(' ');
                    };

                    builder.register(TestBase).asType(Test);
                    builder.register(TestBase1).as(function(c) {

                        var test = c.resolve(TestBase, '1', '7');
                        return new Test1(test);

                    });

                    var container = builder.build();
                    var actual = container.resolve(TestBase1);

                    test.strictEqual(actual.foo(), "Test1 : Test 1 7");

                    test.done();
                },

                resolve_by_args_instantiation_generated_code: function(test) {

                    var actual = container.resolve(TestData.Resolve.ByArgs.TestBase1);

                    test.strictEqual(actual.foo(), "Test1 : Test 1 7");

                    test.done();
                },

                resolve_by_args_directly_generated_code: function(test) {
                    var actual = container.resolve(TestData.Resolve.ByArgs.TestBase, 11, 17);

                    test.strictEqual(actual.foo(), "Test 11 17");

                    test.done();
                },

                resolve_by_name_generated_code: function(test) {
                    var actual = container.resolve(TestData.Resolve.ByName.TestBase1);

                    test.strictEqual(actual.foo(), "Test1 : Test Test Test");

                    test.done();
                },

                resolve_by_attempt_generated_code: function(test) {
                    var actual = container.resolve(TestData.Resolve.ByAttempt.TestBase);

                    test.strictEqual(actual.foo(), "Test no value Test1");

                    test.done();
                },

                resolve_by_attempt: function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var TestBase2 = function() {};
                    TestBase2.prototype.foo = function() {};

                    var Test = function() {};
                    Test.prototype.foo = function() {
                        return 'Test';
                    };

                    var Test2 = function(value) {
                        this.value = value;
                    };
                    Test2.prototype.foo = function() {
                        return 'Test2 ' + (this.value ? this.value.foo() : 'no value');
                    };

                    builder.register(TestBase2).asType(Test2, TestBase);

                    var container = builder.build();
                    var actual = container.tryResolve(TestBase2);

                    test.strictEqual(actual.foo(), "Test2 no value");

                    actual = container.resolveWith(TestBase2)
                        .attempt()
                        .exec();

                    test.strictEqual(actual.foo(), "Test2 no value");

                    builder.register(TestBase).asType(Test);

                    container = builder.build();
                    actual = container.resolve(TestBase2);

                    test.strictEqual(actual.foo(), "Test2 Test");

                    actual = container.resolveWith(TestBase2)
                        .attempt()
                        .exec();

                    test.strictEqual(actual.foo(), "Test2 Test");

                    test.done();
                },

                resolve_by_cache_generated_code: function(test) {
                    var actual = container.resolve(TestData.Resolve.ByCache.TestBase1);

                    test.strictEqual(actual.foo(), "Test1 : Test");

                    var actual2 = container.cache['TestBase'];

                    test.ok(actual2);
                    test.strictEqual(actual2.foo(), 'Test');

                    test.done();
                },

                resolve_by_cache: function(test) {

                    var TestBase = function TestBase () {};
                    TestBase.prototype.foo = function() {};

                    var Test = function() {};
                    Test.prototype.foo = function() {
                        return 'Test';
                    };

                    builder.register(TestBase).asType(Test);
                    var container = builder.build();
                    var actual = container.resolveWith(TestBase).cache().exec();

                    test.strictEqual(actual.foo(), "Test");

                    var actual2 = container.cache['TestBase'];
                    test.ok(actual2);
                    test.strictEqual(actual2.foo(), 'Test');

                    test.done();
                },

                decorator_target_error: function(test) {

                    var delegate = function() {
                        Scaffold.createDecorator().provide('Test').register()('Test');
                    };

                    test.throws(delegate, function (err) {

                        test.strictEqual(err.data.target, 'Test');

                        return (err instanceof Scaffold.Exceptions.DecoratorError) &&
                            /Decorator target not supported, not a prototype/.test(err.message);
                    });

                    test.done();
                },

                resolve_full_api_generated : function(test) {

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

                resolve_full_api: function(test) {

                    var TestBase = function() {};

                    var Test = function(arg1, arg2) {
                        this.arg1 = arg1;
                        this.arg2 = arg2;
                    };

                    Test.prototype.foo = function() {
                        return ['Test', this.arg1, this.arg2].join(' ');
                    };

                    builder.register(TestBase)
                        .asType(Test)
                        .named('Some name');

                    var container = builder.build();

                    var actual = container.resolveWith(TestBase)
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

                resolve_with_dependency_generated : function(test) {

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

                resolve_with_dependency : function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var Test = function() {};
                    Test.prototype.foo = function() {
                        return 'Test';
                    };

                    var TestBase1 = function() {};
                    TestBase1.prototype.foo = function() {};

                    var Test1 = function(arg1) {
                        this.arg1 = arg1;
                    };
                    Test1.prototype.foo = function() {
                        return ['Test', this.arg1.foo()].join(' ');
                    };

                    var Dependency = function() {}
                    Dependency.prototype.foo = function() { return 'dependency'; }

                    var dependencies = [{
                        service: TestBase,
                        factoryType: Dependency
                    }];

                    builder.register(TestBase).asType(Test);
                    builder.register(TestBase1).asType(Test1, TestBase);

                    var container = builder.build();
                    var actual = container
                            .resolveWith(TestBase1)
                            .dependencies(dependencies)
                            .exec();

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test dependency');

                    test.done();
                },

                resolve_with_multiple_dependencies_generated : function(test) {

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
                            .resolveWith(TestData.Resolve.FullResolution.TestBase2)
                            .dependencies(dependencies)
                            .exec();

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test dependency dependency 1 dependency 3');

                    test.done();
                },

                resolve_with_multiple_dependencies : function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var TestBase1 = function() {};
                    TestBase1.prototype.foo = function() {};

                    var TestBase2 = function() {};
                    TestBase2.prototype.foo = function() {};

                    var TestBase3 = function() {};
                    TestBase3.prototype.foo = function() {};

                    var Test2 = function(arg1, arg2, arg3) {
                        this.arg1 = arg1;
                        this.arg2 = arg2;
                        this.arg3 = arg3;
                    };
                    Test2.prototype.foo = function() {

                        return ['Test', this.arg1.foo(), this.arg2.foo(), this.arg3.foo()].join(' ');
                    };

                    var Test3 = function(arg1, arg2) {
                        this.arg1 = arg1;
                        this.arg2 = arg2;
                    };
                    Test3.prototype.foo = function() {
                        return ['Test', this.arg1, this.arg2].join(' ');
                    };

                    var Test = function(arg1, arg2) {
                        this.arg1 = arg1;
                        this.arg2 = arg2;
                    };
                    Test.prototype.foo = function() {
                        return ['Test', this.arg1, this.arg2].join(' ');
                    };

                    var Test1 = function(arg1, arg2) {
                        this.arg1 = arg1;
                        this.arg2 = arg2;
                    };
                    Test1.prototype.foo = function() {
                        return ['Test', this.arg1.foo()].join(' ');
                    };

                    var TestDep = function() { };
                    TestDep.prototype.foo = function() { return 'dependency'; };

                    var TestDep1 = function() { };
                    TestDep1.prototype.foo = function() { return 'dependency 1'; };

                    var TestDep3 = function() { };
                    TestDep3.prototype.foo = function() { return 'dependency 3'; };

                    var dependencies = [{
                        service: TestBase,
                        factoryType: TestDep
                        },
                        {
                            service: TestBase1,
                            factoryType: TestDep1
                        },
                        {
                            service: TestBase3,
                            factoryType: TestDep3
                        }];

                    builder.register(TestBase3).asType(Test3).named('Some name');
                    builder.register(TestBase).asType(Test);
                    builder.register(TestBase1).asType(Test1);
                    builder.register(TestBase2).asType(Test2, TestBase, TestBase1, TestBase3);

                    var container = builder.build();
                    var actual = container
                            .resolveWith(TestBase2)
                            .dependencies(dependencies)
                            .exec();

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test dependency dependency 1 dependency 3');

                    test.done();
                },

                resolve_with_multiple_dependencies_with_resolution_value_generated : function(test) {

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
                            .resolveWith(TestData.Resolve.FullResolution.TestBase4)
                            .dependencies(dependencies)
                            .exec();

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test dependency dependency 1 decorator value dependency 3');

                    test.done();
                },

                resolve_with_named_dependencies_generated : function(test) {

                    var dependencies = [{
                        service: TestData.Resolve.DependenciesProperties.TestBase,
                        factoryType: TestData.Resolve.DependenciesProperties.TestDep,
                        named : 'Some test name'
                    }];

                    var actual = container
                            .resolveWith(TestData.Resolve.DependenciesProperties.TestBase1)
                            .dependencies(dependencies)
                            .exec();

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test dependency Some test name');

                    test.done();
                },

                resolve_with_named_dependencies : function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var TestBase1 = function() {};
                    TestBase1.prototype.foo = function() {};

                    var Test = function(arg1, arg2) {
                        this.arg1 = arg1;
                        this.arg2 = arg2;
                    };
                    Test.prototype.foo = function() {
                        return ['Test', this.arg1, this.arg2].join(' ');
                    };

                    var Test1 = function(arg1) {
                        this.arg1 = arg1;
                    };
                    Test1.prototype.foo = function() {
                        return ['Test', this.arg1.foo()].join(' ');
                    };

                    var TestDep = function() { };
                    TestDep.prototype.foo = function() { return 'dependency Some test name'; };

                    var dependencies = [{
                        service: TestBase,
                        factoryType: TestDep,
                        named : 'Some test name'
                    }];

                    builder.register(TestBase).asType(Test).named('Some test name');
                    builder.register(TestBase1).asType(Test1, TestBase);

                    var container = builder.build();
                    var actual = container
                            .resolveWith(TestBase1)
                            .dependencies(dependencies)
                            .exec();

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test dependency Some test name');

                    test.done();
                },

                resolve_with_initialized_dependencies_generated : function(test) {

                    var actual = container
                            .resolveWith('some TestInit')
                            .exec();

                    var actual2 = container
                            .resolveWith('some TestInit')
                            .dependencies({
                                service: TestData.Resolve.DependenciesInit.TestBase,
                                factoryType: TestData.Resolve.DependenciesInit.TestDep,
                                initializer : function(c, item) {
                                    item.foo = function() { return 'Dependency initialized'; }
                                    return item;
                                }
                            })
                            .exec();

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test Initialized');

                    test.strictEqual(actual2.foo(), 'Test Dependency initialized');

                    test.done();
                },

                resolve_with_initialized_dependencies : function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var Test = function() {};
                    Test.prototype.foo = function() {
                        return 'Test';
                    };

                    var TestInit = function(arg1) {
                        this.arg1 = arg1;
                    };
                    TestInit.prototype.foo = function() {
                        return ['Test', this.arg1.foo()].join(' ');
                    };

                    var TestDep = function() {};
                    TestDep.prototype.foo = function() {
                        return 'dependency';
                    };

                    builder.register(TestBase)
                        .asType(Test)
                        .initializeBy(function(c, item) {
                            item.foo = function() {return 'Initialized'; };
                            return item;
                        });

                    builder.register('some TestInit').asType(TestInit, TestBase);

                    var container = builder.build();
                    var actual = container
                        .resolveWith('some TestInit')
                        .exec();

                    var actual2 = container
                        .resolveWith('some TestInit')
                        .dependencies({
                            service: TestBase,
                            factoryType: TestDep,
                            initializer : function(c, item) {
                                item.foo = function() { return 'Dependency initialized'; }
                                return item;
                            }
                        })
                        .exec();

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test Initialized');

                    test.strictEqual(actual2.foo(), 'Test Dependency initialized');

                    test.done();
                },

                resolve_with_required_dependencies_generated : function(test) {

                    var actual = container
                        .resolveWith(TestData.Resolve.DependenciesNonRequired.TestBase)
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

                resolve_with_required_dependencies : function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var TestBase1 = function() {};
                    TestBase1.prototype.foo = function() {};

                    var TestInit = function(arg1) {
                        this.arg1 = arg1;
                    };
                    TestInit.prototype.foo = function() {
                        return ['Test', this.arg1.foo()].join(' ');
                    };

                    var TestDep = function() {};
                    TestDep.prototype.foo = function() {
                        return 'dependency';
                    };

                    builder.register(TestBase).asType(TestInit, TestBase1);

                    var container = builder.build();
                    var actual = container
                        .resolveWith(TestBase)
                        .dependencies({
                            service: TestBase1,
                            factoryType: TestDep,
                            required : false
                        })
                        .exec();

                    test.ok(actual);
                    test.strictEqual(actual.foo(), 'Test dependency');

                    test.done();
                },

                resolve_by_object_string_generated : function(test) {

                    var actual = container
                            .resolve(TestData.Resolve.ObjectResolution.TestBase);

                    test.strictEqual(actual.foo(), 'Test Test1');

                    test.done();
                },

                resolve_by_object_string : function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var Test = function(arg1) {
                        this.arg1 = arg1;
                    };
                    Test.prototype.foo = function() {
                        return ['Test', this.arg1.foo()].join(' ');
                    };

                    var Test1 = function() { };
                    Test1.prototype.foo = function() {
                        return 'Test1';
                    };

                    builder.register('dependency').asType(Test1);
                    builder.register(TestBase).asType(Test, 'dependency');

                    var container = builder.build();
                    var actual = container.resolve(TestBase);

                    test.strictEqual(actual.foo(), 'Test Test1');

                    test.done();
                },

                resolve_by_object_number_generated : function(test) {

                    var actual = container
                            .resolve(TestData.Resolve.NumberResolution.TestBase);

                    test.strictEqual(actual.foo(), 'Test Test1');

                    test.done();
                },

                resolve_by_object_number : function(test) {

                    var TestBase = function() {};
                    TestBase.prototype.foo = function() {};

                    var Test = function(arg1) {
                        this.arg1 = arg1;
                    };
                    Test.prototype.foo = function() {
                        return ['Test', this.arg1.foo()].join(' ');
                    };

                    var Test1 = function() { };
                    Test1.prototype.foo = function() {
                        return 'Test1';
                    };

                    builder.register(123).asType(Test1);
                    builder.register(TestBase).asType(Test, 123);

                    var container = builder.build();
                    var actual = container.resolve(TestBase);

                    test.strictEqual(actual.foo(), 'Test Test1');

                    test.done();
                }
            }
        };
    })()
}