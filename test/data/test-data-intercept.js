'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Module1;
(function (Module1) {
    var Parent = (function () {
        function Parent(arg1, _stub) {
            this.arg1 = arg1;
            this._stub = _stub;
        }
        Parent.prototype.foo = function () {
            this._stub();
            return this.arg1;
        };
        return Parent;
    })();
    Module1.Parent = Parent;
})(Module1 = exports.Module1 || (exports.Module1 = {}));
var Module2;
(function (Module2) {
    var GrandParent = (function () {
        function GrandParent(arg1, _stub) {
            this.arg1 = arg1;
            this._stub = _stub;
        }
        GrandParent.prototype.foo = function () {
            this._stub();
            return this.arg1;
        };
        return GrandParent;
    })();
    Module2.GrandParent = GrandParent;
    var Parent = (function (_super) {
        __extends(Parent, _super);
        function Parent(arg1, stub) {
            _super.call(this, arg1, stub);
        }
        return Parent;
    })(GrandParent);
    Module2.Parent = Parent;
})(Module2 = exports.Module2 || (exports.Module2 = {}));
var Module3;
(function (Module3) {
    var _stub;
    function setStub(stub) {
        _stub = stub;
    }
    Module3.setStub = setStub;
    var Parent = (function () {
        function Parent() {
        }
        Parent.foo = function () {
            _stub();
            return 1;
        };
        return Parent;
    })();
    Module3.Parent = Parent;
})(Module3 = exports.Module3 || (exports.Module3 = {}));
var Module4;
(function (Module4) {
    var Parent = (function () {
        function Parent() {
            this.foo = 1;
        }
        Parent.prototype.getFoo = function () {
            return this.foo;
        };
        return Parent;
    })();
    Module4.Parent = Parent;
})(Module4 = exports.Module4 || (exports.Module4 = {}));
var Module5;
(function (Module5) {
    var Parent = (function () {
        function Parent() {
        }
        Parent.getFoo = function () {
            return Parent.foo;
        };
        Parent.foo = 1;
        return Parent;
    })();
    Module5.Parent = Parent;
})(Module5 = exports.Module5 || (exports.Module5 = {}));
var Module6;
(function (Module6) {
    var GrandParent = (function () {
        function GrandParent() {
            this.foo = 1;
        }
        return GrandParent;
    })();
    Module6.GrandParent = GrandParent;
    var Parent = (function (_super) {
        __extends(Parent, _super);
        function Parent() {
            _super.apply(this, arguments);
        }
        return Parent;
    })(GrandParent);
    Module6.Parent = Parent;
})(Module6 = exports.Module6 || (exports.Module6 = {}));
var Module7;
(function (Module7) {
    var Parent = (function () {
        function Parent(_foo, _stub) {
            this._foo = _foo;
            this._stub = _stub;
        }
        Object.defineProperty(Parent.prototype, "foo", {
            get: function () {
                this._stub();
                return this._foo;
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module7.Parent = Parent;
})(Module7 = exports.Module7 || (exports.Module7 = {}));
var Module8;
(function (Module8) {
    var Parent = (function () {
        function Parent(_stub) {
            this._stub = _stub;
        }
        Object.defineProperty(Parent.prototype, "foo", {
            set: function (value) {
                this._stub(value);
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module8.Parent = Parent;
})(Module8 = exports.Module8 || (exports.Module8 = {}));
var Module9;
(function (Module9) {
    var Parent = (function () {
        function Parent(_getStub, _setStub) {
            this._getStub = _getStub;
            this._setStub = _setStub;
        }
        Object.defineProperty(Parent.prototype, "foo", {
            get: function () {
                this._getStub();
                return this._innerValue;
            },
            set: function (value) {
                this._setStub(value);
                this._innerValue = value + 1;
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module9.Parent = Parent;
})(Module9 = exports.Module9 || (exports.Module9 = {}));
var Module10;
(function (Module10) {
    var _stub;
    function setStub(value) {
        _stub = value;
    }
    Module10.setStub = setStub;
    var Parent = (function () {
        function Parent() {
        }
        Object.defineProperty(Parent, "foo", {
            get: function () {
                _stub();
                return 1;
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module10.Parent = Parent;
})(Module10 = exports.Module10 || (exports.Module10 = {}));
var Module11;
(function (Module11) {
    var GrandParent = (function () {
        function GrandParent(_stub, value) {
            this._stub = _stub;
            this.innerValue = 333;
            this.innerValue = value;
        }
        Object.defineProperty(GrandParent.prototype, "foo", {
            get: function () {
                this._stub();
                return this.innerValue;
            },
            enumerable: true,
            configurable: true
        });
        return GrandParent;
    })();
    Module11.GrandParent = GrandParent;
    var Parent = (function (_super) {
        __extends(Parent, _super);
        function Parent(stub, value) {
            _super.call(this, stub, value);
        }
        return Parent;
    })(GrandParent);
    Module11.Parent = Parent;
})(Module11 = exports.Module11 || (exports.Module11 = {}));
var Module12;
(function (Module12) {
    var GrandParent = (function () {
        function GrandParent(getStub, setStub, value) {
            this.getStub = getStub;
            this.setStub = setStub;
            this._innerValue = 333;
            this._innerValue = value;
        }
        Object.defineProperty(GrandParent.prototype, "foo", {
            get: function () {
                this.getStub();
                return this._innerValue;
            },
            set: function (value) {
                this.setStub();
                this._innerValue = value;
            },
            enumerable: true,
            configurable: true
        });
        return GrandParent;
    })();
    Module12.GrandParent = GrandParent;
    var Parent = (function (_super) {
        __extends(Parent, _super);
        function Parent(getStub, setStub) {
            _super.call(this, getStub, setStub, 0);
        }
        return Parent;
    })(GrandParent);
    Module12.Parent = Parent;
})(Module12 = exports.Module12 || (exports.Module12 = {}));
var Module13;
(function (Module13) {
    var Parent = (function () {
        function Parent() {
        }
        Object.defineProperty(Parent, "foo", {
            get: function () {
                Module13.getStub();
                return this._innerValue;
            },
            set: function (value) {
                Module13.setStub();
                this._innerValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Parent._innerValue = 0;
        return Parent;
    })();
    Module13.Parent = Parent;
})(Module13 = exports.Module13 || (exports.Module13 = {}));
var Module14;
(function (Module14) {
    var Parent = (function () {
        function Parent(stub, arg1) {
            this.stub = stub;
            this.arg1 = arg1;
        }
        Parent.prototype.foo = function (arg1, arg2) {
            this.stub();
            return this.arg1 + arg1 + arg2;
        };
        return Parent;
    })();
    Module14.Parent = Parent;
})(Module14 = exports.Module14 || (exports.Module14 = {}));
var Module15;
(function (Module15) {
    var GrandParent = (function () {
        function GrandParent(stub) {
            this.stub = stub;
        }
        GrandParent.prototype.foo = function (arg1, arg2) {
            this.stub();
            return arg1 + arg2;
        };
        return GrandParent;
    })();
    Module15.GrandParent = GrandParent;
    var Parent = (function (_super) {
        __extends(Parent, _super);
        function Parent(stub) {
            _super.call(this, stub);
        }
        return Parent;
    })(GrandParent);
    Module15.Parent = Parent;
})(Module15 = exports.Module15 || (exports.Module15 = {}));
var Module16;
(function (Module16) {
    var Parent = (function () {
        function Parent() {
        }
        Parent.foo = function (arg1, arg2) {
            Module16.stub();
            return arg1 + arg2;
        };
        return Parent;
    })();
    Module16.Parent = Parent;
})(Module16 = exports.Module16 || (exports.Module16 = {}));
var Module17;
(function (Module17) {
    var Parent = (function () {
        function Parent(barStub, fooStub) {
            this.barStub = barStub;
            this.fooStub = fooStub;
        }
        Parent.prototype.bar = function (arg) {
            var result = 0;
            if (arg > 0)
                result = arg + this.foo(arg - 1);
            this.barStub();
            return result;
        };
        Parent.prototype.foo = function (arg) {
            var result = 0;
            if (arg > 0)
                result = arg + this.bar(arg - 1);
            this.fooStub();
            return result;
        };
        return Parent;
    })();
    Module17.Parent = Parent;
})(Module17 = exports.Module17 || (exports.Module17 = {}));
var Module18;
(function (Module18) {
    var Parent = (function () {
        function Parent(stub) {
            this.stub = stub;
            this.bar = 1;
        }
        Parent.prototype.foo = function (arg) {
            var result = 0;
            if (arg > this.bar)
                result = arg + this.foo(arg - 1);
            this.stub();
            return result;
        };
        return Parent;
    })();
    Module18.Parent = Parent;
})(Module18 = exports.Module18 || (exports.Module18 = {}));
var Module19;
(function (Module19) {
    var Parent = (function () {
        function Parent(getStub, setStub, fooStub) {
            this.getStub = getStub;
            this.setStub = setStub;
            this.fooStub = fooStub;
            this._innerValue = 5;
        }
        Object.defineProperty(Parent.prototype, "prop", {
            get: function () {
                this.getStub();
                return this._innerValue;
            },
            set: function (value) {
                this.setStub();
                this._innerValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Parent.prototype.foo = function () {
            var result = 0;
            if (this.prop > 0) {
                this.prop = this.prop - 1;
                result = this.prop + this.foo();
            }
            this.fooStub();
            return result;
        };
        return Parent;
    })();
    Module19.Parent = Parent;
})(Module19 = exports.Module19 || (exports.Module19 = {}));
var Module20;
(function (Module20) {
    var Parent = (function () {
        function Parent() {
            this.foo = 1;
        }
        return Parent;
    })();
    Module20.Parent = Parent;
})(Module20 = exports.Module20 || (exports.Module20 = {}));
var Module21;
(function (Module21) {
    var Parent = (function () {
        function Parent(stub, arg1) {
            this.stub = stub;
            this.arg1 = arg1;
        }
        Parent.prototype.foo = function () {
            this.stub();
            return this.arg1;
        };
        return Parent;
    })();
    Module21.Parent = Parent;
})(Module21 = exports.Module21 || (exports.Module21 = {}));
var Module22;
(function (Module22) {
    var GrandParent = (function () {
        function GrandParent(stub) {
            this.stub = stub;
        }
        GrandParent.prototype.foo = function () {
            this.stub();
            return 3;
        };
        return GrandParent;
    })();
    Module22.GrandParent = GrandParent;
    var Parent = (function (_super) {
        __extends(Parent, _super);
        function Parent(stub) {
            _super.call(this, stub);
        }
        return Parent;
    })(GrandParent);
    Module22.Parent = Parent;
})(Module22 = exports.Module22 || (exports.Module22 = {}));
var Module23;
(function (Module23) {
    var Parent = (function () {
        function Parent() {
        }
        Parent.foo = function () {
            Module23.stub();
            return 3;
        };
        return Parent;
    })();
    Module23.Parent = Parent;
})(Module23 = exports.Module23 || (exports.Module23 = {}));
var Module24;
(function (Module24) {
    var Parent = (function () {
        function Parent(stub, arg) {
            this.stub = stub;
            this.arg = arg;
        }
        Parent.prototype.foo = function (arg2, arg3) {
            this.stub();
            return this.arg + arg2 + arg3;
        };
        return Parent;
    })();
    Module24.Parent = Parent;
})(Module24 = exports.Module24 || (exports.Module24 = {}));
var Module25;
(function (Module25) {
    var Parent = (function () {
        function Parent(stub, arg1) {
            this.stub = stub;
            this.arg1 = arg1;
        }
        Parent.prototype.foo = function (arg2, arg3) {
            this.stub();
            return this.arg1 + arg2 + arg3;
        };
        return Parent;
    })();
    Module25.Parent = Parent;
})(Module25 = exports.Module25 || (exports.Module25 = {}));
var Module26;
(function (Module26) {
    var GrandParent = (function () {
        function GrandParent(stub, arg1) {
            this.stub = stub;
            this.arg1 = arg1;
        }
        GrandParent.prototype.foo = function (arg2, arg3) {
            this.stub();
            return this.arg1 + arg2 + arg3;
        };
        return GrandParent;
    })();
    Module26.GrandParent = GrandParent;
    var Parent = (function (_super) {
        __extends(Parent, _super);
        function Parent(stub, arg1) {
            _super.call(this, stub, arg1);
        }
        return Parent;
    })(GrandParent);
    Module26.Parent = Parent;
})(Module26 = exports.Module26 || (exports.Module26 = {}));
var Module27;
(function (Module27) {
    var Parent = (function () {
        function Parent() {
        }
        Parent.foo = function (arg1, arg2) {
            Module27.stub();
            return 1 + arg1 + arg2;
        };
        return Parent;
    })();
    Module27.Parent = Parent;
})(Module27 = exports.Module27 || (exports.Module27 = {}));
var Module28;
(function (Module28) {
    var Parent = (function () {
        function Parent(getStub, setStub) {
            this.getStub = getStub;
            this.setStub = setStub;
        }
        Object.defineProperty(Parent.prototype, "foo", {
            get: function () {
                this.getStub();
                return this._innerValue;
            },
            set: function (value) {
                this.setStub();
                this._innerValue = value;
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module28.Parent = Parent;
})(Module28 = exports.Module28 || (exports.Module28 = {}));
var Module29;
(function (Module29) {
    var Parent = (function () {
        function Parent(setStub) {
            this.setStub = setStub;
        }
        Object.defineProperty(Parent.prototype, "foo", {
            set: function (value) {
                this.setStub(value);
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module29.Parent = Parent;
})(Module29 = exports.Module29 || (exports.Module29 = {}));
var Module30;
(function (Module30) {
    var Parent = (function () {
        function Parent() {
        }
        Parent.foo = function (arg1, arg2) {
            Module30.stub();
            return 1 + arg1 + arg2;
        };
        return Parent;
    })();
    Module30.Parent = Parent;
})(Module30 = exports.Module30 || (exports.Module30 = {}));
var Module31;
(function (Module31) {
    var GrandParent = (function () {
        function GrandParent(getStub, setStub) {
            this.getStub = getStub;
            this.setStub = setStub;
            this._innerValue = 111;
        }
        Object.defineProperty(GrandParent.prototype, "foo", {
            get: function () {
                this.getStub();
                return this._innerValue;
            },
            set: function (value) {
                this.setStub();
                this._innerValue = value;
            },
            enumerable: true,
            configurable: true
        });
        return GrandParent;
    })();
    Module31.GrandParent = GrandParent;
    var Parent = (function (_super) {
        __extends(Parent, _super);
        function Parent(getStub, setStub) {
            _super.call(this, getStub, setStub);
        }
        return Parent;
    })(GrandParent);
    Module31.Parent = Parent;
})(Module31 = exports.Module31 || (exports.Module31 = {}));
var Module32;
(function (Module32) {
    var Parent = (function () {
        function Parent(barStub, fooStub) {
            this.barStub = barStub;
            this.fooStub = fooStub;
        }
        Parent.prototype.bar = function (arg) {
            var result = 0;
            if (arg > 0)
                result = arg + this.foo(arg - 1);
            this.barStub();
            return result;
        };
        Parent.prototype.foo = function (arg) {
            var result = 0;
            if (arg > 0)
                result = arg + this.bar(arg - 1);
            this.fooStub();
            return result;
        };
        return Parent;
    })();
    Module32.Parent = Parent;
})(Module32 = exports.Module32 || (exports.Module32 = {}));
var Module33;
(function (Module33) {
    var Parent = (function () {
        function Parent(barStub, fooStub) {
            this.barStub = barStub;
            this.fooStub = fooStub;
            this._foo = 3;
        }
        Parent.prototype.bar = function (arg) {
            var result = 0;
            if (arg > 0)
                result = this.foo + this.bar(arg - 1);
            this.barStub();
            return result;
        };
        Object.defineProperty(Parent.prototype, "foo", {
            get: function () {
                this.fooStub();
                return this._foo;
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module33.Parent = Parent;
})(Module33 = exports.Module33 || (exports.Module33 = {}));
var Module34;
(function (Module34) {
    var Parent = (function () {
        function Parent() {
        }
        Object.defineProperty(Parent, "foo", {
            get: function () {
                Module34.getStub();
                return Parent._innerValue;
            },
            set: function (value) {
                Module34.setStub();
                Parent._innerValue = value;
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module34.Parent = Parent;
})(Module34 = exports.Module34 || (exports.Module34 = {}));
var Module35;
(function (Module35) {
    var Parent = (function () {
        function Parent() {
        }
        Object.defineProperty(Parent, "bar", {
            get: function () {
                Module35.getBarStub();
                return Parent._barValue + Parent.foo;
            },
            set: function (value) {
                Module35.setBarStub();
                Parent._barValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Parent, "foo", {
            get: function () {
                Module35.getFooStub();
                return Parent._fooValue;
            },
            set: function (value) {
                Module35.setFooStub();
                Parent.bar = value;
                Parent._fooValue = value;
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module35.Parent = Parent;
})(Module35 = exports.Module35 || (exports.Module35 = {}));
var Module36;
(function (Module36) {
    var Parent = (function () {
        function Parent(start) {
            this.start = start;
        }
        Parent.prototype.rec = function (value) {
            if (!value)
                return value;
            this.start = value;
            return value + this.rec(value - 1);
        };
        return Parent;
    })();
    Module36.Parent = Parent;
})(Module36 = exports.Module36 || (exports.Module36 = {}));
var Module37;
(function (Module37) {
    var Parent = (function () {
        function Parent(start) {
            this.start = start;
        }
        Object.defineProperty(Parent.prototype, "foo", {
            get: function () {
                if (!this.start)
                    return this.start;
                this.start--;
                return this.foo;
            },
            set: function (value) {
                if (!value)
                    return;
                this.start = value;
                this.foo = value - 1;
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module37.Parent = Parent;
})(Module37 = exports.Module37 || (exports.Module37 = {}));
var Module38;
(function (Module38) {
    var Parent = (function () {
        function Parent(start) {
            this.start = start;
        }
        Object.defineProperty(Parent.prototype, "foo", {
            get: function () {
                return this.start;
            },
            set: function (value) {
                this.start = value;
            },
            enumerable: true,
            configurable: true
        });
        return Parent;
    })();
    Module38.Parent = Parent;
})(Module38 = exports.Module38 || (exports.Module38 = {}));
var Module39;
(function (Module39) {
    var Parent = (function () {
        function Parent(start) {
            this.start = start;
        }
        Parent.prototype.foo = function () {
            return this.start;
        };
        return Parent;
    })();
    Module39.Parent = Parent;
})(Module39 = exports.Module39 || (exports.Module39 = {}));
var Module40;
(function (Module40) {
    var Parent = (function () {
        function Parent(start) {
            this.start = start;
        }
        Parent.prototype.foo = function (value) {
            return this.start = value;
        };
        return Parent;
    })();
    Module40.Parent = Parent;
})(Module40 = exports.Module40 || (exports.Module40 = {}));
var Module41;
(function (Module41) {
    var Parent = (function () {
        function Parent(start) {
            this.start = start;
        }
        Parent.prototype.foo = function (value) {
            return this.start + value;
        };
        return Parent;
    })();
    Module41.Parent = Parent;
})(Module41 = exports.Module41 || (exports.Module41 = {}));
var Module42;
(function (Module42) {
    var Parent = (function () {
        function Parent() {
        }
        Parent.prototype.foo = function (value) {
            return value;
        };
        return Parent;
    })();
    Module42.Parent = Parent;
    var Accumulator = (function () {
        function Accumulator(start) {
            this.start = start;
        }
        Accumulator.prototype.add = function (value) {
            this.start += value;
        };
        return Accumulator;
    })();
    Module42.Accumulator = Accumulator;
})(Module42 = exports.Module42 || (exports.Module42 = {}));
//# sourceMappingURL=test-data-intercept.js.map