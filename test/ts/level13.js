//'use strict';
var TestData = require('../data/decorators');
var scaffold = require('./../scaffold');
var Level13;
(function (Level13) {
    function embedded_container_plain_instantiation(test) {
        var container = scaffold.getDecorator().build();
        var actual = container.resolve(TestData.Registration.TestBase);
        test.ok(actual);
        test.strictEqual(actual.foo(), 'Test : foo');
        test.done();
    }
    Level13.embedded_container_plain_instantiation = embedded_container_plain_instantiation;
    function embedded_container_instantiation_with_parameter_resolution(test) {
        var container = scaffold.getDecorator().build();
        var actual = container.resolve(TestData.Registration.TestBase1);
        test.ok(actual);
        test.strictEqual(actual.foo1(), 'Test : foo : foo1');
        test.done();
    }
    Level13.embedded_container_instantiation_with_parameter_resolution = embedded_container_instantiation_with_parameter_resolution;
    function embedded_container_instantiation_with_multi_parameter_resolution(test) {
        var container = scaffold.getDecorator().build();
        var actual = container.resolve(TestData.Registration.TestBase2);
        test.ok(actual);
        test.strictEqual(actual.foo2(), 'Test : foo | Test : foo : foo1 | foo2');
        test.done();
    }
    Level13.embedded_container_instantiation_with_multi_parameter_resolution = embedded_container_instantiation_with_multi_parameter_resolution;
})(Level13 = exports.Level13 || (exports.Level13 = {}));
//# sourceMappingURL=level13.js.map