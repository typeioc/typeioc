'use strict';
var scaffold = require('./../scaffold');
var TestData = require('../data/test-data');
var TestData2 = require('../data/test-data');
var TestDataSecond = require('../data/test-data2');
var Level7;
(function (Level7) {
    var containerBuilder;
    function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }
    Level7.setUp = setUp;
    function resolveDifferentInstancesFormDifferentModules(test) {
        containerBuilder.register(TestData.TestModule1.Test1).as(function (c) { return new TestData.TestModule1.Test1("test 1"); });
        containerBuilder.register(TestData.TestModule2.Test1).as(function (c) { return new TestData.TestModule2.Test1("test 2"); });
        var container = containerBuilder.build();
        var t1 = container.resolve(TestData.TestModule1.Test1);
        var t2 = container.resolve(TestData.TestModule2.Test1);
        test.equal(t1.name, "test 1");
        test.equal(t2.name, "test 2");
        test.done();
    }
    Level7.resolveDifferentInstancesFormDifferentModules = resolveDifferentInstancesFormDifferentModules;
    function resolveDifferentInstancesFormSameModule(test) {
        containerBuilder.register(TestData.TestModule1.Test1).as(function (c) { return new TestData.TestModule1.Test1("test 1"); }).within(2 /* Container */);
        containerBuilder.register(TestData2.TestModule1.Test1).as(function (c) { return new TestData2.TestModule1.Test1("test 2"); }).within(2 /* Container */);
        var container = containerBuilder.build();
        var t1 = container.resolve(TestData.TestModule1.Test1);
        var t2 = container.resolve(TestData2.TestModule1.Test1);
        test.strictEqual(t1, t2);
        test.equal(t1.name, "test 2");
        test.equal(t1.name, t2.name);
        test.done();
    }
    Level7.resolveDifferentInstancesFormSameModule = resolveDifferentInstancesFormSameModule;
    function registerModuleBasicInheritance(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule1).as(TestDataSecond.SubstituteModule1);
        var container = containerBuilder.build();
        var t1 = container.resolve(TestDataSecond.ServiceModule1.TestBaseClass);
        test.equal(t1.name(), "Concrete class");
        test.done();
    }
    Level7.registerModuleBasicInheritance = registerModuleBasicInheritance;
    function registerModuleBasicNonInheritance(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule1).as(TestDataSecond.SubstituteModule2);
        var container = containerBuilder.build();
        var t1 = container.resolve(TestDataSecond.ServiceModule1.TestBaseClass);
        test.equal(t1.name(), "Concrete class");
        test.done();
    }
    Level7.registerModuleBasicNonInheritance = registerModuleBasicNonInheritance;
    function registerModuleBasicFunctionSubstitute(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule2).as(TestDataSecond.SubstituteModule2);
        var container = containerBuilder.build();
        var t1 = container.resolve(TestDataSecond.ServiceModule2.TestBaseFunction);
        test.equal(t1.name(), "Concrete class");
        test.done();
    }
    Level7.registerModuleBasicFunctionSubstitute = registerModuleBasicFunctionSubstitute;
    function registerModuleBasicFunctionSubstituteOverridesMatches(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule2).as(TestDataSecond.SubstituteModule4);
        var container = containerBuilder.build();
        var t1 = container.resolve(TestDataSecond.ServiceModule2.TestBaseFunction);
        test.ok(((t1 instanceof TestDataSecond.SubstituteModule4.ConcreteTestClass2) && !(t1 instanceof TestDataSecond.SubstituteModule4.ConcreteTestClass1)) || (!(t1 instanceof TestDataSecond.SubstituteModule4.ConcreteTestClass2) && (t1 instanceof TestDataSecond.SubstituteModule4.ConcreteTestClass1)));
        test.done();
    }
    Level7.registerModuleBasicFunctionSubstituteOverridesMatches = registerModuleBasicFunctionSubstituteOverridesMatches;
    function registerModuleConstructorWithParamsError(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule1).as(TestDataSecond.SubstituteModule3);
        var container = containerBuilder.build();
        var delegate = function () { return container.resolve(TestDataSecond.ServiceModule1.TestBaseClass, 77); };
        test.throws(delegate, function (err) {
            return (err instanceof scaffold.Exceptions.ResolutionError) && /Could not resolve service/.test(err.message);
        });
        test.done();
    }
    Level7.registerModuleConstructorWithParamsError = registerModuleConstructorWithParamsError;
    function registerModuleConstructorWithParams(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule1).as(TestDataSecond.SubstituteModule3).forArgs(TestDataSecond.SubstituteModule3.ConcreteTestClass, 77, "Test");
        var container = containerBuilder.build();
        var t1 = container.resolve(TestDataSecond.ServiceModule1.TestBaseClass);
        test.equal(t1.name(), "Concrete class77Test");
        test.done();
    }
    Level7.registerModuleConstructorWithParams = registerModuleConstructorWithParams;
    function registerModuleConstructorWithDependencies(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule1).as(TestDataSecond.SubstituteModule3).forArgs(TestDataSecond.SubstituteModule3.ConcreteTestClass, 77, "Test");
        containerBuilder.registerModule(TestDataSecond.ServiceModule3).as(TestDataSecond.SubstituteModule6).for(TestDataSecond.SubstituteModule6.ConcreteClass1, function (c) {
            var dependency = c.resolve(TestDataSecond.ServiceModule1.TestBaseClass);
            return new TestDataSecond.SubstituteModule6.ConcreteClass1(dependency);
        });
        var container = containerBuilder.build();
        var t1 = container.resolve(TestDataSecond.ServiceModule3.TestBaseClass1);
        test.equal(t1.name(), "Module6 - Class 1 - Concrete class77Test");
        test.done();
    }
    Level7.registerModuleConstructorWithDependencies = registerModuleConstructorWithDependencies;
    function registerModuleMultipleSubstitutions(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule3).as(TestDataSecond.SubstituteModule5);
        var container = containerBuilder.build();
        var t1 = container.resolve(TestDataSecond.ServiceModule3.TestBaseClass1);
        var t2 = container.resolve(TestDataSecond.ServiceModule3.TestBaseClass2);
        var t3 = container.resolve(TestDataSecond.ServiceModule3.TestBaseClass3);
        test.ok(t1 instanceof TestDataSecond.SubstituteModule5.ConcreteClass1);
        test.equal(t1.name(), "name");
        test.ok(t2 instanceof TestDataSecond.SubstituteModule5.ConcreteClass2);
        test.equal(t2.age(), "age");
        test.ok(t3 instanceof TestDataSecond.SubstituteModule5.ConcreteClass3);
        test.equal(t3.date(), "date");
        test.done();
    }
    Level7.registerModuleMultipleSubstitutions = registerModuleMultipleSubstitutions;
    function registerModuleMultipleSubstitutionsWithParams(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule3).as(TestDataSecond.SubstituteModule5).forArgs(TestDataSecond.SubstituteModule5.ConcreteClass1).forArgs(TestDataSecond.SubstituteModule5.ConcreteClass2).forArgs(TestDataSecond.SubstituteModule5.ConcreteClass3);
        var container = containerBuilder.build();
        var t1 = container.resolve(TestDataSecond.ServiceModule3.TestBaseClass1);
        var t2 = container.resolve(TestDataSecond.ServiceModule3.TestBaseClass2);
        var t3 = container.resolve(TestDataSecond.ServiceModule3.TestBaseClass3);
        test.ok(t1 instanceof TestDataSecond.SubstituteModule5.ConcreteClass1);
        test.equal(t1.name(), "name");
        test.ok(t2 instanceof TestDataSecond.SubstituteModule5.ConcreteClass2);
        test.equal(t2.age(), "age");
        test.ok(t3 instanceof TestDataSecond.SubstituteModule5.ConcreteClass3);
        test.equal(t3.date(), "date");
        test.done();
    }
    Level7.registerModuleMultipleSubstitutionsWithParams = registerModuleMultipleSubstitutionsWithParams;
    function registerModuleMultipleSubstitutionsNamedResolution(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule2).as(TestDataSecond.SubstituteModule4).named(TestDataSecond.SubstituteModule4.ConcreteTestClass1, "name1").named(TestDataSecond.SubstituteModule4.ConcreteTestClass2, "name2");
        var container = containerBuilder.build();
        var t1 = container.resolveNamed(TestDataSecond.ServiceModule2.TestBaseFunction, "name1");
        var t2 = container.resolveNamed(TestDataSecond.ServiceModule2.TestBaseFunction, "name2");
        test.equal(t1.name(), "Concrete class1");
        test.equal(t2.name(), "Concrete class2");
        test.done();
    }
    Level7.registerModuleMultipleSubstitutionsNamedResolution = registerModuleMultipleSubstitutionsNamedResolution;
    function registerModuleConstructorWithDependenciesNamedResolution(test) {
        containerBuilder.registerModule(TestDataSecond.ServiceModule1).as(TestDataSecond.SubstituteModule3).forArgs(TestDataSecond.SubstituteModule3.ConcreteTestClass, 77, "Test");
        containerBuilder.registerModule(TestDataSecond.ServiceModule3).as(TestDataSecond.SubstituteModule6).named(TestDataSecond.SubstituteModule6.ConcreteClass1, "name1").for(TestDataSecond.SubstituteModule6.ConcreteClass1, function (c) {
            var dependency = c.resolve(TestDataSecond.ServiceModule1.TestBaseClass);
            return new TestDataSecond.SubstituteModule6.ConcreteClass1(dependency);
        });
        var container = containerBuilder.build();
        var t1 = container.resolveNamed(TestDataSecond.ServiceModule3.TestBaseClass1, "name1");
        test.equal(t1.name(), "Module6 - Class 1 - Concrete class77Test");
        test.done();
    }
    Level7.registerModuleConstructorWithDependenciesNamedResolution = registerModuleConstructorWithDependenciesNamedResolution;
})(Level7 = exports.Level7 || (exports.Level7 = {}));
//# sourceMappingURL=level7.js.map