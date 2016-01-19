/// <reference path='../../d.ts/typeioc.d.ts' />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var scaffold = require('./../scaffold');
var ScaffoldAddons = require('./../scaffoldAddons');
var interceptor = ScaffoldAddons.Interceptors.create();
exports.decorator = scaffold.createDecorator();
exports.builder = scaffold.createBuilder();
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
            exports.decorator.provide(Registration.TestBase).register(), 
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
            exports.decorator.provide(Registration.TestBase1).register(), 
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
            exports.decorator.provide(Registration.TestBase2).register(), 
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
            exports.decorator.provide(InitializeBy.TestBase)
                .initializeBy(function (c, item) { item.text = 'foo 2'; return item; })
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
            exports.decorator.provide(InitializeBy.TestBase1)
                .initializeBy(function (c, item) {
                item.text = 'foo 3';
                item = interceptor.interceptInstance(item, {
                    method: 'foo',
                    wrapper: function (callInfo) { return this.text + ' interceptor'; }
                });
                return item;
            })
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test3);
        return Test3;
    })(TestBase1);
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
            exports.decorator.provide(Scope.TestBase)
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
            exports.decorator.provide(Scope.TestBase2)
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
            exports.decorator.provide(Scope.TestBase3)
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
            exports.decorator.provide(Owner.TestBase1)
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
            exports.decorator.provide(Owner.TestBase2)
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
            exports.decorator.provide(Named.TestBase)
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
            exports.decorator.provide(Named.TestBase)
                .named('Some name 2')
                .register(), 
            __metadata('design:paramtypes', [])
        ], Test2);
        return Test2;
    })(TestBase);
    Named.Test2 = Test2;
})(Named = exports.Named || (exports.Named = {}));
var Resolve;
(function (Resolve) {
    var ByValue;
    (function (ByValue) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        ByValue.TestBase = TestBase;
        var Test1 = (function (_super) {
            __extends(Test1, _super);
            function Test1(value) {
                _super.call(this);
                this.value = value;
            }
            Test1.prototype.foo = function () {
                return 'Test1 : ' + this.value;
            };
            Test1 = __decorate([
                exports.decorator.provide(Resolve.ByValue.TestBase).register(),
                __param(0, exports.decorator.resolveValue('decorator value')), 
                __metadata('design:paramtypes', [Object])
            ], Test1);
            return Test1;
        })(TestBase);
        ByValue.Test1 = Test1;
        var TestBase1 = (function () {
            function TestBase1() {
            }
            TestBase1.prototype.foo = function () { };
            return TestBase1;
        })();
        ByValue.TestBase1 = TestBase1;
        var Test2 = (function (_super) {
            __extends(Test2, _super);
            function Test2(value1, value2, value3) {
                _super.call(this);
                this.value1 = value1;
                this.value2 = value2;
                this.value3 = value3;
            }
            Test2.prototype.foo = function () {
                return ['Test1 :', this.value1, this.value2, this.value3].join(' ');
            };
            Test2 = __decorate([
                exports.decorator.provide(Resolve.ByValue.TestBase1).register(),
                __param(0, exports.decorator.resolveValue('value 1')),
                __param(1, exports.decorator.resolveValue('value 2')),
                __param(2, exports.decorator.resolveValue('value 3')), 
                __metadata('design:paramtypes', [Object, Object, Object])
            ], Test2);
            return Test2;
        })(TestBase1);
        ByValue.Test2 = Test2;
    })(ByValue = Resolve.ByValue || (Resolve.ByValue = {}));
    var ByService;
    (function (ByService) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        ByService.TestBase = TestBase;
        var TestBase1 = (function () {
            function TestBase1() {
            }
            TestBase1.prototype.foo = function () { };
            return TestBase1;
        })();
        ByService.TestBase1 = TestBase1;
        var TestBase2 = (function () {
            function TestBase2() {
            }
            TestBase2.prototype.foo = function () { };
            return TestBase2;
        })();
        ByService.TestBase2 = TestBase2;
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test() {
                _super.apply(this, arguments);
            }
            Test.prototype.foo = function () {
                return 'Test';
            };
            Test = __decorate([
                exports.decorator.provide(Resolve.ByService.TestBase).register(), 
                __metadata('design:paramtypes', [])
            ], Test);
            return Test;
        })(TestBase);
        ByService.Test = Test;
        var Test2 = (function (_super) {
            __extends(Test2, _super);
            function Test2() {
                _super.apply(this, arguments);
            }
            Test2.prototype.foo = function () {
                return 'Test2';
            };
            Test2 = __decorate([
                exports.decorator.provide(Resolve.ByService.TestBase2).register(), 
                __metadata('design:paramtypes', [])
            ], Test2);
            return Test2;
        })(TestBase2);
        ByService.Test2 = Test2;
        var Test1 = (function (_super) {
            __extends(Test1, _super);
            function Test1(value111, value222, value333) {
                _super.call(this);
                this.value111 = value111;
                this.value222 = value222;
                this.value333 = value333;
            }
            Test1.prototype.foo = function () {
                return ['Test1 :', this.value111.foo(), this.value222.foo(), this.value333.foo()].join(' ');
            };
            Test1 = __decorate([
                exports.decorator.provide(Resolve.ByService.TestBase1).register(),
                __param(1, exports.decorator.by(Resolve.ByService.TestBase2).resolve()),
                __param(2, exports.decorator.by(Resolve.ByService.TestBase).resolve()), 
                __metadata('design:paramtypes', [Resolve.ByService.TestBase, Object, Object])
            ], Test1);
            return Test1;
        })(TestBase1);
        ByService.Test1 = Test1;
    })(ByService = Resolve.ByService || (Resolve.ByService = {}));
    var ByMultipleService;
    (function (ByMultipleService) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        ByMultipleService.TestBase = TestBase;
        var TestBase1 = (function () {
            function TestBase1() {
            }
            TestBase1.prototype.foo = function () { };
            return TestBase1;
        })();
        ByMultipleService.TestBase1 = TestBase1;
        var TestBase2 = (function () {
            function TestBase2() {
            }
            TestBase2.prototype.foo = function () { };
            return TestBase2;
        })();
        ByMultipleService.TestBase2 = TestBase2;
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test(_value1, _value2) {
                _super.call(this);
                this._value1 = _value1;
                this._value2 = _value2;
            }
            Test.prototype.foo = function () {
                return ['Test', this._value1, this._value2].join(' ');
            };
            Test = __decorate([
                exports.decorator.provide(Resolve.ByMultipleService.TestBase).register(), 
                __metadata('design:paramtypes', [String, String])
            ], Test);
            return Test;
        })(TestBase);
        ByMultipleService.Test = Test;
        var Test1 = (function (_super) {
            __extends(Test1, _super);
            function Test1(_value1, _value2) {
                _super.call(this);
                this._value1 = _value1;
                this._value2 = _value2;
            }
            Test1.prototype.foo = function () {
                return ['Test1', this._value1.foo(), this._value2.foo()].join(' ');
            };
            Test1 = __decorate([
                exports.decorator.provide(Resolve.ByMultipleService.TestBase1).register(),
                __param(0, exports.decorator.by().args('1', '2').resolve()),
                __param(1, exports.decorator.by(Resolve.ByMultipleService.TestBase).args('3', '4').resolve()), 
                __metadata('design:paramtypes', [Resolve.ByMultipleService.TestBase, Object])
            ], Test1);
            return Test1;
        })(TestBase1);
        ByMultipleService.Test1 = Test1;
        var Test2 = (function (_super) {
            __extends(Test2, _super);
            function Test2(_value1, _value2) {
                _super.call(this);
                this._value1 = _value1;
                this._value2 = _value2;
            }
            Test2.prototype.foo = function () {
                return ['Test2', this._value1.foo(), this._value2.foo()].join(' ');
            };
            Test2 = __decorate([
                exports.decorator.provide(Resolve.ByMultipleService.TestBase2).register(),
                __param(0, exports.decorator.by(Resolve.ByMultipleService.TestBase1).resolve()),
                __param(1, exports.decorator.by(Resolve.ByMultipleService.TestBase).args('5', '6').resolve()), 
                __metadata('design:paramtypes', [Object, Object])
            ], Test2);
            return Test2;
        })(TestBase2);
        ByMultipleService.Test2 = Test2;
    })(ByMultipleService = Resolve.ByMultipleService || (Resolve.ByMultipleService = {}));
    var ByArgs;
    (function (ByArgs) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        ByArgs.TestBase = TestBase;
        var TestBase1 = (function () {
            function TestBase1() {
            }
            TestBase1.prototype.foo = function () { };
            return TestBase1;
        })();
        ByArgs.TestBase1 = TestBase1;
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test(val1, val2) {
                _super.call(this);
                this.val1 = val1;
                this.val2 = val2;
            }
            Test.prototype.foo = function () {
                return ['Test', this.val1, this.val2].join(' ');
            };
            Test = __decorate([
                exports.decorator.provide(Resolve.ByArgs.TestBase).register(), 
                __metadata('design:paramtypes', [String, String])
            ], Test);
            return Test;
        })(TestBase);
        ByArgs.Test = Test;
        var Test1 = (function (_super) {
            __extends(Test1, _super);
            function Test1(value) {
                _super.call(this);
                this.value = value;
            }
            Test1.prototype.foo = function () {
                return ['Test1 :', this.value.foo()].join(' ');
            };
            Test1 = __decorate([
                exports.decorator.provide(Resolve.ByArgs.TestBase1).register(),
                __param(0, exports.decorator.by().args('1', '7').resolve()), 
                __metadata('design:paramtypes', [Resolve.ByArgs.TestBase])
            ], Test1);
            return Test1;
        })(TestBase1);
        ByArgs.Test1 = Test1;
    })(ByArgs = Resolve.ByArgs || (Resolve.ByArgs = {}));
    var ByName;
    (function (ByName) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        ByName.TestBase = TestBase;
        var TestBase1 = (function () {
            function TestBase1() {
            }
            TestBase1.prototype.foo = function () { };
            return TestBase1;
        })();
        ByName.TestBase1 = TestBase1;
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test() {
                _super.apply(this, arguments);
            }
            Test.prototype.foo = function () {
                return 'Test';
            };
            Test = __decorate([
                exports.decorator.provide(Resolve.ByName.TestBase).named('Some name 1').register(),
                exports.decorator.provide(Resolve.ByName.TestBase).named('Some name 2').register(), 
                __metadata('design:paramtypes', [])
            ], Test);
            return Test;
        })(TestBase);
        ByName.Test = Test;
        var Test1 = (function (_super) {
            __extends(Test1, _super);
            function Test1(value1, value2, value3) {
                _super.call(this);
                this.value1 = value1;
                this.value2 = value2;
                this.value3 = value3;
            }
            Test1.prototype.foo = function () {
                return ['Test1 :', this.value1.foo(), this.value2.foo(), this.value3.foo()].join(' ');
            };
            Test1 = __decorate([
                exports.decorator.provide(Resolve.ByName.TestBase1).register(),
                __param(1, exports.decorator.by().name('Some name 1').resolve()),
                __param(2, exports.decorator.by().name('Some name 2').resolve()), 
                __metadata('design:paramtypes', [Resolve.ByName.TestBase, Resolve.ByName.TestBase, Resolve.ByName.TestBase])
            ], Test1);
            return Test1;
        })(TestBase1);
        ByName.Test1 = Test1;
    })(ByName = Resolve.ByName || (Resolve.ByName = {}));
    var ByAttempt;
    (function (ByAttempt) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        ByAttempt.TestBase = TestBase;
        var TestBase1 = (function () {
            function TestBase1() {
            }
            TestBase1.prototype.foo1 = function () { };
            return TestBase1;
        })();
        ByAttempt.TestBase1 = TestBase1;
        var Test1 = (function (_super) {
            __extends(Test1, _super);
            function Test1() {
                _super.apply(this, arguments);
            }
            Test1.prototype.foo1 = function () {
                return 'Test1';
            };
            Test1 = __decorate([
                exports.decorator.provide(Resolve.ByAttempt.TestBase1).register(), 
                __metadata('design:paramtypes', [])
            ], Test1);
            return Test1;
        })(TestBase1);
        ByAttempt.Test1 = Test1;
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test(value1, value2) {
                _super.call(this);
                this.value1 = value1;
                this.value2 = value2;
            }
            Test.prototype.foo = function () {
                return 'Test' + (this.value1 || ' no value ') + this.value2.foo1();
            };
            Test = __decorate([
                exports.decorator.provide(Resolve.ByAttempt.TestBase).register(),
                __param(0, exports.decorator.by().attempt().resolve()),
                __param(1, exports.decorator.by().attempt().resolve()), 
                __metadata('design:paramtypes', [Object, Resolve.ByAttempt.TestBase1])
            ], Test);
            return Test;
        })(TestBase);
        ByAttempt.Test = Test;
    })(ByAttempt = Resolve.ByAttempt || (Resolve.ByAttempt = {}));
    var ByCache;
    (function (ByCache) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        ByCache.TestBase = TestBase;
        var TestBase1 = (function () {
            function TestBase1() {
            }
            TestBase1.prototype.foo = function () { };
            return TestBase1;
        })();
        ByCache.TestBase1 = TestBase1;
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test() {
                _super.apply(this, arguments);
            }
            Test.prototype.foo = function () {
                return 'Test';
            };
            Test = __decorate([
                exports.decorator.provide(Resolve.ByCache.TestBase).register(), 
                __metadata('design:paramtypes', [])
            ], Test);
            return Test;
        })(TestBase);
        ByCache.Test = Test;
        var Test1 = (function (_super) {
            __extends(Test1, _super);
            function Test1(value) {
                _super.call(this);
                this.value = value;
            }
            Test1.prototype.foo = function () {
                return ['Test1 :', this.value.foo()].join(' ');
            };
            Test1 = __decorate([
                exports.decorator.provide(Resolve.ByCache.TestBase1).register(),
                __param(0, exports.decorator.by().cache().resolve()), 
                __metadata('design:paramtypes', [Resolve.ByCache.TestBase])
            ], Test1);
            return Test1;
        })(TestBase1);
        ByCache.Test1 = Test1;
    })(ByCache = Resolve.ByCache || (Resolve.ByCache = {}));
    var FullResolution;
    (function (FullResolution) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        FullResolution.TestBase = TestBase;
        var TestBase1 = (function () {
            function TestBase1() {
            }
            TestBase1.prototype.foo = function () { };
            return TestBase1;
        })();
        FullResolution.TestBase1 = TestBase1;
        var TestBase2 = (function () {
            function TestBase2() {
            }
            TestBase2.prototype.foo = function () { };
            return TestBase2;
        })();
        FullResolution.TestBase2 = TestBase2;
        var TestBase3 = (function () {
            function TestBase3() {
            }
            TestBase3.prototype.foo = function () { };
            return TestBase3;
        })();
        FullResolution.TestBase3 = TestBase3;
        var TestBase4 = (function () {
            function TestBase4() {
            }
            TestBase4.prototype.foo = function () { };
            return TestBase4;
        })();
        FullResolution.TestBase4 = TestBase4;
        var Test3 = (function (_super) {
            __extends(Test3, _super);
            function Test3(arg1, arg2) {
                _super.call(this);
                this.arg1 = arg1;
                this.arg2 = arg2;
            }
            Test3.prototype.foo = function () {
                return ['Test', this.arg1, this.arg2].join(' ');
            };
            Test3 = __decorate([
                exports.decorator.provide(Resolve.FullResolution.TestBase3).named('Some name').register(), 
                __metadata('design:paramtypes', [Object, Object])
            ], Test3);
            return Test3;
        })(TestBase3);
        FullResolution.Test3 = Test3;
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test(arg1, arg2) {
                _super.call(this);
                this.arg1 = arg1;
                this.arg2 = arg2;
            }
            Test.prototype.foo = function () {
                return ['Test', this.arg1, this.arg2].join(' ');
            };
            Test = __decorate([
                exports.decorator.provide(Resolve.FullResolution.TestBase).register(), 
                __metadata('design:paramtypes', [Object, Object])
            ], Test);
            return Test;
        })(TestBase);
        FullResolution.Test = Test;
        var Test1 = (function (_super) {
            __extends(Test1, _super);
            function Test1(arg1) {
                _super.call(this);
                this.arg1 = arg1;
            }
            Test1.prototype.foo = function () {
                return ['Test', this.arg1.foo()].join(' ');
            };
            Test1 = __decorate([
                exports.decorator.provide(Resolve.FullResolution.TestBase1).register(), 
                __metadata('design:paramtypes', [Resolve.FullResolution.TestBase])
            ], Test1);
            return Test1;
        })(TestBase1);
        FullResolution.Test1 = Test1;
        var Test2 = (function (_super) {
            __extends(Test2, _super);
            function Test2(arg1, arg2, arg3) {
                _super.call(this);
                this.arg1 = arg1;
                this.arg2 = arg2;
                this.arg3 = arg3;
            }
            Test2.prototype.foo = function () {
                return ['Test', this.arg1.foo(), this.arg2.foo(), this.arg3.foo()].join(' ');
            };
            Test2 = __decorate([
                exports.decorator.provide(Resolve.FullResolution.TestBase2).register(), 
                __metadata('design:paramtypes', [Resolve.FullResolution.TestBase, Resolve.FullResolution.TestBase1, Resolve.FullResolution.TestBase3])
            ], Test2);
            return Test2;
        })(TestBase2);
        FullResolution.Test2 = Test2;
        var Test4 = (function (_super) {
            __extends(Test4, _super);
            function Test4(arg1, arg2, arg2_1, arg3) {
                _super.call(this);
                this.arg1 = arg1;
                this.arg2 = arg2;
                this.arg2_1 = arg2_1;
                this.arg3 = arg3;
            }
            Test4.prototype.foo = function () {
                return ['Test', this.arg1.foo(), this.arg2.foo(), this.arg2_1, this.arg3.foo()].join(' ');
            };
            Test4 = __decorate([
                exports.decorator.provide(Resolve.FullResolution.TestBase4).register(),
                __param(2, exports.decorator.resolveValue('decorator value')),
                __param(3, exports.decorator.by(Resolve.FullResolution.TestBase3).resolve()), 
                __metadata('design:paramtypes', [Resolve.FullResolution.TestBase, Resolve.FullResolution.TestBase1, Object, Object])
            ], Test4);
            return Test4;
        })(TestBase4);
        FullResolution.Test4 = Test4;
        var TestDep = (function (_super) {
            __extends(TestDep, _super);
            function TestDep() {
                _super.call(this);
            }
            TestDep.prototype.foo = function () {
                return 'dependency';
            };
            return TestDep;
        })(Resolve.FullResolution.TestBase);
        FullResolution.TestDep = TestDep;
        var TestDep1 = (function (_super) {
            __extends(TestDep1, _super);
            function TestDep1() {
                _super.call(this);
            }
            TestDep1.prototype.foo = function () {
                return 'dependency 1';
            };
            return TestDep1;
        })(Resolve.FullResolution.TestBase1);
        FullResolution.TestDep1 = TestDep1;
        var TestDep3 = (function (_super) {
            __extends(TestDep3, _super);
            function TestDep3() {
                _super.call(this);
            }
            TestDep3.prototype.foo = function () {
                return 'dependency 3';
            };
            return TestDep3;
        })(Resolve.FullResolution.TestBase3);
        FullResolution.TestDep3 = TestDep3;
    })(FullResolution = Resolve.FullResolution || (Resolve.FullResolution = {}));
    var DependenciesProperties;
    (function (DependenciesProperties) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        DependenciesProperties.TestBase = TestBase;
        var TestBase1 = (function () {
            function TestBase1() {
            }
            TestBase1.prototype.foo = function () { };
            return TestBase1;
        })();
        DependenciesProperties.TestBase1 = TestBase1;
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test(arg1, arg2) {
                _super.call(this);
                this.arg1 = arg1;
                this.arg2 = arg2;
            }
            Test.prototype.foo = function () {
                return ['Test', this.arg1, this.arg2].join(' ');
            };
            Test = __decorate([
                exports.decorator.provide(Resolve.DependenciesProperties.TestBase)
                    .named('Some test name').register(), 
                __metadata('design:paramtypes', [Object, Object])
            ], Test);
            return Test;
        })(TestBase);
        DependenciesProperties.Test = Test;
        var Test1 = (function (_super) {
            __extends(Test1, _super);
            function Test1(arg1) {
                _super.call(this);
                this.arg1 = arg1;
            }
            Test1.prototype.foo = function () {
                return ['Test', this.arg1.foo()].join(' ');
            };
            Test1 = __decorate([
                exports.decorator.provide(Resolve.DependenciesProperties.TestBase1).register(),
                __param(0, exports.decorator.by().name('Some test name').resolve()), 
                __metadata('design:paramtypes', [Resolve.DependenciesProperties.TestBase])
            ], Test1);
            return Test1;
        })(TestBase1);
        DependenciesProperties.Test1 = Test1;
        var TestDep = (function (_super) {
            __extends(TestDep, _super);
            function TestDep() {
                _super.call(this);
            }
            TestDep.prototype.foo = function () {
                return 'dependency Some test name';
            };
            return TestDep;
        })(Resolve.DependenciesProperties.TestBase);
        DependenciesProperties.TestDep = TestDep;
    })(DependenciesProperties = Resolve.DependenciesProperties || (Resolve.DependenciesProperties = {}));
    var DependenciesInit;
    (function (DependenciesInit) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        DependenciesInit.TestBase = TestBase;
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test() {
                _super.apply(this, arguments);
            }
            Test.prototype.foo = function () {
                return 'Test';
            };
            Test = __decorate([
                exports.decorator.provide(Resolve.DependenciesInit.TestBase)
                    .initializeBy(function (c, item) {
                    item.foo = function () { return 'Initialized'; };
                    return item;
                })
                    .register(), 
                __metadata('design:paramtypes', [])
            ], Test);
            return Test;
        })(TestBase);
        DependenciesInit.Test = Test;
        var TestInit = (function () {
            function TestInit(arg1) {
                this.arg1 = arg1;
            }
            TestInit.prototype.foo = function () {
                return ['Test', this.arg1.foo()].join(' ');
            };
            TestInit = __decorate([
                exports.decorator.provide('some TestInit').register(),
                __param(0, exports.decorator.by().resolve()), 
                __metadata('design:paramtypes', [Resolve.DependenciesInit.TestBase])
            ], TestInit);
            return TestInit;
        })();
        DependenciesInit.TestInit = TestInit;
        var TestDep = (function (_super) {
            __extends(TestDep, _super);
            function TestDep() {
                _super.call(this);
            }
            TestDep.prototype.foo = function () {
                return 'dependency';
            };
            return TestDep;
        })(Resolve.DependenciesInit.TestBase);
        DependenciesInit.TestDep = TestDep;
    })(DependenciesInit = Resolve.DependenciesInit || (Resolve.DependenciesInit = {}));
    var DependenciesNonRequired;
    (function (DependenciesNonRequired) {
        var TestBase = (function () {
            function TestBase() {
            }
            TestBase.prototype.foo = function () { };
            return TestBase;
        })();
        DependenciesNonRequired.TestBase = TestBase;
        var TestBase1 = (function () {
            function TestBase1() {
            }
            TestBase1.prototype.foo = function () { };
            return TestBase1;
        })();
        DependenciesNonRequired.TestBase1 = TestBase1;
        var TestInit = (function () {
            function TestInit(arg1) {
                this.arg1 = arg1;
            }
            TestInit.prototype.foo = function () {
                return ['Test', this.arg1.foo()].join(' ');
            };
            TestInit = __decorate([
                exports.decorator.provide(Resolve.DependenciesNonRequired.TestBase).register(),
                __param(0, exports.decorator.by(Resolve.DependenciesNonRequired.TestBase1).resolve()), 
                __metadata('design:paramtypes', [Object])
            ], TestInit);
            return TestInit;
        })();
        DependenciesNonRequired.TestInit = TestInit;
        var TestDep = (function (_super) {
            __extends(TestDep, _super);
            function TestDep() {
                _super.call(this);
            }
            TestDep.prototype.foo = function () {
                return 'dependency';
            };
            return TestDep;
        })(Resolve.DependenciesNonRequired.TestBase1);
        DependenciesNonRequired.TestDep = TestDep;
    })(DependenciesNonRequired = Resolve.DependenciesNonRequired || (Resolve.DependenciesNonRequired = {}));
})(Resolve = exports.Resolve || (exports.Resolve = {}));
//# sourceMappingURL=decorators.js.map