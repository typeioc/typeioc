/// <reference path='../../d.ts/typeioc.d.ts' />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var scaffold = require('./../scaffold');
var decorator = scaffold.getDecorator();
var Registration;
(function (Registration) {
    var TestBase = (function () {
        function TestBase() {
        }
        TestBase.prototype.foo = function () {
        };
        return TestBase;
    })();
    Registration.TestBase = TestBase;
    var TestBase1 = (function () {
        function TestBase1() {
        }
        TestBase1.prototype.foo1 = function () {
        };
        return TestBase1;
    })();
    Registration.TestBase1 = TestBase1;
    var TestBase2 = (function () {
        function TestBase2() {
        }
        TestBase2.prototype.foo2 = function () {
        };
        return TestBase2;
    })();
    Registration.TestBase2 = TestBase2;
    var Test = (function (_super) {
        __extends(Test, _super);
        function Test() {
            _super.apply(this, arguments);
        }
        Test.prototype.foo = function () {
            return 'Test : foo';
        };
        Test = __decorate([
            decorator.provide(Registration.TestBase).register(), 
            __metadata('design:paramtypes', [])
        ], Test);
        return Test;
    })(TestBase);
    Registration.Test = Test;
    var Test1 = (function () {
        function Test1(TestBase) {
            this.TestBase = TestBase;
        }
        Test1.prototype.foo1 = function () {
            return this.TestBase.foo() + ' : foo1';
        };
        Test1 = __decorate([
            decorator.provide(Registration.TestBase1).register(), 
            __metadata('design:paramtypes', [TestBase])
        ], Test1);
        return Test1;
    })();
    Registration.Test1 = Test1;
    var Test2 = (function () {
        function Test2(testBase, testBase1) {
            this.testBase = testBase;
            this.testBase1 = testBase1;
        }
        Test2.prototype.foo2 = function () {
            return [this.testBase.foo(), this.testBase1.foo1(), 'foo2'].join(' | ');
        };
        Test2 = __decorate([
            decorator.provide(Registration.TestBase2).register(), 
            __metadata('design:paramtypes', [TestBase, TestBase1])
        ], Test2);
        return Test2;
    })();
    Registration.Test2 = Test2;
})(Registration = exports.Registration || (exports.Registration = {}));
//export module InitializeBy {
//
//    export class TestBase {
//        public foo() {
//        }
//    }
//
//    @decorator.register<InitializeBy.TestBase>(InitializeBy.TestBase, { initializeBy : (_, item : Test2) => item.text = ' test' })
//    export class Test2 extends TestBase {
//
//        public text : string = null;
//
//        public foo() {
//            return 'Test : foo' + (this.text || '');
//        }
//    }
//}
//
//export module Scope {
//
//    export class TestBase {
//        public foo() {
//        }
//    }
//
//    @decorator.register<Scope.TestBase>(Scope.TestBase, { within : Typeioc.Types.Scope.Hierarchy })
//    export class Test extends TestBase {
//
//        public text : string = ' test';
//
//        public foo() {
//            return 'Test : foo' + (this.text || '');
//        }
//    }
//
//    export class TestBase2 {
//
//        public foo() {
//        }
//    }
//
//    @decorator.register<Scope.TestBase2>(Scope.TestBase2, { within : Typeioc.Types.Scope.Container })
//    export class Test2 extends TestBase2 {
//
//        public text : string = ' test';
//
//        public foo() {
//            return 'Test : foo' + (this.text || '');
//        }
//    }
//}
//
//export module Owner {
//    export class TestBase1 {
//        public foo() {
//        }
//
//        public dispose() {}
//    }
//
//    @decorator.register<TestBase1>(TestBase1, {
//        ownedBy: Typeioc.Types.Owner.Container,
//        dispose: ((item:Test) => { item.dispose(); })
//    })
//    export class Test extends TestBase1 {
//
//        public text : string = ' test';
//
//        public foo() {
//            return 'Test : foo' + (this.text || '');
//        }
//
//        public dispose() {
//            this.text = 'disposed';
//        }
//    }
//
//
//    export class TestBase2 {
//        public foo() {
//        }
//
//        public dispose() {}
//    }
//
//    @decorator.register<TestBase2>(TestBase2, {
//        ownedBy : Typeioc.Types.Owner.Externals,
//        dispose : ((item: TestBase2) => { item.dispose(); })
//    })
//    export class Test2 extends TestBase2 {
//
//        public text : string = ' test';
//
//        public foo() {
//            return 'Test : foo' + (this.text || '');
//        }
//
//        public dispose() {
//            this.text = 'disposed';
//        }
//    }
//}
//
//export module Named {
//
//    export class TestBase {
//        public foo() {
//        }
//    }
//
//    @decorator.register<Named.TestBase>(Named.TestBase, { named : 'Some name' })
//    export class Test extends TestBase {
//
//        public static text : string = ' test';
//
//        public foo() {
//            return 'Test : foo' + (Test.text || '');
//        }
//    }
//
//    @decorator.register<Named.TestBase>(Named.TestBase, { named : 'Some name 2' })
//    export class Test2 extends TestBase {
//
//        public static text : string = ' test';
//
//        public foo() {
//            return 'Test2 : foo' + (Test2.text || '');
//        }
//    }
//} 
//# sourceMappingURL=decorators.js.map