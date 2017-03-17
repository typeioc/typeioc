'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Module1;
(function (Module1) {
    class Parent {
        constructor(arg1, _stub) {
            this.arg1 = arg1;
            this._stub = _stub;
        }
        foo() {
            this._stub();
            return this.arg1;
        }
    }
    Module1.Parent = Parent;
})(Module1 = exports.Module1 || (exports.Module1 = {}));
var Module2;
(function (Module2) {
    class GrandParent {
        constructor(arg1, _stub) {
            this.arg1 = arg1;
            this._stub = _stub;
        }
        foo() {
            this._stub();
            return this.arg1;
        }
    }
    Module2.GrandParent = GrandParent;
    class Parent extends GrandParent {
        constructor(arg1, stub) {
            super(arg1, stub);
        }
    }
    Module2.Parent = Parent;
})(Module2 = exports.Module2 || (exports.Module2 = {}));
var Module3;
(function (Module3) {
    var _stub;
    function setStub(stub) {
        _stub = stub;
    }
    Module3.setStub = setStub;
    class Parent {
        static foo() {
            _stub();
            return 1;
        }
    }
    Module3.Parent = Parent;
})(Module3 = exports.Module3 || (exports.Module3 = {}));
var Module4;
(function (Module4) {
    class Parent {
        constructor() {
            this.foo = 1;
        }
        getFoo() {
            return this.foo;
        }
    }
    Module4.Parent = Parent;
})(Module4 = exports.Module4 || (exports.Module4 = {}));
var Module5;
(function (Module5) {
    class Parent {
        static getFoo() {
            return Parent.foo;
        }
    }
    Parent.foo = 1;
    Module5.Parent = Parent;
})(Module5 = exports.Module5 || (exports.Module5 = {}));
var Module6;
(function (Module6) {
    class GrandParent {
        constructor() {
            this.foo = 1;
        }
    }
    Module6.GrandParent = GrandParent;
    class Parent extends GrandParent {
    }
    Module6.Parent = Parent;
})(Module6 = exports.Module6 || (exports.Module6 = {}));
var Module7;
(function (Module7) {
    class Parent {
        constructor(_foo, _stub) {
            this._foo = _foo;
            this._stub = _stub;
        }
        get foo() {
            this._stub();
            return this._foo;
        }
    }
    Module7.Parent = Parent;
})(Module7 = exports.Module7 || (exports.Module7 = {}));
var Module8;
(function (Module8) {
    class Parent {
        constructor(_stub) {
            this._stub = _stub;
        }
        set foo(value) {
            this._stub(value);
        }
    }
    Module8.Parent = Parent;
})(Module8 = exports.Module8 || (exports.Module8 = {}));
var Module9;
(function (Module9) {
    class Parent {
        constructor(_getStub, _setStub) {
            this._getStub = _getStub;
            this._setStub = _setStub;
        }
        get foo() {
            this._getStub();
            return this._innerValue;
        }
        set foo(value) {
            this._setStub(value);
            this._innerValue = value + 1;
        }
    }
    Module9.Parent = Parent;
})(Module9 = exports.Module9 || (exports.Module9 = {}));
var Module10;
(function (Module10) {
    var _stub;
    function setStub(value) {
        _stub = value;
    }
    Module10.setStub = setStub;
    class Parent {
        static get foo() {
            _stub();
            return 1;
        }
    }
    Module10.Parent = Parent;
})(Module10 = exports.Module10 || (exports.Module10 = {}));
var Module11;
(function (Module11) {
    class GrandParent {
        constructor(_stub, value) {
            this._stub = _stub;
            this.innerValue = 333;
            this.innerValue = value;
        }
        get foo() {
            this._stub();
            return this.innerValue;
        }
    }
    Module11.GrandParent = GrandParent;
    class Parent extends GrandParent {
        constructor(stub, value) {
            super(stub, value);
        }
    }
    Module11.Parent = Parent;
})(Module11 = exports.Module11 || (exports.Module11 = {}));
var Module12;
(function (Module12) {
    class GrandParent {
        constructor(getStub, setStub, value) {
            this.getStub = getStub;
            this.setStub = setStub;
            this._innerValue = 333;
            this._innerValue = value;
        }
        get foo() {
            this.getStub();
            return this._innerValue;
        }
        set foo(value) {
            this.setStub();
            this._innerValue = value;
        }
    }
    Module12.GrandParent = GrandParent;
    class Parent extends GrandParent {
        constructor(getStub, setStub) {
            super(getStub, setStub, 0);
        }
    }
    Module12.Parent = Parent;
})(Module12 = exports.Module12 || (exports.Module12 = {}));
var Module13;
(function (Module13) {
    class Parent {
        static get foo() {
            Module13.getStub();
            return this._innerValue;
        }
        static set foo(value) {
            Module13.setStub();
            this._innerValue = value;
        }
    }
    Parent._innerValue = 0;
    Module13.Parent = Parent;
})(Module13 = exports.Module13 || (exports.Module13 = {}));
var Module14;
(function (Module14) {
    class Parent {
        constructor(stub, arg1) {
            this.stub = stub;
            this.arg1 = arg1;
        }
        foo(arg1, arg2) {
            this.stub();
            return this.arg1 + arg1 + arg2;
        }
    }
    Module14.Parent = Parent;
})(Module14 = exports.Module14 || (exports.Module14 = {}));
var Module15;
(function (Module15) {
    class GrandParent {
        constructor(stub) {
            this.stub = stub;
        }
        foo(arg1, arg2) {
            this.stub();
            return arg1 + arg2;
        }
    }
    Module15.GrandParent = GrandParent;
    class Parent extends GrandParent {
        constructor(stub) {
            super(stub);
        }
    }
    Module15.Parent = Parent;
})(Module15 = exports.Module15 || (exports.Module15 = {}));
var Module16;
(function (Module16) {
    class Parent {
        static foo(arg1, arg2) {
            Module16.stub();
            return arg1 + arg2;
        }
    }
    Module16.Parent = Parent;
})(Module16 = exports.Module16 || (exports.Module16 = {}));
var Module17;
(function (Module17) {
    class Parent {
        constructor(barStub, fooStub) {
            this.barStub = barStub;
            this.fooStub = fooStub;
        }
        bar(arg) {
            var result = 0;
            if (arg > 0)
                result = arg + this.foo(arg - 1);
            this.barStub();
            return result;
        }
        foo(arg) {
            var result = 0;
            if (arg > 0)
                result = arg + this.bar(arg - 1);
            this.fooStub();
            return result;
        }
    }
    Module17.Parent = Parent;
})(Module17 = exports.Module17 || (exports.Module17 = {}));
var Module18;
(function (Module18) {
    class Parent {
        constructor(stub) {
            this.stub = stub;
            this.bar = 1;
        }
        foo(arg) {
            var result = 0;
            if (arg > this.bar)
                result = arg + this.foo(arg - 1);
            this.stub();
            return result;
        }
    }
    Module18.Parent = Parent;
})(Module18 = exports.Module18 || (exports.Module18 = {}));
var Module19;
(function (Module19) {
    class Parent {
        constructor(getStub, setStub, fooStub) {
            this.getStub = getStub;
            this.setStub = setStub;
            this.fooStub = fooStub;
            this._innerValue = 5;
        }
        get prop() {
            this.getStub();
            return this._innerValue;
        }
        set prop(value) {
            this.setStub();
            this._innerValue = value;
        }
        foo() {
            var result = 0;
            if (this.prop > 0) {
                this.prop = this.prop - 1;
                result = this.prop + this.foo();
            }
            this.fooStub();
            return result;
        }
    }
    Module19.Parent = Parent;
})(Module19 = exports.Module19 || (exports.Module19 = {}));
var Module20;
(function (Module20) {
    class Parent {
        constructor() {
            this.foo = 1;
        }
    }
    Module20.Parent = Parent;
})(Module20 = exports.Module20 || (exports.Module20 = {}));
var Module21;
(function (Module21) {
    class Parent {
        constructor(stub, arg1) {
            this.stub = stub;
            this.arg1 = arg1;
        }
        foo() {
            this.stub();
            return this.arg1;
        }
    }
    Module21.Parent = Parent;
})(Module21 = exports.Module21 || (exports.Module21 = {}));
var Module22;
(function (Module22) {
    class GrandParent {
        constructor(stub) {
            this.stub = stub;
        }
        foo() {
            this.stub();
            return 3;
        }
    }
    Module22.GrandParent = GrandParent;
    class Parent extends GrandParent {
        constructor(stub) {
            super(stub);
        }
    }
    Module22.Parent = Parent;
})(Module22 = exports.Module22 || (exports.Module22 = {}));
var Module23;
(function (Module23) {
    class Parent {
        static foo() {
            Module23.stub();
            return 3;
        }
    }
    Module23.Parent = Parent;
})(Module23 = exports.Module23 || (exports.Module23 = {}));
var Module24;
(function (Module24) {
    class Parent {
        constructor(stub, arg) {
            this.stub = stub;
            this.arg = arg;
        }
        foo(arg2, arg3) {
            this.stub();
            return this.arg + arg2 + arg3;
        }
    }
    Module24.Parent = Parent;
})(Module24 = exports.Module24 || (exports.Module24 = {}));
var Module25;
(function (Module25) {
    class Parent {
        constructor(stub, arg1) {
            this.stub = stub;
            this.arg1 = arg1;
        }
        foo(arg2, arg3) {
            this.stub();
            return this.arg1 + arg2 + arg3;
        }
    }
    Module25.Parent = Parent;
})(Module25 = exports.Module25 || (exports.Module25 = {}));
var Module26;
(function (Module26) {
    class GrandParent {
        constructor(stub, arg1) {
            this.stub = stub;
            this.arg1 = arg1;
        }
        foo(arg2, arg3) {
            this.stub();
            return this.arg1 + arg2 + arg3;
        }
    }
    Module26.GrandParent = GrandParent;
    class Parent extends GrandParent {
        constructor(stub, arg1) {
            super(stub, arg1);
        }
    }
    Module26.Parent = Parent;
})(Module26 = exports.Module26 || (exports.Module26 = {}));
var Module27;
(function (Module27) {
    class Parent {
        static foo(arg1, arg2) {
            Module27.stub();
            return 1 + arg1 + arg2;
        }
    }
    Module27.Parent = Parent;
})(Module27 = exports.Module27 || (exports.Module27 = {}));
var Module28;
(function (Module28) {
    class Parent {
        constructor(getStub, setStub) {
            this.getStub = getStub;
            this.setStub = setStub;
        }
        get foo() {
            this.getStub();
            return this._innerValue;
        }
        set foo(value) {
            this.setStub();
            this._innerValue = value;
        }
    }
    Module28.Parent = Parent;
})(Module28 = exports.Module28 || (exports.Module28 = {}));
var Module29;
(function (Module29) {
    class Parent {
        constructor(setStub) {
            this.setStub = setStub;
        }
        set foo(value) {
            this.setStub(value);
        }
    }
    Module29.Parent = Parent;
})(Module29 = exports.Module29 || (exports.Module29 = {}));
var Module30;
(function (Module30) {
    class Parent {
        static foo(arg1, arg2) {
            Module30.stub();
            return 1 + arg1 + arg2;
        }
    }
    Module30.Parent = Parent;
})(Module30 = exports.Module30 || (exports.Module30 = {}));
var Module31;
(function (Module31) {
    class GrandParent {
        constructor(getStub, setStub) {
            this.getStub = getStub;
            this.setStub = setStub;
            this._innerValue = 111;
        }
        get foo() {
            this.getStub();
            return this._innerValue;
        }
        set foo(value) {
            this.setStub();
            this._innerValue = value;
        }
    }
    Module31.GrandParent = GrandParent;
    class Parent extends GrandParent {
        constructor(getStub, setStub) {
            super(getStub, setStub);
        }
    }
    Module31.Parent = Parent;
})(Module31 = exports.Module31 || (exports.Module31 = {}));
var Module32;
(function (Module32) {
    class Parent {
        constructor(barStub, fooStub) {
            this.barStub = barStub;
            this.fooStub = fooStub;
        }
        bar(arg) {
            var result = 0;
            if (arg > 0)
                result = arg + this.foo(arg - 1);
            this.barStub();
            return result;
        }
        foo(arg) {
            var result = 0;
            if (arg > 0)
                result = arg + this.bar(arg - 1);
            this.fooStub();
            return result;
        }
    }
    Module32.Parent = Parent;
})(Module32 = exports.Module32 || (exports.Module32 = {}));
var Module33;
(function (Module33) {
    class Parent {
        constructor(barStub, fooStub) {
            this.barStub = barStub;
            this.fooStub = fooStub;
            this._foo = 3;
        }
        bar(arg) {
            var result = 0;
            if (arg > 0)
                result = this.foo + this.bar(arg - 1);
            this.barStub();
            return result;
        }
        get foo() {
            this.fooStub();
            return this._foo;
        }
    }
    Module33.Parent = Parent;
})(Module33 = exports.Module33 || (exports.Module33 = {}));
var Module34;
(function (Module34) {
    class Parent {
        static get foo() {
            Module34.getStub();
            return Parent._innerValue;
        }
        static set foo(value) {
            Module34.setStub();
            Parent._innerValue = value;
        }
    }
    Module34.Parent = Parent;
})(Module34 = exports.Module34 || (exports.Module34 = {}));
var Module35;
(function (Module35) {
    class Parent {
        static get bar() {
            Module35.getBarStub();
            return Parent._barValue + Parent.foo;
        }
        static set bar(value) {
            Module35.setBarStub();
            Parent._barValue = value;
        }
        static get foo() {
            Module35.getFooStub();
            return Parent._fooValue;
        }
        static set foo(value) {
            Module35.setFooStub();
            Parent.bar = value;
            Parent._fooValue = value;
        }
    }
    Module35.Parent = Parent;
})(Module35 = exports.Module35 || (exports.Module35 = {}));
var Module36;
(function (Module36) {
    class Parent {
        constructor(start) {
            this.start = start;
        }
        rec(value) {
            if (!value)
                return value;
            this.start = value;
            return value + this.rec(value - 1);
        }
    }
    Module36.Parent = Parent;
})(Module36 = exports.Module36 || (exports.Module36 = {}));
var Module37;
(function (Module37) {
    class Parent {
        constructor(start) {
            this.start = start;
        }
        get foo() {
            if (!this.start)
                return this.start;
            this.start--;
            return this.foo;
        }
        set foo(value) {
            if (!value)
                return;
            this.start = value;
            this.foo = value - 1;
        }
    }
    Module37.Parent = Parent;
})(Module37 = exports.Module37 || (exports.Module37 = {}));
var Module38;
(function (Module38) {
    class Parent {
        constructor(start) {
            this.start = start;
        }
        get foo() {
            return this.start;
        }
        set foo(value) {
            this.start = value;
        }
    }
    Module38.Parent = Parent;
})(Module38 = exports.Module38 || (exports.Module38 = {}));
var Module39;
(function (Module39) {
    class Parent {
        constructor(start) {
            this.start = start;
        }
        foo() {
            return this.start;
        }
    }
    Module39.Parent = Parent;
})(Module39 = exports.Module39 || (exports.Module39 = {}));
var Module40;
(function (Module40) {
    class Parent {
        constructor(start) {
            this.start = start;
        }
        foo(value) {
            return this.start = value;
        }
    }
    Module40.Parent = Parent;
})(Module40 = exports.Module40 || (exports.Module40 = {}));
var Module41;
(function (Module41) {
    class Parent {
        constructor(start) {
            this.start = start;
        }
        foo(value) {
            return this.start + value;
        }
    }
    Module41.Parent = Parent;
})(Module41 = exports.Module41 || (exports.Module41 = {}));
var Module42;
(function (Module42) {
    class Parent {
        foo(value) {
            return value;
        }
    }
    Module42.Parent = Parent;
    class Accumulator {
        constructor(start) {
            this.start = start;
        }
        add(value) {
            this.start += value;
        }
    }
    Module42.Accumulator = Accumulator;
})(Module42 = exports.Module42 || (exports.Module42 = {}));
//# sourceMappingURL=test-data-intercept.js.map