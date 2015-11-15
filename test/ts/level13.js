//'use strict';
var TestData = require('../data/decorators');
var scaffold = require('./../scaffold');
var Level13;
(function (Level13) {
    var container;
    Level13.embedded_container = {
        setUp: function (callback) {
            container = scaffold.getDecorator().build();
            callback();
        },
        plain_instantiation: function (test) {
            var actual = container.resolve(TestData.Registration.TestBase);
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test : foo');
            test.done();
        },
        instantiation_with_parameter_resolution: function (test) {
            var actual = container.resolve(TestData.Registration.TestBase1);
            test.ok(actual);
            test.strictEqual(actual.foo1(), 'Test : foo : foo1');
            test.done();
        },
        instantiation_with_multi_parameter_resolution: function (test) {
            var actual = container.resolve(TestData.Registration.TestBase2);
            test.ok(actual);
            test.strictEqual(actual.foo2(), 'Test : foo | Test : foo : foo1 | foo2');
            test.done();
        },
        initializeBy_usage: function (test) {
            var actual = container.resolve(TestData.InitializeBy.TestBase);
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test : foo foo 2');
            actual = container.resolve(TestData.InitializeBy.TestBase1);
            test.ok(actual);
            test.strictEqual(actual.foo(), 'Test : foo foo 3');
            test.done();
        },
        scope_none_can_resolve: function (test) {
            var actual = container.resolve(TestData.Scope.TestBase);
            test.strictEqual(actual.foo(), 'Test : foo test none');
            test.done();
        },
        scope_container_can_resolve_clone: function (test) {
            var actual = container.resolve(TestData.Scope.TestBase2);
            test.strictEqual(actual.foo(), 'Test : foo test Container');
            var child = container.createChild();
            var actual2 = child.resolve(TestData.Scope.TestBase2);
            test.strictEqual(actual2.foo(), 'Test : foo test Container');
            test.notStrictEqual(actual, actual2);
            test.done();
        }
    };
})(Level13 = exports.Level13 || (exports.Level13 = {}));
//# sourceMappingURL=level13.js.map