'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Test1Base = (function () {
    function Test1Base() {
    }
    Object.defineProperty(Test1Base.prototype, "Name", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Test1Base.prototype, "Disposed", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return Test1Base;
})();
exports.Test1Base = Test1Base;
var Test2Base = (function () {
    function Test2Base() {
    }
    Object.defineProperty(Test2Base.prototype, "Name", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return Test2Base;
})();
exports.Test2Base = Test2Base;
var Test1 = (function (_super) {
    __extends(Test1, _super);
    function Test1() {
        _super.apply(this, arguments);
        this.name = 'test 1';
    }
    Object.defineProperty(Test1.prototype, "Name", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    return Test1;
})(Test1Base);
exports.Test1 = Test1;
var Test2 = (function (_super) {
    __extends(Test2, _super);
    function Test2() {
        _super.apply(this, arguments);
        this.name = 'test 2';
    }
    Object.defineProperty(Test2.prototype, "Name", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    return Test2;
})(Test2Base);
exports.Test2 = Test2;
var Test3 = (function (_super) {
    __extends(Test3, _super);
    function Test3(test2) {
        _super.call(this);
        this.test2 = test2;
    }
    Object.defineProperty(Test3.prototype, "Name", {
        get: function () {
            var result = 'Test 3 ';
            if (this.test2) {
                result += this.test2.Name;
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    return Test3;
})(Test1Base);
exports.Test3 = Test3;
var Test4 = (function (_super) {
    __extends(Test4, _super);
    function Test4(name) {
        _super.call(this);
        this.name = name;
    }
    Object.defineProperty(Test4.prototype, "Name", {
        get: function () {
            return this.name;
        },
        set: function (value) {
            this.name = value;
        },
        enumerable: true,
        configurable: true
    });
    return Test4;
})(Test1Base);
exports.Test4 = Test4;
var Test5 = (function (_super) {
    __extends(Test5, _super);
    function Test5() {
        _super.apply(this, arguments);
        this._disposed = false;
    }
    Object.defineProperty(Test5.prototype, "Name", {
        get: function () {
            return 'test 5';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Test5.prototype, "Disposed", {
        get: function () {
            return this._disposed;
        },
        enumerable: true,
        configurable: true
    });
    Test5.prototype.Dispose = function () {
        this._disposed = true;
    };
    return Test5;
})(Test1Base);
exports.Test5 = Test5;
var Test6 = (function () {
    function Test6() {
    }
    return Test6;
})();
exports.Test6 = Test6;
var Test7 = (function (_super) {
    __extends(Test7, _super);
    function Test7(_base1, _base2, _test4) {
        _super.call(this);
        this._base1 = _base1;
        this._base2 = _base2;
        this._test4 = _test4;
    }
    Object.defineProperty(Test7.prototype, "Name", {
        get: function () {
            return [this._base1.Name, this._base2.Name, this._test4.Name].join(' ');
        },
        enumerable: true,
        configurable: true
    });
    return Test7;
})(Test1Base);
exports.Test7 = Test7;
var Initializable = (function () {
    function Initializable() {
        this.name = 'test name';
        this.test6 = null;
    }
    Initializable.prototype.initialize = function (name) {
        this.name = name;
    };
    return Initializable;
})();
exports.Initializable = Initializable;
var Initializable2 = (function (_super) {
    __extends(Initializable2, _super);
    function Initializable2() {
        _super.apply(this, arguments);
    }
    return Initializable2;
})(Initializable);
exports.Initializable2 = Initializable2;
var TestModule1;
(function (TestModule1) {
    var Test1 = (function () {
        function Test1(name) {
            this.name = 'test 1';
            this.name = name;
        }
        return Test1;
    })();
    TestModule1.Test1 = Test1;
    var Test2 = (function () {
        function Test2() {
        }
        Test2.prototype.age = function () {
            return 0;
        };
        return Test2;
    })();
    TestModule1.Test2 = Test2;
    function testNoclass() {
    }
    TestModule1.testNoclass = testNoclass;
})(TestModule1 = exports.TestModule1 || (exports.TestModule1 = {}));
var TestModule2;
(function (TestModule2) {
    var Test1 = (function () {
        function Test1(name) {
            this.name = 'test 1';
            this.name = name;
        }
        return Test1;
    })();
    TestModule2.Test1 = Test1;
    var Test3 = (function () {
        function Test3() {
        }
        Test3.prototype.age1 = function () {
            return 0;
        };
        return Test3;
    })();
    TestModule2.Test3 = Test3;
    var Test4 = (function () {
        function Test4() {
        }
        Test4.prototype.age = function () {
            return 0;
        };
        Test4.prototype.age1 = function () {
            return 0;
        };
        return Test4;
    })();
    TestModule2.Test4 = Test4;
    function testNoclass() {
    }
    TestModule2.testNoclass = testNoclass;
})(TestModule2 = exports.TestModule2 || (exports.TestModule2 = {}));
function TestNoClass() {
}
exports.TestNoClass = TestNoClass;
;
//# sourceMappingURL=test-data.js.map