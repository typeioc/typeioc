/* istanbul ignore next */
/// <reference path='../../d.ts/typeioc.d.ts' />
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const scaffold = require("./../scaffold");
const ScaffoldAddons = require("./../scaffoldAddons");
var interceptor = ScaffoldAddons.Interceptors.create();
exports.decorator = scaffold.createDecorator();
exports.decorator2 = scaffold.createDecorator();
var Registration;
(function (Registration) {
    class TestBase {
        foo() {
        }
    }
    Registration.TestBase = TestBase;
    class TestBase1 {
        foo1() {
        }
    }
    Registration.TestBase1 = TestBase1;
    class TestBase2 {
        foo2() {
        }
    }
    Registration.TestBase2 = TestBase2;
    let Test = class Test extends TestBase {
        foo() {
            return 'Test : foo';
        }
    };
    Test = __decorate([
        exports.decorator.provide(Registration.TestBase).register()
    ], Test);
    Registration.Test = Test;
    let Test1 = class Test1 {
        constructor(TestBase) {
            this.TestBase = TestBase;
        }
        foo1() {
            return this.TestBase.foo() + ' : foo1';
        }
    };
    Test1 = __decorate([
        exports.decorator.provide(Registration.TestBase1).register(),
        __metadata("design:paramtypes", [TestBase])
    ], Test1);
    Registration.Test1 = Test1;
    let Test2 = class Test2 {
        constructor(testBase, testBase1) {
            this.testBase = testBase;
            this.testBase1 = testBase1;
        }
        foo2() {
            return [this.testBase.foo(), this.testBase1.foo1(), 'foo2'].join(' | ');
        }
    };
    Test2 = __decorate([
        exports.decorator.provide(Registration.TestBase2).register(),
        __metadata("design:paramtypes", [TestBase, TestBase1])
    ], Test2);
    Registration.Test2 = Test2;
})(Registration = exports.Registration || (exports.Registration = {}));
var InitializeBy;
(function (InitializeBy) {
    class TestBase {
        foo() {
        }
    }
    InitializeBy.TestBase = TestBase;
    class TestBase1 {
        foo() {
        }
    }
    InitializeBy.TestBase1 = TestBase1;
    let Test2 = class Test2 extends TestBase {
        constructor() {
            super(...arguments);
            this.text = null;
        }
        foo() {
            return 'Test : foo ' + this.text;
        }
    };
    Test2 = __decorate([
        exports.decorator.provide(InitializeBy.TestBase)
            .initializeBy((c, item) => { item.text = 'foo 2'; return item; })
            .register()
    ], Test2);
    InitializeBy.Test2 = Test2;
    let Test3 = class Test3 extends TestBase1 {
        constructor() {
            super(...arguments);
            this.text = null;
        }
        foo() {
            return 'Test : foo ' + this.text;
        }
    };
    Test3 = __decorate([
        exports.decorator.provide(InitializeBy.TestBase1)
            .initializeBy((c, item) => {
            item.text = 'foo 3';
            item = interceptor.interceptInstance(item, {
                method: 'foo',
                wrapper: function (callInfo) { return this.text + ' interceptor'; }
            });
            return item;
        })
            .register()
    ], Test3);
    InitializeBy.Test3 = Test3;
})(InitializeBy = exports.InitializeBy || (exports.InitializeBy = {}));
var Scope;
(function (Scope) {
    class TestBase {
        foo() {
        }
    }
    Scope.TestBase = TestBase;
    let Test = class Test extends TestBase {
        constructor() {
            super(...arguments);
            this.text = ' test none';
        }
        foo() {
            return 'Test : foo' + this.text;
        }
    };
    Test = __decorate([
        exports.decorator.provide(Scope.TestBase)
            .within(1 /* None */)
            .register()
    ], Test);
    Scope.Test = Test;
    class TestBase2 {
        foo() {
        }
    }
    Scope.TestBase2 = TestBase2;
    let Test2 = class Test2 extends TestBase2 {
        constructor() {
            super(...arguments);
            this.text = ' test Container';
        }
        foo() {
            return 'Test : foo' + this.text;
        }
    };
    Test2 = __decorate([
        exports.decorator.provide(Scope.TestBase2)
            .within(2 /* Container */)
            .register()
    ], Test2);
    Scope.Test2 = Test2;
    class TestBase3 {
        foo() {
        }
    }
    Scope.TestBase3 = TestBase3;
    let Test3 = class Test3 extends TestBase3 {
        constructor() {
            super(...arguments);
            this.text = ' test Hierarchy';
        }
        foo() {
            return 'Test : foo' + this.text;
        }
    };
    Test3 = __decorate([
        exports.decorator.provide(Scope.TestBase3)
            .within(3 /* Hierarchy */)
            .register()
    ], Test3);
    Scope.Test3 = Test3;
})(Scope = exports.Scope || (exports.Scope = {}));
var Owner;
(function (Owner) {
    class TestBase1 {
        foo() {
        }
        dispose() { }
    }
    Owner.TestBase1 = TestBase1;
    let Test = class Test extends TestBase1 {
        constructor() {
            super(...arguments);
            this.text = 'test';
        }
        foo() {
            return 'Test : foo ' + this.text;
        }
        dispose() {
            this.text = 'disposed';
        }
    };
    Test = __decorate([
        exports.decorator.provide(Owner.TestBase1)
            .dispose((item) => { item.dispose(); })
            .ownedBy(1 /* Container */)
            .register()
    ], Test);
    Owner.Test = Test;
    class TestBase2 {
        foo() {
        }
        dispose() { }
    }
    Owner.TestBase2 = TestBase2;
    let Test2 = class Test2 extends TestBase2 {
        constructor() {
            super(...arguments);
            this.text = 'test';
        }
        foo() {
            return 'Test : foo ' + this.text;
        }
        dispose() {
            this.text = 'disposed';
        }
    };
    Test2 = __decorate([
        exports.decorator.provide(Owner.TestBase2)
            .dispose((item) => { item.dispose(); })
            .ownedBy(2 /* Externals */)
            .register()
    ], Test2);
    Owner.Test2 = Test2;
})(Owner = exports.Owner || (exports.Owner = {}));
var Named;
(function (Named) {
    class TestBase {
        foo() {
        }
    }
    Named.TestBase = TestBase;
    let Test = class Test extends TestBase {
        constructor() {
            super(...arguments);
            this.text = 'test';
        }
        foo() {
            return 'Test : foo ' + this.text;
        }
    };
    Test = __decorate([
        exports.decorator.provide(Named.TestBase)
            .named('Some name')
            .register()
    ], Test);
    Named.Test = Test;
    let Test2 = class Test2 extends TestBase {
        constructor() {
            super(...arguments);
            this.text = 'test';
        }
        foo() {
            return 'Test2 : foo ' + this.text;
        }
    };
    Test2 = __decorate([
        exports.decorator.provide(Named.TestBase)
            .named('Some name 2')
            .register()
    ], Test2);
    Named.Test2 = Test2;
})(Named = exports.Named || (exports.Named = {}));
var Resolve;
(function (Resolve) {
    let ByValue;
    (function (ByValue) {
        class TestBase {
            foo() { }
        }
        ByValue.TestBase = TestBase;
        let Test1 = class Test1 extends TestBase {
            constructor(value) {
                super();
                this.value = value;
            }
            foo() {
                return 'Test1 : ' + this.value;
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(Resolve.ByValue.TestBase).register(),
            __param(0, exports.decorator.resolveValue('decorator value')),
            __metadata("design:paramtypes", [Object])
        ], Test1);
        ByValue.Test1 = Test1;
        class TestBase1 {
            foo() { }
        }
        ByValue.TestBase1 = TestBase1;
        let Test2 = class Test2 extends TestBase1 {
            constructor(value1, value2, value3) {
                super();
                this.value1 = value1;
                this.value2 = value2;
                this.value3 = value3;
            }
            foo() {
                return ['Test1 :', this.value1, this.value2, this.value3].join(' ');
            }
        };
        Test2 = __decorate([
            exports.decorator.provide(Resolve.ByValue.TestBase1).register(),
            __param(0, exports.decorator.resolveValue('value 1')),
            __param(1, exports.decorator.resolveValue('value 2')),
            __param(2, exports.decorator.resolveValue('value 3')),
            __metadata("design:paramtypes", [Object, Object, Object])
        ], Test2);
        ByValue.Test2 = Test2;
    })(ByValue = Resolve.ByValue || (Resolve.ByValue = {}));
    let ByService;
    (function (ByService) {
        class TestBase {
            foo() { }
        }
        ByService.TestBase = TestBase;
        class TestBase1 {
            foo() { }
        }
        ByService.TestBase1 = TestBase1;
        class TestBase2 {
            foo() { }
        }
        ByService.TestBase2 = TestBase2;
        let Test = class Test extends TestBase {
            foo() {
                return 'Test';
            }
        };
        Test = __decorate([
            exports.decorator.provide(Resolve.ByService.TestBase).register()
        ], Test);
        ByService.Test = Test;
        let Test2 = class Test2 extends TestBase2 {
            foo() {
                return 'Test2';
            }
        };
        Test2 = __decorate([
            exports.decorator.provide(Resolve.ByService.TestBase2).register()
        ], Test2);
        ByService.Test2 = Test2;
        let Test1 = class Test1 extends TestBase1 {
            constructor(value111, value222, value333) {
                super();
                this.value111 = value111;
                this.value222 = value222;
                this.value333 = value333;
            }
            foo() {
                return ['Test1 :', this.value111.foo(), this.value222.foo(), this.value333.foo()].join(' ');
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(Resolve.ByService.TestBase1).register(),
            __param(1, exports.decorator.by(Resolve.ByService.TestBase2).resolve()),
            __param(2, exports.decorator.by(Resolve.ByService.TestBase).resolve()),
            __metadata("design:paramtypes", [Resolve.ByService.TestBase, Object, Object])
        ], Test1);
        ByService.Test1 = Test1;
    })(ByService = Resolve.ByService || (Resolve.ByService = {}));
    let ByMultipleService;
    (function (ByMultipleService) {
        class TestBase {
            foo() { }
        }
        ByMultipleService.TestBase = TestBase;
        class TestBase1 {
            foo() { }
        }
        ByMultipleService.TestBase1 = TestBase1;
        class TestBase2 {
            foo() { }
        }
        ByMultipleService.TestBase2 = TestBase2;
        let Test = class Test extends TestBase {
            constructor() {
                super();
            }
            foo() {
                return 'Test';
            }
        };
        Test = __decorate([
            exports.decorator.provide(Resolve.ByMultipleService.TestBase).register(),
            __metadata("design:paramtypes", [])
        ], Test);
        ByMultipleService.Test = Test;
        let Test1 = class Test1 extends TestBase1 {
            constructor(_value1, _value2) {
                super();
                this._value1 = _value1;
                this._value2 = _value2;
            }
            foo() {
                return ['Test1', this._value1.foo(), this._value2.foo()].join(' ');
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(Resolve.ByMultipleService.TestBase1).register(),
            __param(1, exports.decorator.by(Resolve.ByMultipleService.TestBase).resolve()),
            __metadata("design:paramtypes", [Resolve.ByMultipleService.TestBase, Object])
        ], Test1);
        ByMultipleService.Test1 = Test1;
        let Test2 = class Test2 extends TestBase2 {
            constructor(_value1, _value2) {
                super();
                this._value1 = _value1;
                this._value2 = _value2;
            }
            foo() {
                return ['Test2', this._value1.foo(), this._value2.foo()].join(' ');
            }
        };
        Test2 = __decorate([
            exports.decorator.provide(Resolve.ByMultipleService.TestBase2).register(),
            __param(0, exports.decorator.by(Resolve.ByMultipleService.TestBase1).resolve()),
            __param(1, exports.decorator.by(Resolve.ByMultipleService.TestBase).resolve()),
            __metadata("design:paramtypes", [Object, Object])
        ], Test2);
        ByMultipleService.Test2 = Test2;
    })(ByMultipleService = Resolve.ByMultipleService || (Resolve.ByMultipleService = {}));
    let ByArgs;
    (function (ByArgs) {
        class TestBase {
            foo() { }
        }
        ByArgs.TestBase = TestBase;
        class TestBase1 {
            foo() { }
        }
        ByArgs.TestBase1 = TestBase1;
        let Test = class Test extends TestBase {
            constructor(val1, val2) {
                super();
                this.val1 = val1;
                this.val2 = val2;
            }
            foo() {
                return ['Test', this.val1, this.val2].join(' ');
            }
        };
        Test = __decorate([
            exports.decorator.provide(Resolve.ByArgs.TestBase).register(),
            __metadata("design:paramtypes", [String, String])
        ], Test);
        ByArgs.Test = Test;
        let Test1 = class Test1 extends TestBase1 {
            constructor(value) {
                super();
                this.value = value;
            }
            foo() {
                return ['Test1 :', this.value.foo()].join(' ');
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(Resolve.ByArgs.TestBase1).register(),
            __param(0, exports.decorator.by().args('1', '7').resolve()),
            __metadata("design:paramtypes", [Resolve.ByArgs.TestBase])
        ], Test1);
        ByArgs.Test1 = Test1;
    })(ByArgs = Resolve.ByArgs || (Resolve.ByArgs = {}));
    let ByName;
    (function (ByName) {
        class TestBase {
            foo() { }
        }
        ByName.TestBase = TestBase;
        class TestBase1 {
            foo() { }
        }
        ByName.TestBase1 = TestBase1;
        let Test = class Test extends TestBase {
            foo() {
                return 'Test';
            }
        };
        Test = __decorate([
            exports.decorator.provide(Resolve.ByName.TestBase).register(),
            exports.decorator.provide(Resolve.ByName.TestBase).named('Some name 1').register(),
            exports.decorator.provide(Resolve.ByName.TestBase).named('Some name 2').register()
        ], Test);
        ByName.Test = Test;
        let Test1 = class Test1 extends TestBase1 {
            constructor(value1, value2, value3) {
                super();
                this.value1 = value1;
                this.value2 = value2;
                this.value3 = value3;
            }
            foo() {
                return ['Test1 :', this.value1.foo(), this.value2.foo(), this.value3.foo()].join(' ');
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(Resolve.ByName.TestBase1).register(),
            __param(1, exports.decorator.by().name('Some name 1').resolve()),
            __param(2, exports.decorator.by().name('Some name 2').resolve()),
            __metadata("design:paramtypes", [Resolve.ByName.TestBase, Resolve.ByName.TestBase, Resolve.ByName.TestBase])
        ], Test1);
        ByName.Test1 = Test1;
    })(ByName = Resolve.ByName || (Resolve.ByName = {}));
    let ByAttempt;
    (function (ByAttempt) {
        class TestBase {
            foo() { }
        }
        ByAttempt.TestBase = TestBase;
        class TestBase1 {
            foo1() { }
        }
        ByAttempt.TestBase1 = TestBase1;
        let Test1 = class Test1 extends TestBase1 {
            foo1() {
                return 'Test1';
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(Resolve.ByAttempt.TestBase1).register()
        ], Test1);
        ByAttempt.Test1 = Test1;
        let Test = class Test extends TestBase {
            constructor(value1, value2) {
                super();
                this.value1 = value1;
                this.value2 = value2;
            }
            foo() {
                return 'Test' + (this.value1 || ' no value ') + this.value2.foo1();
            }
        };
        Test = __decorate([
            exports.decorator.provide(Resolve.ByAttempt.TestBase).register(),
            __param(0, exports.decorator.by().attempt().resolve()),
            __param(1, exports.decorator.by().attempt().resolve()),
            __metadata("design:paramtypes", [Object, Resolve.ByAttempt.TestBase1])
        ], Test);
        ByAttempt.Test = Test;
    })(ByAttempt = Resolve.ByAttempt || (Resolve.ByAttempt = {}));
    let ByCache;
    (function (ByCache) {
        class TestBase {
            foo() { }
        }
        ByCache.TestBase = TestBase;
        class TestBase1 {
            foo() { }
        }
        ByCache.TestBase1 = TestBase1;
        let Test = class Test extends TestBase {
            foo() {
                return 'Test';
            }
        };
        Test = __decorate([
            exports.decorator.provide(Resolve.ByCache.TestBase).register()
        ], Test);
        ByCache.Test = Test;
        let Test1 = class Test1 extends TestBase1 {
            constructor(value) {
                super();
                this.value = value;
            }
            foo() {
                return ['Test1 :', this.value.foo()].join(' ');
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(Resolve.ByCache.TestBase1).register(),
            __param(0, exports.decorator.by().cache().resolve()),
            __metadata("design:paramtypes", [Resolve.ByCache.TestBase])
        ], Test1);
        ByCache.Test1 = Test1;
    })(ByCache = Resolve.ByCache || (Resolve.ByCache = {}));
    let FullResolution;
    (function (FullResolution) {
        class TestBase {
            foo() { }
        }
        FullResolution.TestBase = TestBase;
        class TestBase1 {
            foo() { }
        }
        FullResolution.TestBase1 = TestBase1;
        class TestBase2 {
            foo() { }
        }
        FullResolution.TestBase2 = TestBase2;
        class TestBase3 {
            foo() { }
        }
        FullResolution.TestBase3 = TestBase3;
        class TestBase4 {
            foo() { }
        }
        FullResolution.TestBase4 = TestBase4;
        let Test3 = class Test3 extends TestBase3 {
            constructor(arg1, arg2) {
                super();
                this.arg1 = arg1;
                this.arg2 = arg2;
            }
            foo() {
                return ['Test', this.arg1, this.arg2].join(' ');
            }
        };
        Test3 = __decorate([
            exports.decorator.provide(Resolve.FullResolution.TestBase3)
                .named('Some name')
                .register(),
            __metadata("design:paramtypes", [Object, Object])
        ], Test3);
        FullResolution.Test3 = Test3;
        let Test = class Test extends TestBase {
            constructor(arg1, arg2) {
                super();
                this.arg1 = arg1;
                this.arg2 = arg2;
            }
            foo() {
                return ['Test', this.arg1, this.arg2].join(' ');
            }
        };
        Test = __decorate([
            exports.decorator.provide(Resolve.FullResolution.TestBase).register(),
            __metadata("design:paramtypes", [Object, Object])
        ], Test);
        FullResolution.Test = Test;
        let Test1 = class Test1 extends TestBase1 {
            constructor(arg1) {
                super();
                this.arg1 = arg1;
            }
            foo() {
                return ['Test', this.arg1.foo()].join(' ');
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(Resolve.FullResolution.TestBase1).register(),
            __metadata("design:paramtypes", [Resolve.FullResolution.TestBase])
        ], Test1);
        FullResolution.Test1 = Test1;
        let Test2 = class Test2 extends TestBase2 {
            constructor(arg1, arg2, arg3) {
                super();
                this.arg1 = arg1;
                this.arg2 = arg2;
                this.arg3 = arg3;
            }
            foo() {
                return ['Test', this.arg1.foo(), this.arg2.foo(), this.arg3.foo()].join(' ');
            }
        };
        Test2 = __decorate([
            exports.decorator.provide(Resolve.FullResolution.TestBase2).register(),
            __param(2, exports.decorator.by().name('Some name').resolve()),
            __metadata("design:paramtypes", [Resolve.FullResolution.TestBase, Resolve.FullResolution.TestBase1, Resolve.FullResolution.TestBase3])
        ], Test2);
        FullResolution.Test2 = Test2;
        let Test4 = class Test4 extends TestBase4 {
            constructor(arg1, arg2, arg2_1, arg3) {
                super();
                this.arg1 = arg1;
                this.arg2 = arg2;
                this.arg2_1 = arg2_1;
                this.arg3 = arg3;
            }
            foo() {
                return ['Test', this.arg1.foo(), this.arg2.foo(), this.arg2_1, this.arg3.foo()].join(' ');
            }
        };
        Test4 = __decorate([
            exports.decorator.provide(Resolve.FullResolution.TestBase4).register(),
            __param(2, exports.decorator.resolveValue('decorator value')),
            __param(3, exports.decorator.by(Resolve.FullResolution.TestBase3).name('Some name').resolve()),
            __metadata("design:paramtypes", [Resolve.FullResolution.TestBase, Resolve.FullResolution.TestBase1, Object, Object])
        ], Test4);
        FullResolution.Test4 = Test4;
        class TestDep extends Resolve.FullResolution.TestBase {
            constructor() {
                super();
            }
            foo() {
                return 'dependency';
            }
        }
        FullResolution.TestDep = TestDep;
        class TestDep1 extends Resolve.FullResolution.TestBase1 {
            constructor() {
                super();
            }
            foo() {
                return 'dependency 1';
            }
        }
        FullResolution.TestDep1 = TestDep1;
        class TestDep3 extends Resolve.FullResolution.TestBase3 {
            constructor() {
                super();
            }
            foo() {
                return 'dependency 3';
            }
        }
        FullResolution.TestDep3 = TestDep3;
    })(FullResolution = Resolve.FullResolution || (Resolve.FullResolution = {}));
    let DependenciesProperties;
    (function (DependenciesProperties) {
        class TestBase {
            foo() { }
        }
        DependenciesProperties.TestBase = TestBase;
        class TestBase1 {
            foo() { }
        }
        DependenciesProperties.TestBase1 = TestBase1;
        let Test = class Test extends TestBase {
            constructor(arg1, arg2) {
                super();
                this.arg1 = arg1;
                this.arg2 = arg2;
            }
            foo() {
                return ['Test', this.arg1, this.arg2].join(' ');
            }
        };
        Test = __decorate([
            exports.decorator.provide(Resolve.DependenciesProperties.TestBase)
                .named('Some test name').register(),
            __metadata("design:paramtypes", [Object, Object])
        ], Test);
        DependenciesProperties.Test = Test;
        let Test1 = class Test1 extends TestBase1 {
            constructor(arg1) {
                super();
                this.arg1 = arg1;
            }
            foo() {
                return ['Test', this.arg1.foo()].join(' ');
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(Resolve.DependenciesProperties.TestBase1).register(),
            __param(0, exports.decorator.by().name('Some test name').resolve()),
            __metadata("design:paramtypes", [Resolve.DependenciesProperties.TestBase])
        ], Test1);
        DependenciesProperties.Test1 = Test1;
        class TestDep extends Resolve.DependenciesProperties.TestBase {
            constructor() {
                super();
            }
            foo() {
                return 'dependency Some test name';
            }
        }
        DependenciesProperties.TestDep = TestDep;
    })(DependenciesProperties = Resolve.DependenciesProperties || (Resolve.DependenciesProperties = {}));
    let DependenciesInit;
    (function (DependenciesInit) {
        class TestBase {
            foo() { }
        }
        DependenciesInit.TestBase = TestBase;
        let Test = class Test extends TestBase {
            foo() {
                return 'Test';
            }
        };
        Test = __decorate([
            exports.decorator.provide(Resolve.DependenciesInit.TestBase)
                .initializeBy((c, item) => {
                item.foo = function () { return 'Initialized'; };
                return item;
            })
                .register()
        ], Test);
        DependenciesInit.Test = Test;
        let TestInit = class TestInit {
            constructor(arg1) {
                this.arg1 = arg1;
            }
            foo() {
                return ['Test', this.arg1.foo()].join(' ');
            }
        };
        TestInit = __decorate([
            exports.decorator.provide('some TestInit').register(),
            __param(0, exports.decorator.by().resolve()),
            __metadata("design:paramtypes", [Resolve.DependenciesInit.TestBase])
        ], TestInit);
        DependenciesInit.TestInit = TestInit;
        class TestDep extends Resolve.DependenciesInit.TestBase {
            constructor() {
                super();
            }
            foo() {
                return 'dependency';
            }
        }
        DependenciesInit.TestDep = TestDep;
    })(DependenciesInit = Resolve.DependenciesInit || (Resolve.DependenciesInit = {}));
    let DependenciesNonRequired;
    (function (DependenciesNonRequired) {
        class TestBase {
            foo() { }
        }
        DependenciesNonRequired.TestBase = TestBase;
        class TestBase1 {
            foo() { }
        }
        DependenciesNonRequired.TestBase1 = TestBase1;
        let TestInit = class TestInit {
            constructor(arg1) {
                this.arg1 = arg1;
            }
            foo() {
                return ['Test', this.arg1.foo()].join(' ');
            }
        };
        TestInit = __decorate([
            exports.decorator.provide(Resolve.DependenciesNonRequired.TestBase).register(),
            __param(0, exports.decorator.by(Resolve.DependenciesNonRequired.TestBase1).resolve()),
            __metadata("design:paramtypes", [Object])
        ], TestInit);
        DependenciesNonRequired.TestInit = TestInit;
        class TestDep extends Resolve.DependenciesNonRequired.TestBase1 {
            constructor() {
                super();
            }
            foo() {
                return 'dependency';
            }
        }
        DependenciesNonRequired.TestDep = TestDep;
    })(DependenciesNonRequired = Resolve.DependenciesNonRequired || (Resolve.DependenciesNonRequired = {}));
    let ObjectResolution;
    (function (ObjectResolution) {
        class TestBase {
            foo() { }
        }
        ObjectResolution.TestBase = TestBase;
        let Test = class Test extends TestBase {
            constructor(_arg1) {
                super();
                this._arg1 = _arg1;
            }
            foo() {
                return ['Test', this._arg1.foo()].join(' ');
            }
        };
        Test = __decorate([
            exports.decorator.provide(ObjectResolution.TestBase).register(),
            __param(0, exports.decorator.by('dependency').resolve()),
            __metadata("design:paramtypes", [Object])
        ], Test);
        ObjectResolution.Test = Test;
        let Test1 = class Test1 {
            foo() {
                return 'Test1';
            }
        };
        Test1 = __decorate([
            exports.decorator.provide('dependency').register()
        ], Test1);
        ObjectResolution.Test1 = Test1;
    })(ObjectResolution = Resolve.ObjectResolution || (Resolve.ObjectResolution = {}));
    let NumberResolution;
    (function (NumberResolution) {
        class TestBase {
            foo() { }
        }
        NumberResolution.TestBase = TestBase;
        let Test = class Test extends TestBase {
            constructor(_arg1) {
                super();
                this._arg1 = _arg1;
            }
            foo() {
                return ['Test', this._arg1.foo()].join(' ');
            }
        };
        Test = __decorate([
            exports.decorator.provide(NumberResolution.TestBase).register(),
            __param(0, exports.decorator.by(123).resolve()),
            __metadata("design:paramtypes", [Object])
        ], Test);
        NumberResolution.Test = Test;
        let Test1 = class Test1 {
            foo() {
                return 'Test1';
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(123).register()
        ], Test1);
        NumberResolution.Test1 = Test1;
    })(NumberResolution = Resolve.NumberResolution || (Resolve.NumberResolution = {}));
    let MultipleDecorators;
    (function (MultipleDecorators) {
        class TestBase {
            foo() { }
        }
        MultipleDecorators.TestBase = TestBase;
        class TestBase1 {
            foo() { }
        }
        MultipleDecorators.TestBase1 = TestBase1;
        class TestBase2 {
            foo() { }
        }
        MultipleDecorators.TestBase2 = TestBase2;
        let Test = class Test extends TestBase {
            foo() {
                return 'Test';
            }
        };
        Test = __decorate([
            exports.decorator.provide(MultipleDecorators.TestBase).register(),
            exports.decorator2.provide(MultipleDecorators.TestBase).register()
        ], Test);
        MultipleDecorators.Test = Test;
        let Test1 = class Test1 extends TestBase1 {
            constructor(_arg1, _arg2, _arg3) {
                super();
                this._arg1 = _arg1;
                this._arg2 = _arg2;
                this._arg3 = _arg3;
            }
            foo() {
                return ['Test 1 ', this._arg1.foo(), this._arg2.foo(), this._arg3.foo()].join(' ');
            }
        };
        Test1 = __decorate([
            exports.decorator.provide(MultipleDecorators.TestBase1).register(),
            exports.decorator2.provide(MultipleDecorators.TestBase1).register(),
            __param(0, exports.decorator.by().resolve()), __param(0, exports.decorator2.by().resolve()),
            __param(1, exports.decorator.by('decorator').resolve()), __param(1, exports.decorator2.by('decorator 2').resolve()),
            __metadata("design:paramtypes", [TestBase, Object, TestBase2])
        ], Test1);
        MultipleDecorators.Test1 = Test1;
        let Test2 = class Test2 {
            foo() {
                return 'Test2';
            }
        };
        Test2 = __decorate([
            exports.decorator.provide('decorator').register(),
            exports.decorator2.provide('decorator 2').register()
        ], Test2);
        MultipleDecorators.Test2 = Test2;
        let Test3 = class Test3 extends TestBase2 {
            foo() {
                return 'Test3';
            }
        };
        Test3 = __decorate([
            exports.decorator.provide(MultipleDecorators.TestBase2).register(),
            exports.decorator2.provide(MultipleDecorators.TestBase2).register()
        ], Test3);
        MultipleDecorators.Test3 = Test3;
    })(MultipleDecorators = Resolve.MultipleDecorators || (Resolve.MultipleDecorators = {}));
})(Resolve = exports.Resolve || (exports.Resolve = {}));
//# sourceMappingURL=decorators.js.map