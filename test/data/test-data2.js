/* istanbul ignore next */
'use strict';
var ServiceModule1;
(function (ServiceModule1) {
    ServiceModule1.testValue = 999;
    class TestBaseClass {
        name() {
            return null;
        }
    }
    ServiceModule1.TestBaseClass = TestBaseClass;
})(ServiceModule1 = exports.ServiceModule1 || (exports.ServiceModule1 = {}));
var ServiceModule2;
(function (ServiceModule2) {
    ServiceModule2.testValue = 999;
    function TestBaseFunction() {
    }
    ServiceModule2.TestBaseFunction = TestBaseFunction;
})(ServiceModule2 = exports.ServiceModule2 || (exports.ServiceModule2 = {}));
var ServiceModule3;
(function (ServiceModule3) {
    ServiceModule3.testValue = 999;
    class TestBaseClass1 {
        name() {
            return null;
        }
    }
    ServiceModule3.TestBaseClass1 = TestBaseClass1;
    class TestBaseClass2 {
        age() {
            return null;
        }
    }
    ServiceModule3.TestBaseClass2 = TestBaseClass2;
    class TestBaseClass3 {
        date() {
            return null;
        }
    }
    ServiceModule3.TestBaseClass3 = TestBaseClass3;
})(ServiceModule3 = exports.ServiceModule3 || (exports.ServiceModule3 = {}));
var SubstituteModule1;
(function (SubstituteModule1) {
    SubstituteModule1.testValue2 = 999;
    class ConcreteTestClass extends ServiceModule1.TestBaseClass {
        name() {
            return 'Concrete class';
        }
    }
    SubstituteModule1.ConcreteTestClass = ConcreteTestClass;
})(SubstituteModule1 = exports.SubstituteModule1 || (exports.SubstituteModule1 = {}));
var SubstituteModule2;
(function (SubstituteModule2) {
    class ConcreteTestClass {
        name() {
            return 'Concrete class';
        }
    }
    SubstituteModule2.ConcreteTestClass = ConcreteTestClass;
})(SubstituteModule2 = exports.SubstituteModule2 || (exports.SubstituteModule2 = {}));
var SubstituteModule3;
(function (SubstituteModule3) {
    class ConcreteTestClass {
        constructor(age, anotherParam) {
            this.age = age;
            this.anotherParam = anotherParam;
        }
        name() {
            return 'Concrete class' + this.age + this.anotherParam;
        }
    }
    SubstituteModule3.ConcreteTestClass = ConcreteTestClass;
})(SubstituteModule3 = exports.SubstituteModule3 || (exports.SubstituteModule3 = {}));
var SubstituteModule4;
(function (SubstituteModule4) {
    class ConcreteTestClass1 {
        name() {
            return 'Concrete class1';
        }
    }
    SubstituteModule4.ConcreteTestClass1 = ConcreteTestClass1;
    class ConcreteTestClass2 {
        name() {
            return 'Concrete class2';
        }
    }
    SubstituteModule4.ConcreteTestClass2 = ConcreteTestClass2;
})(SubstituteModule4 = exports.SubstituteModule4 || (exports.SubstituteModule4 = {}));
var SubstituteModule5;
(function (SubstituteModule5) {
    class ConcreteClass1 {
        name() {
            return 'name';
        }
    }
    SubstituteModule5.ConcreteClass1 = ConcreteClass1;
    class ConcreteClass2 {
        age() {
            return 'age';
        }
    }
    SubstituteModule5.ConcreteClass2 = ConcreteClass2;
    class ConcreteClass3 {
        date() {
            return 'date';
        }
    }
    SubstituteModule5.ConcreteClass3 = ConcreteClass3;
})(SubstituteModule5 = exports.SubstituteModule5 || (exports.SubstituteModule5 = {}));
var SubstituteModule6;
(function (SubstituteModule6) {
    class ConcreteClass1 {
        constructor(dependancy) {
            this._dependancy = dependancy;
        }
        name() {
            return 'Module6 - Class 1 - ' + this._dependancy.name();
        }
    }
    SubstituteModule6.ConcreteClass1 = ConcreteClass1;
})(SubstituteModule6 = exports.SubstituteModule6 || (exports.SubstituteModule6 = {}));
//# sourceMappingURL=test-data2.js.map