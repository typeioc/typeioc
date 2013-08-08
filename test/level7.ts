import exceptions = require('../lib/exceptions');;
import typeioc = require('../lib/typeioc');;
import MRegistrationModule = require('../lib/registration/moduleRegistration');
import testData = require('test-data');;
import testData2 = require('test-data');;
import testDataSecond = require('test-data2');

export module Level7 {

    export function resolveDifferentInstancesFormDifferentModules(test) {
        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register<testData.TestModule1.Test1>(testData.TestModule1.Test1).
            as((c) => new testData.TestModule1.Test1("test 1"));
        containerBuilder.register<testData.TestModule2.Test1>(testData.TestModule2.Test1).
            as((c) => new testData.TestModule2.Test1("test 2"));

        var container = containerBuilder.build();

        var t1 = container.resolve<testData.TestModule1.Test1>(testData.TestModule1.Test1);
        var t2 = container.resolve<testData.TestModule2.Test1>(testData.TestModule2.Test1);

        test.equal(t1.name, "test 1");
        test.equal(t2.name, "test 2");

        test.done();
    }

    export function resolveDifferentInstancesFormSameModule(test) {
        var containerBuilder = new typeioc.ContainerBuilder();

        containerBuilder.register<testData.TestModule1.Test1>(testData.TestModule1.Test1).
            as((c) => new testData.TestModule1.Test1("test 1")).
            within(typeioc.Constants.Scope.Container);

        containerBuilder.register<testData2.TestModule1.Test1>(testData2.TestModule1.Test1).
            as((c) => new testData2.TestModule1.Test1("test 2")).
            within(typeioc.Constants.Scope.Container);

        var container = containerBuilder.build();

        var t1 = container.resolve<testData.TestModule1.Test1>(testData.TestModule1.Test1);
        var t2 = container.resolve<testData2.TestModule1.Test1>(testData2.TestModule1.Test1);

        test.strictEqual(t1, t2);
        test.equal(t1.name, "test 2");
        test.equal(t1.name, t2.name);

        test.done();
    }

    export function registerModuleBasicInheritance(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule1).
            as(testDataSecond.SubstituteModule1);

        var container = containerBuilder.build();

        var t1 = container.resolve<testDataSecond.ServiceModule1.TestBaseClass>(testDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class");

        test.done();
    }

    export function registerModuleBasicNonInheritance(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule1).
            as(testDataSecond.SubstituteModule2);

        var container = containerBuilder.build();

        var t1 = container.resolve<testDataSecond.ServiceModule1.TestBaseClass>(testDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class");

        test.done();
    }

    export function registerModuleBasicFunctionSubstitute(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule2).
            as(testDataSecond.SubstituteModule2);

        var container = containerBuilder.build();

        var t1 = container.resolve(testDataSecond.ServiceModule2.TestBaseFunction);

        test.equal(t1.name(), "Concrete class");

        test.done();
    }

    export function registerModuleBasicFunctionSubstituteOverridesMatches(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule2).
            as(testDataSecond.SubstituteModule4);

        var container = containerBuilder.build();

        var t1 = container.resolve(testDataSecond.ServiceModule2.TestBaseFunction);

        test.ok(
            (
                (t1 instanceof testDataSecond.SubstituteModule4.ConcreteTestClass2) &&
                !(t1 instanceof testDataSecond.SubstituteModule4.ConcreteTestClass1)
            ) ||
            (
                !(t1 instanceof testDataSecond.SubstituteModule4.ConcreteTestClass2) &&
                 (t1 instanceof testDataSecond.SubstituteModule4.ConcreteTestClass1)
            )
        );

        test.done();
    }

    export function registerModuleConstructorWithParamsError(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule1).
            as(testDataSecond.SubstituteModule3);

        var container = containerBuilder.build();

        var delegate = () => container.resolve<testDataSecond.ServiceModule1.TestBaseClass>(testDataSecond.ServiceModule1.TestBaseClass, 77);

        test.throws(delegate, function(err) {
            return (err instanceof exceptions.ResolutionError) &&
                /Could not resolve service/.test(err.message);
        });

        test.done();
    }

    export function registerModuleConstructorWithParams(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule1).
            as(testDataSecond.SubstituteModule3).
            forArgs(testDataSecond.SubstituteModule3.ConcreteTestClass, 77, "Test");

        var container = containerBuilder.build();

        var t1 = container.resolve(testDataSecond.ServiceModule1.TestBaseClass);

        test.equal(t1.name(), "Concrete class77Test");

        test.done();
    }


    export function registerModuleConstructorWithDependencies(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule1).
            as(testDataSecond.SubstituteModule3).
            forArgs(testDataSecond.SubstituteModule3.ConcreteTestClass, 77, "Test");

        containerBuilder.registerModule(testDataSecond.ServiceModule3).
            as(testDataSecond.SubstituteModule6).
            for(testDataSecond.SubstituteModule6.ConcreteClass1,
                (c) => {

                    var dependency = c.resolve(testDataSecond.ServiceModule1.TestBaseClass);
                    return new testDataSecond.SubstituteModule6.ConcreteClass1(dependency);
                });

        var container = containerBuilder.build();

        var t1 = container.resolve(testDataSecond.ServiceModule3.TestBaseClass1);

        test.equal(t1.name(), "Module6 - Class 1 - Concrete class77Test");

        test.done();
    }

    export function registerModuleMultipleSubstitutions(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule3).
            as(testDataSecond.SubstituteModule5);

        var container = containerBuilder.build();

        var t1 = container.resolve(testDataSecond.ServiceModule3.TestBaseClass1);
        var t2 = container.resolve(testDataSecond.ServiceModule3.TestBaseClass2);
        var t3 = container.resolve(testDataSecond.ServiceModule3.TestBaseClass3);

        test.ok(t1 instanceof testDataSecond.SubstituteModule5.ConcreteClass1);
        test.equal(t1.name(), "name");
        test.ok(t2 instanceof testDataSecond.SubstituteModule5.ConcreteClass2);
        test.equal(t2.age(), "age");
        test.ok(t3 instanceof testDataSecond.SubstituteModule5.ConcreteClass3);
        test.equal(t3.date(), "date");

        test.done();
    }

    export function registerModuleMultipleSubstitutionsWithParams(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule3).
            as(testDataSecond.SubstituteModule5).
            forArgs(testDataSecond.SubstituteModule5.ConcreteClass1).
            forArgs(testDataSecond.SubstituteModule5.ConcreteClass2).
            forArgs(testDataSecond.SubstituteModule5.ConcreteClass3);

        var container = containerBuilder.build();

        var t1 = container.resolve(testDataSecond.ServiceModule3.TestBaseClass1);
        var t2 = container.resolve(testDataSecond.ServiceModule3.TestBaseClass2);
        var t3 = container.resolve(testDataSecond.ServiceModule3.TestBaseClass3);

        test.ok(t1 instanceof testDataSecond.SubstituteModule5.ConcreteClass1);
        test.equal(t1.name(), "name");
        test.ok(t2 instanceof testDataSecond.SubstituteModule5.ConcreteClass2);
        test.equal(t2.age(), "age");
        test.ok(t3 instanceof testDataSecond.SubstituteModule5.ConcreteClass3);
        test.equal(t3.date(), "date");

        test.done();
    }

    export function registerModuleMultipleSubstitutionsNamedResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule2).
            as(testDataSecond.SubstituteModule4).
            named(testDataSecond.SubstituteModule4.ConcreteTestClass1, "name1").
            named(testDataSecond.SubstituteModule4.ConcreteTestClass2, "name2");

        var container = containerBuilder.build();

        var t1 = container.resolveNamed(testDataSecond.ServiceModule2.TestBaseFunction, "name1");
        var t2 = container.resolveNamed(testDataSecond.ServiceModule2.TestBaseFunction, "name2");

        test.equal(t1.name(), "Concrete class1");
        test.equal(t2.name(), "Concrete class2");

        test.done();
    }

    export function registerModuleConstructorWithDependenciesNamedResolution(test) {

        var containerBuilder = new typeioc.ContainerBuilder();
        containerBuilder.registerModule(testDataSecond.ServiceModule1).
            as(testDataSecond.SubstituteModule3).
            forArgs(testDataSecond.SubstituteModule3.ConcreteTestClass, 77, "Test");

        containerBuilder.registerModule(testDataSecond.ServiceModule3).
            as(testDataSecond.SubstituteModule6).
            named(testDataSecond.SubstituteModule6.ConcreteClass1, "name1").
            for(testDataSecond.SubstituteModule6.ConcreteClass1,
            (c) => {

                var dependency = c.resolve(testDataSecond.ServiceModule1.TestBaseClass);
                return new testDataSecond.SubstituteModule6.ConcreteClass1(dependency);
            });

        var container = containerBuilder.build();

        var t1 = container.resolveNamed(testDataSecond.ServiceModule3.TestBaseClass1, "name1");

        test.equal(t1.name(), "Module6 - Class 1 - Concrete class77Test");

        test.done();
    }

}
