'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class Test1Base {
    get Name() { return null; }
    set Name(value) { }
    get Disposed() {
        return false;
    }
}
exports.Test1Base = Test1Base;
class Test2Base {
    get Name() { return null; }
}
exports.Test2Base = Test2Base;
class Test1 extends Test1Base {
    constructor() {
        super(...arguments);
        this.name = 'test 1';
    }
    get Name() {
        return this.name;
    }
    set Name(value) {
        this.name = value;
    }
}
exports.Test1 = Test1;
class Test2 extends Test2Base {
    constructor() {
        super(...arguments);
        this.name = 'test 2';
    }
    get Name() {
        return this.name;
    }
}
exports.Test2 = Test2;
class Test3 extends Test1Base {
    get Name() {
        var result = 'Test 3 ';
        if (this.test2) {
            result += this.test2.Name;
        }
        return result;
    }
    constructor(test2) {
        super();
        this.test2 = test2;
    }
}
exports.Test3 = Test3;
class Test4 extends Test1Base {
    get Name() {
        return this.name;
    }
    set Name(value) {
        this.name = value;
    }
    constructor(name) {
        super();
        this.name = name;
    }
}
exports.Test4 = Test4;
class Test5 extends Test1Base {
    constructor() {
        super(...arguments);
        this._disposed = false;
    }
    get Name() {
        return 'test 5';
    }
    get Disposed() {
        return this._disposed;
    }
    Dispose() {
        this._disposed = true;
    }
}
exports.Test5 = Test5;
class Test6 {
    constructor() {
    }
}
exports.Test6 = Test6;
class Test7 extends Test1Base {
    constructor(_base1, _base2, _test4) {
        super();
        this._base1 = _base1;
        this._base2 = _base2;
        this._test4 = _test4;
    }
    get Name() {
        return [this._base1.Name, this._base2.Name, this._test4.Name].join(' ');
    }
}
exports.Test7 = Test7;
class Initializable {
    constructor() {
        this.name = 'test name';
        this.test6 = null;
    }
    initialize(name) {
        this.name = name;
    }
}
exports.Initializable = Initializable;
class Initializable2 extends Initializable {
}
exports.Initializable2 = Initializable2;
var TestModule1;
(function (TestModule1) {
    class Test1 {
        constructor(name) {
            this.name = 'test 1';
            this.name = name;
        }
    }
    TestModule1.Test1 = Test1;
    class Test2 {
        age() {
            return 0;
        }
    }
    TestModule1.Test2 = Test2;
    function testNoclass() { }
    TestModule1.testNoclass = testNoclass;
})(TestModule1 = exports.TestModule1 || (exports.TestModule1 = {}));
var TestModule2;
(function (TestModule2) {
    class Test1 {
        constructor(name) {
            this.name = 'test 1';
            this.name = name;
        }
    }
    TestModule2.Test1 = Test1;
    class Test3 {
        age1() {
            return 0;
        }
    }
    TestModule2.Test3 = Test3;
    class Test4 {
        age() {
            return 0;
        }
        age1() {
            return 0;
        }
    }
    TestModule2.Test4 = Test4;
    function testNoclass() { }
    TestModule2.testNoclass = testNoclass;
})(TestModule2 = exports.TestModule2 || (exports.TestModule2 = {}));
function TestNoClass() { }
exports.TestNoClass = TestNoClass;
;
//# sourceMappingURL=test-data.js.map