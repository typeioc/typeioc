//'use strict';
var TestData = require('../data/decorators');
var scaffold = require('./../scaffold');
var Level13;
(function (Level13) {
    function embedded_container_resolution(test) {
        var container = scaffold.Decorators.container();
        var Actual = container.resolve(TestData.Registration.TestBase);
        var actual = new Actual();
        test.ok(actual);
        test.strictEqual(actual.foo(), 'Test : foo');
        test.done();
    }
    Level13.embedded_container_resolution = embedded_container_resolution;
    function embedded_container_resolution_initializeBy(test) {
        var container = scaffold.Decorators.container();
        var Actual = container.resolve(TestData.InitializeBy.TestBase);
        var actual = new Actual();
        test.ok(actual);
        test.strictEqual(actual.foo(), 'Test : foo test');
        test.done();
    }
    Level13.embedded_container_resolution_initializeBy = embedded_container_resolution_initializeBy;
    function embedded_container_resolution_scope_hierarchy(test) {
        var container = scaffold.Decorators.container();
        var Actual = container.resolve(TestData.Scope.TestBase);
        var actual = new Actual();
        test.ok(actual);
        test.strictEqual(actual.foo(), 'Test : foo test');
        var child = container.createChild();
        Actual = child.resolve(TestData.Scope.TestBase);
        actual = new Actual();
        test.ok(actual);
        test.strictEqual(actual.foo(), 'Test : foo test');
        test.done();
    }
    Level13.embedded_container_resolution_scope_hierarchy = embedded_container_resolution_scope_hierarchy;
    function embedded_container_resolution_scope_container(test) {
        var container = scaffold.Decorators.container();
        var Actual = container.resolve(TestData.Scope.TestBase);
        var actual = new Actual();
        test.ok(actual);
        test.strictEqual(actual.foo(), 'Test : foo test');
        Actual.text = 'some text';
        var Actual2 = container.resolve(TestData.Scope.TestBase);
        test.strictEqual(Actual2.text, Actual.text);
        test.strictEqual(Actual2.text, 'some text');
        test.done();
    }
    Level13.embedded_container_resolution_scope_container = embedded_container_resolution_scope_container;
    function embedded_container_resolution_named(test) {
        var container = scaffold.Decorators.container();
        var Actual = container.resolveNamed(TestData.Named.TestBase, 'Some name');
        var actual = new Actual();
        test.ok(actual);
        test.strictEqual(actual.foo(), 'Test : foo test');
        Actual = container.resolveNamed(TestData.Named.TestBase, 'Some name 2');
        actual = new Actual();
        test.ok(actual);
        test.strictEqual(actual.foo(), 'Test2 : foo test');
        test.done();
    }
    Level13.embedded_container_resolution_named = embedded_container_resolution_named;
})(Level13 = exports.Level13 || (exports.Level13 = {}));
//# sourceMappingURL=level13.js.map