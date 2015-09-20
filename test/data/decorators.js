/// <reference path='../../d.ts/typeioc.d.ts' />
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
//'use strict';   TODO: add this back when the bug fix is released
var scaffold = require('./../scaffold');
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
    var Test = (function (_super) {
        __extends(Test, _super);
        function Test() {
            _super.apply(this, arguments);
        }
        Test.prototype.foo = function () {
            return 'Test : foo';
        };
        Test = __decorate([
            scaffold.Decorators.register(Registration.TestBase)
        ], Test);
        return Test;
    })(TestBase);
    Registration.Test = Test;
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
    var Test2 = (function (_super) {
        __extends(Test2, _super);
        function Test2() {
            _super.apply(this, arguments);
        }
        Test2.prototype.foo = function () {
            return 'Test : foo' + (Test2.text || '');
        };
        Test2.text = null;
        Test2 = __decorate([
            scaffold.Decorators.register(InitializeBy.TestBase, { initializeBy: function (_, item) { return item.text = ' test'; } })
        ], Test2);
        return Test2;
    })(TestBase);
    InitializeBy.Test2 = Test2;
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
        }
        Test.prototype.foo = function () {
            return 'Test : foo' + (Test2.text || '');
        };
        Test.text = null;
        Test = __decorate([
            scaffold.Decorators.register(TestBase, { initializeBy: function (_, item) { return item.text = ' test'; }, within: 3 /* Hierarchy */ })
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
        }
        Test2.prototype.foo = function () {
            return 'Test : foo' + (Test2.text || '');
        };
        Test2.text = null;
        Test2 = __decorate([
            scaffold.Decorators.register(TestBase, { initializeBy: function (_, item) { return item.text = ' test'; }, within: 2 /* Container */ })
        ], Test2);
        return Test2;
    })(TestBase);
    Scope.Test2 = Test2;
})(Scope = exports.Scope || (exports.Scope = {}));
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
        }
        Test.prototype.foo = function () {
            return 'Test : foo' + (Test.text || '');
        };
        Test.text = null;
        Test = __decorate([
            scaffold.Decorators.register(Named.TestBase, { initializeBy: function (_, item) { return item.text = ' test'; }, named: 'Some name' })
        ], Test);
        return Test;
    })(TestBase);
    Named.Test = Test;
    var Test2 = (function (_super) {
        __extends(Test2, _super);
        function Test2() {
            _super.apply(this, arguments);
        }
        Test2.prototype.foo = function () {
            return 'Test2 : foo' + (Test2.text || '');
        };
        Test2.text = null;
        Test2 = __decorate([
            scaffold.Decorators.register(Named.TestBase, { initializeBy: function (_, item) { return item.text = ' test'; }, named: 'Some name 2' })
        ], Test2);
        return Test2;
    })(TestBase);
    Named.Test2 = Test2;
})(Named = exports.Named || (exports.Named = {}));
//# sourceMappingURL=decorators.js.map