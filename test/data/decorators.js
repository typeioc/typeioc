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
var InitializeBy;
(function (InitializeBy) {
    var TestBase = (function () {
        function TestBase() {
        }
        TestBase.prototype.foo = function () {
        };
        return TestBase;
    })();
    InitializeBy.TestBase = TestBase;
    var TestBase1 = (function () {
        function TestBase1() {
        }
        TestBase1.prototype.foo = function () {
        };
        return TestBase1;
    })();
    InitializeBy.TestBase1 = TestBase1;
    var Test2 = (function (_super) {
        __extends(Test2, _super);
        function Test2() {
            _super.apply(this, arguments);
            this.text = null;
        }
        Test2.prototype.foo = function () {
            return 'Test : foo ' + this.text;
        };
        Test2 = __decorate([
            decorator.provide(InitializeBy.TestBase)
                .initializeBy(function (c, item) { item.text = 'foo 2'; })
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test2);
        return Test2;
    })(TestBase);
    InitializeBy.Test2 = Test2;
    var Test3 = (function (_super) {
        __extends(Test3, _super);
        function Test3() {
            _super.apply(this, arguments);
            this.text = null;
        }
        Test3.prototype.foo = function () {
            return 'Test : foo ' + this.text;
        };
        Test3 = __decorate([
            decorator.provide(InitializeBy.TestBase1)
                .initializeBy(function (c, item) { item.text = 'foo 3'; })
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test3);
        return Test3;
    })(TestBase);
    InitializeBy.Test3 = Test3;
})(InitializeBy = exports.InitializeBy || (exports.InitializeBy = {}));
var Scope;
(function (Scope) {
    var TestBase = (function () {
        function TestBase() {
        }
        TestBase.prototype.foo = function () {
        };
        return TestBase;
    })();
    Scope.TestBase = TestBase;
    var Test = (function (_super) {
        __extends(Test, _super);
        function Test() {
            _super.apply(this, arguments);
            this.text = ' test none';
        }
        Test.prototype.foo = function () {
            return 'Test : foo' + this.text;
        };
        Test = __decorate([
            decorator.provide(Scope.TestBase)
                .within(1 /* None */)
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test);
        return Test;
    })(TestBase);
    Scope.Test = Test;
    var TestBase2 = (function () {
        function TestBase2() {
        }
        TestBase2.prototype.foo = function () {
        };
        return TestBase2;
    })();
    Scope.TestBase2 = TestBase2;
    var Test2 = (function (_super) {
        __extends(Test2, _super);
        function Test2() {
            _super.apply(this, arguments);
            this.text = ' test Container';
        }
        Test2.prototype.foo = function () {
            return 'Test : foo' + this.text;
        };
        Test2 = __decorate([
            decorator.provide(Scope.TestBase2)
                .within(2 /* Container */)
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test2);
        return Test2;
    })(TestBase2);
    Scope.Test2 = Test2;
    var TestBase3 = (function () {
        function TestBase3() {
        }
        TestBase3.prototype.foo = function () {
        };
        return TestBase3;
    })();
    Scope.TestBase3 = TestBase3;
    var Test3 = (function (_super) {
        __extends(Test3, _super);
        function Test3() {
            _super.apply(this, arguments);
            this.text = ' test Hierarchy';
        }
        Test3.prototype.foo = function () {
            return 'Test : foo' + this.text;
        };
        Test3 = __decorate([
            decorator.provide(Scope.TestBase3)
                .within(3 /* Hierarchy */)
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test3);
        return Test3;
    })(TestBase3);
    Scope.Test3 = Test3;
})(Scope = exports.Scope || (exports.Scope = {}));
var Owner;
(function (Owner) {
    var TestBase1 = (function () {
        function TestBase1() {
        }
        TestBase1.prototype.foo = function () {
        };
        TestBase1.prototype.dispose = function () { };
        return TestBase1;
    })();
    Owner.TestBase1 = TestBase1;
    var Test = (function (_super) {
        __extends(Test, _super);
        function Test() {
            _super.apply(this, arguments);
            this.text = 'test';
        }
        Test.prototype.foo = function () {
            return 'Test : foo ' + this.text;
        };
        Test.prototype.dispose = function () {
            this.text = 'disposed';
        };
        Test = __decorate([
            decorator.provide(Owner.TestBase1)
                .dispose(function (item) { item.dispose(); })
                .ownedBy(1 /* Container */)
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test);
        return Test;
    })(TestBase1);
    Owner.Test = Test;
    var TestBase2 = (function () {
        function TestBase2() {
        }
        TestBase2.prototype.foo = function () {
        };
        TestBase2.prototype.dispose = function () { };
        return TestBase2;
    })();
    Owner.TestBase2 = TestBase2;
    var Test2 = (function (_super) {
        __extends(Test2, _super);
        function Test2() {
            _super.apply(this, arguments);
            this.text = 'test';
        }
        Test2.prototype.foo = function () {
            return 'Test : foo ' + this.text;
        };
        Test2.prototype.dispose = function () {
            this.text = 'disposed';
        };
        Test2 = __decorate([
            decorator.provide(Owner.TestBase2)
                .dispose(function (item) { item.dispose(); })
                .ownedBy(2 /* Externals */)
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test2);
        return Test2;
    })(TestBase2);
    Owner.Test2 = Test2;
})(Owner = exports.Owner || (exports.Owner = {}));
var Named;
(function (Named) {
    var TestBase = (function () {
        function TestBase() {
        }
        TestBase.prototype.foo = function () {
        };
        return TestBase;
    })();
    Named.TestBase = TestBase;
    var Test = (function (_super) {
        __extends(Test, _super);
        function Test() {
            _super.apply(this, arguments);
            this.text = 'test';
        }
        Test.prototype.foo = function () {
            return 'Test : foo ' + this.text;
        };
        Test = __decorate([
            decorator.provide(Named.TestBase)
                .named('Some name')
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test);
        return Test;
    })(TestBase);
    Named.Test = Test;
    var Test2 = (function (_super) {
        __extends(Test2, _super);
        function Test2() {
            _super.apply(this, arguments);
            this.text = 'test';
        }
        Test2.prototype.foo = function () {
            return 'Test2 : foo ' + this.text;
        };
        Test2 = __decorate([
            decorator.provide(Named.TestBase)
                .named('Some name 2')
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test2);
        return Test2;
    })(TestBase);
    Named.Test2 = Test2;
})(Named = exports.Named || (exports.Named = {}));
//# sourceMappingURL=decorators.js.map