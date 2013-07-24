var typeioc = require('../lib/typeioc');
;
var testData = require("./test-data");
;
var exceptions = require('../lib/exceptions');
;

(function (Level1) {
    function containerConstruction(test) {
        var containerBuilder = new typeioc.ContainerBuilder();
        var container = containerBuilder.build();

        test.notEqual(container, null);

        test.done();
    }
    Level1.containerConstruction = containerConstruction;
    ;

    function parameterlessResolution(test) {
        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test1();
        });

        var container = containerBuilder.build();
        var actual = container.resolve(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "test 1");

        test.done();
    }
    Level1.parameterlessResolution = parameterlessResolution;
    ;

    function multipleParameterlessResolutions(test) {
        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test1();
        });
        containerBuilder.register(testData.Test2Base).as(function () {
            return new testData.Test2();
        });

        var container = containerBuilder.build();
        var actual1 = container.resolve(testData.Test1Base);
        var actual2 = container.resolve(testData.Test2Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 2");

        test.done();
    }
    Level1.multipleParameterlessResolutions = multipleParameterlessResolutions;
    ;

    function overridingResolutions(test) {
        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test1();
        });
        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test1();
        });

        var container = containerBuilder.build();
        var actual1 = container.resolve(testData.Test1Base);
        var actual2 = container.resolve(testData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 1");

        test.done();
    }
    Level1.overridingResolutions = overridingResolutions;
    ;

    function overridingParameterContainerResolutions(test) {
        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test1();
        });
        containerBuilder.register(testData.Test1Base).as(function (c) {
            return new testData.Test1();
        });

        var container = containerBuilder.build();
        var actual1 = container.resolve(testData.Test1Base);
        var actual2 = container.resolve(testData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");
        test.notEqual(actual2, null);
        test.strictEqual(actual2.Name, "test 1");

        test.done();
    }
    Level1.overridingParameterContainerResolutions = overridingParameterContainerResolutions;
    ;

    function parameterContainerResolution(test) {
        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register(testData.Test1Base).as(function (c) {
            return new testData.Test1();
        });

        var container = containerBuilder.build();
        var actual1 = container.resolve(testData.Test1Base);

        test.notEqual(actual1, null);
        test.strictEqual(actual1.Name, "test 1");

        test.done();
    }
    Level1.parameterContainerResolution = parameterContainerResolution;
    ;

    function errorNoExistingResolution(test) {
        var containerBuilder = new typeioc.ContainerBuilder();
        var container = containerBuilder.build();

        var delegate = function () {
            return container.resolve(testData.Test1Base);
        };

        test.throws(delegate, function (err) {
            return (err instanceof exceptions.ResolutionError) && /Could not resolve service/.test(err.message);
        });

        test.done();
    }
    Level1.errorNoExistingResolution = errorNoExistingResolution;
    ;

    function attemptResolution(test) {
        var containerBuilder = new typeioc.ContainerBuilder();
        var container = containerBuilder.build();

        var actual = container.tryResolve(testData.Test1Base);

        test.equal(null, actual);

        test.done();
    }
    Level1.attemptResolution = attemptResolution;
    ;

    function attemptNamedResolution(test) {
        var containerBuilder = new typeioc.ContainerBuilder();
        var container = containerBuilder.build();

        var actual = container.tryResolveNamed(testData.Test1Base, "Test Name");

        test.equal(null, actual);

        test.done();
    }
    Level1.attemptNamedResolution = attemptNamedResolution;
    ;

    function attemptNamedExistingResolution(test) {
        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register(testData.Test1Base).as(function () {
            return new testData.Test1();
        });
        var container = containerBuilder.build();

        var actual = container.tryResolveNamed(testData.Test1Base, "Test Name");

        test.equal(null, actual);

        test.done();
    }
    Level1.attemptNamedExistingResolution = attemptNamedExistingResolution;
    ;

    function dependenciesResolution(test) {
        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.register(testData.Test2Base).as(function () {
            return new testData.Test2();
        });
        containerBuilder.register(testData.Test1Base).as(function (c) {
            var test2 = c.resolve(testData.Test2Base);

            return new testData.Test3(test2);
        });

        var container = containerBuilder.build();
        var actual = container.resolve(testData.Test1Base);

        test.notEqual(actual, null);
        test.strictEqual(actual.Name, "Test 3 test 2");

        test.done();
    }
    Level1.dependenciesResolution = dependenciesResolution;
    ;
})(exports.Level1 || (exports.Level1 = {}));
var Level1 = exports.Level1;

//@ sourceMappingURL=level1.js.map
