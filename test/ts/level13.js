//'use strict';
var TestData = require('../data/decorators');
var scaffold = require('./../scaffold');
var Level13;
(function (Level13) {
    function embedded_container_resolution(test) {
        var container = scaffold.getDecorator().build();
        var Actual = container.resolve(TestData.Registration.TestBase);
        var actual = new Actual();
        test.ok(actual);
        test.strictEqual(actual.foo(), 'Test : foo');
        test.done();
    }
    Level13.embedded_container_resolution = embedded_container_resolution;
})(Level13 = exports.Level13 || (exports.Level13 = {}));
//# sourceMappingURL=level13.js.map