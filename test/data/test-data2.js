'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
(function (ServiceModule1) {
    var TestBaseClass = (function () {
        function TestBaseClass() {
        }
        TestBaseClass.prototype.name = function () {
            return null;
        };
        return TestBaseClass;
    })();
    ServiceModule1.TestBaseClass = TestBaseClass;
})(exports.ServiceModule1 || (exports.ServiceModule1 = {}));
var ServiceModule1 = exports.ServiceModule1;

(function (ServiceModule2) {
    function TestBaseFunction() {
    }
    ServiceModule2.TestBaseFunction = TestBaseFunction;
})(exports.ServiceModule2 || (exports.ServiceModule2 = {}));
var ServiceModule2 = exports.ServiceModule2;

(function (ServiceModule3) {
    var TestBaseClass1 = (function () {
        function TestBaseClass1() {
        }
        TestBaseClass1.prototype.name = function () {
            return null;
        };
        return TestBaseClass1;
    })();
    ServiceModule3.TestBaseClass1 = TestBaseClass1;

    var TestBaseClass2 = (function () {
        function TestBaseClass2() {
        }
        TestBaseClass2.prototype.age = function () {
            return null;
        };
        return TestBaseClass2;
    })();
    ServiceModule3.TestBaseClass2 = TestBaseClass2;

    var TestBaseClass3 = (function () {
        function TestBaseClass3() {
        }
        TestBaseClass3.prototype.date = function () {
            return null;
        };
        return TestBaseClass3;
    })();
    ServiceModule3.TestBaseClass3 = TestBaseClass3;
})(exports.ServiceModule3 || (exports.ServiceModule3 = {}));
var ServiceModule3 = exports.ServiceModule3;

(function (SubstituteModule1) {
    var ConcreteTestClass = (function (_super) {
        __extends(ConcreteTestClass, _super);
        function ConcreteTestClass() {
            _super.apply(this, arguments);
        }
        ConcreteTestClass.prototype.name = function () {
            return "Concrete class";
        };
        return ConcreteTestClass;
    })(ServiceModule1.TestBaseClass);
    SubstituteModule1.ConcreteTestClass = ConcreteTestClass;
})(exports.SubstituteModule1 || (exports.SubstituteModule1 = {}));
var SubstituteModule1 = exports.SubstituteModule1;

(function (SubstituteModule2) {
    var ConcreteTestClass = (function () {
        function ConcreteTestClass() {
        }
        ConcreteTestClass.prototype.name = function () {
            return "Concrete class";
        };
        return ConcreteTestClass;
    })();
    SubstituteModule2.ConcreteTestClass = ConcreteTestClass;
})(exports.SubstituteModule2 || (exports.SubstituteModule2 = {}));
var SubstituteModule2 = exports.SubstituteModule2;

(function (SubstituteModule3) {
    var ConcreteTestClass = (function () {
        function ConcreteTestClass(age, anotherParam) {
            this.age = age;
            this.anotherParam = anotherParam;
        }
        ConcreteTestClass.prototype.name = function () {
            return "Concrete class" + this.age + this.anotherParam;
        };
        return ConcreteTestClass;
    })();
    SubstituteModule3.ConcreteTestClass = ConcreteTestClass;
})(exports.SubstituteModule3 || (exports.SubstituteModule3 = {}));
var SubstituteModule3 = exports.SubstituteModule3;

(function (SubstituteModule4) {
    var ConcreteTestClass1 = (function () {
        function ConcreteTestClass1() {
        }
        ConcreteTestClass1.prototype.name = function () {
            return "Concrete class1";
        };
        return ConcreteTestClass1;
    })();
    SubstituteModule4.ConcreteTestClass1 = ConcreteTestClass1;

    var ConcreteTestClass2 = (function () {
        function ConcreteTestClass2() {
        }
        ConcreteTestClass2.prototype.name = function () {
            return "Concrete class2";
        };
        return ConcreteTestClass2;
    })();
    SubstituteModule4.ConcreteTestClass2 = ConcreteTestClass2;
})(exports.SubstituteModule4 || (exports.SubstituteModule4 = {}));
var SubstituteModule4 = exports.SubstituteModule4;

(function (SubstituteModule5) {
    var ConcreteClass1 = (function () {
        function ConcreteClass1() {
        }
        ConcreteClass1.prototype.name = function () {
            return "name";
        };
        return ConcreteClass1;
    })();
    SubstituteModule5.ConcreteClass1 = ConcreteClass1;

    var ConcreteClass2 = (function () {
        function ConcreteClass2() {
        }
        ConcreteClass2.prototype.age = function () {
            return "age";
        };
        return ConcreteClass2;
    })();
    SubstituteModule5.ConcreteClass2 = ConcreteClass2;

    var ConcreteClass3 = (function () {
        function ConcreteClass3() {
        }
        ConcreteClass3.prototype.date = function () {
            return "date";
        };
        return ConcreteClass3;
    })();
    SubstituteModule5.ConcreteClass3 = ConcreteClass3;
})(exports.SubstituteModule5 || (exports.SubstituteModule5 = {}));
var SubstituteModule5 = exports.SubstituteModule5;

(function (SubstituteModule6) {
    var ConcreteClass1 = (function () {
        function ConcreteClass1(dependancy) {
            this._dependancy = dependancy;
        }
        ConcreteClass1.prototype.name = function () {
            return "Module6 - Class 1 - " + this._dependancy.name();
        };
        return ConcreteClass1;
    })();
    SubstituteModule6.ConcreteClass1 = ConcreteClass1;
})(exports.SubstituteModule6 || (exports.SubstituteModule6 = {}));
var SubstituteModule6 = exports.SubstituteModule6;
//# sourceMappingURL=test-data2.js.map
