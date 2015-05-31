
'use strict';

export module Module1 {
    export class Parent {

        constructor(private arg1 : number, private _stub : Function) { }

        public foo () {

            this._stub();
            return this.arg1;
        }
    }
}

export module Module2 {

    export class GrandParent {

        constructor(private arg1 : number, private _stub : Function) { }

        public foo () {
            this._stub();
            return this.arg1;
        }
    }

    export class Parent extends GrandParent {

        constructor(arg1 : number, stub : Function) {

            super(arg1, stub);
        }
    }
}

export module Module3 {

    var _stub : Function;

    export function setStub(stub : Function) {
        _stub = stub;
    }

    export class Parent {
        public static foo() {

            _stub();

            return 1;
        }
    }
}

export module Module4 {

    export class Parent {
        public foo : number = 1;

        public getFoo() {
            return this.foo;
        }
    }
}

export module Module5 {

    export class Parent {
        public static foo : number = 1;

        public static getFoo() {
            return Parent.foo;
        }
    }

}

export module Module6 {

    export class GrandParent {

        public foo = 1;
    }

    export class Parent extends GrandParent {

    }
}

export module Module7 {

    export class Parent {

        public get foo() {
            this._stub();
            return this._foo;
        }

        constructor(private _foo : number, private _stub : Function) { }
    }
}

export module Module8 {

    export class Parent {

        public set foo(value : number) {
            this._stub(value);
        }

        constructor(private _stub : Function) { }
    }
}

export module Module9 {

    export class Parent {

        private _innerValue : number;

        public get foo() : number {
            this._getStub();
            return this._innerValue;
        }

        public set foo(value : number) {
            this._setStub(value);
            this._innerValue = value + 1;
        }

        constructor(private _getStub : Function, private _setStub : Function) { }
    }
}

export module Module10 {

    var _stub : Function;

    export function setStub(value : Function) {
        _stub = value;
    }

    export class Parent {

        public static get foo() {

            _stub();
            return 1;
        }
    }
}

export module Module11 {

    export class GrandParent {
        private innerValue = 333;

        public get foo() {

            this._stub();
            return this.innerValue;
        }

        constructor(private _stub : Function, value : number) {
            this.innerValue = value;
        }
    }

    export class Parent extends GrandParent {

        constructor(stub : Function, value : number) {
            super(stub, value);
        }
    }
}

export module Module12 {

    export class GrandParent {

        private _innerValue = 333;

        public get foo() {
            this.getStub()
            return this._innerValue;
        }

        public set foo(value : number) {
            this.setStub();
            this._innerValue = value;
        }

        constructor(private getStub : Function, private setStub : Function, value : number) {
            this._innerValue = value;
        }
    }

    export class Parent extends GrandParent {
        constructor(getStub : Function, setStub : Function) {

            super(getStub, setStub, 0);
        }
    }
}

export module Module13 {

    export var getStub : Function;
    export var setStub : Function;

    export class Parent {
        private static _innerValue = 0;

        public  static get foo() {
            getStub();
            return this._innerValue;
        }

        public static set foo(value: number) {
            setStub()
            this._innerValue = value;
        }
    }
}

export module Module14 {

    export class Parent {

        public foo(arg1 : number, arg2: number)
        {
            this.stub();
            return this.arg1 + arg1 + arg2;
        }

        constructor(private stub : Function, private arg1 : number) {}
    }
}

export module Module15 {

    export class GrandParent {
        public foo(arg1, arg2) {
            this.stub();
            return arg1 + arg2;
        }

        constructor(private stub : Function) {}
    }

    export class Parent extends GrandParent {
        constructor(stub) {
            super(stub)
        }
    }
}

export module Module16 {

    export var stub: Function;

    export class Parent {

        public static foo(arg1, arg2) {
            stub();
            return arg1 + arg2;
        }

    }

}

export module Module17 {

    export class Parent {

        constructor(private barStub : Function, private fooStub : Function) { }

        public bar(arg : number) {
            var result = 0;

            if(arg > 0)
                result = arg+ this.foo(arg - 1);

            this.barStub();
            return result;
        }

        public foo(arg : number){
            var result = 0;

            if(arg > 0)
                result = arg+ this.bar(arg - 1);

            this.fooStub();
            return result;
        }
    }
}

export module Module18 {

    export class Parent {

        private bar : number = 1;

        public foo (arg) {

            var result = 0;

            if(arg > this.bar)
                result = arg+ this.foo(arg - 1);

            this.stub();
            return result;
        }

        constructor(private stub : Function) {}
    }
}

export module Module19 {

    export class Parent {

        private _innerValue : number = 5;

        public get prop() : number {

            this.getStub();
            return this._innerValue;
        }

        public set prop(value : number) {

            this.setStub();
            this._innerValue = value;
        }

        constructor(private getStub : Function, private setStub, private fooStub : Function) {}

        public foo() {
            var result = 0;

            if(this.prop > 0) {
                this.prop = this.prop - 1;
                result = this.prop + this.foo();
            }

            this.fooStub();
            return result;
        }
    }
}

export module Module20 {

    export class Parent {

        public foo : number = 1;
    }
}

export module Module21 {

    export class Parent {

        constructor(private stub : Function, private arg1 : number) {}

        public foo() {

            this.stub();
            return this.arg1;
        }
    }
}

export module Module22 {

    export class GrandParent {

        constructor(private stub : Function) {}

        public foo() {
            this.stub();
            return 3;
        }
    }

    export class Parent extends GrandParent {

        constructor(stub : Function) {
            super(stub);
        }
    }
}

export module Module23 {

    export var stub:Function;


    export class Parent {
        public static foo() {
            stub();
            return 3;
        }
    }
}

export module Module24 {

    export class Parent {

        constructor(private stub : Function, private arg) {}

        public foo(arg2, arg3) {
            this.stub();
            return this.arg + arg2 + arg3;
        }
    }
}

export module Module25 {

    export class Parent {

        constructor(private stub : Function, private arg1 : number) {}

        public foo(arg2, arg3) {
            this.stub();

            return this.arg1 + arg2 + arg3;
        }
    }
}

export module Module26 {

    export class GrandParent {

        constructor(private stub : Function, private arg1 : number) { }

        public foo(arg2, arg3) {

            this.stub();
            return this.arg1 + arg2 + arg3;
        }
    }

    export class Parent extends GrandParent {

        constructor(stub, arg1) {
            super(stub, arg1);
        }
    }
}

export module Module27 {

    export var stub : Function;

    export class Parent {

        public static foo(arg1, arg2) {

            stub();

            return 1 + arg1 + arg2;

        }
    }
}

export module Module28 {

    export class Parent {
        private _innerValue : number;

        public get foo() {

            this.getStub();

            return this._innerValue;
        }

        public set foo(value : number) {

            this.setStub();
            this._innerValue = value;
        }

        constructor(private getStub : Function, private setStub : Function) {}
    }
}

export module Module29 {

    export class Parent {

        public set foo(value) {
            this.setStub(value);
        }

        constructor(private setStub : Function) {}
    }
}

export module Module30 {

    export var stub : Function;

    export class Parent {

        public static foo(arg1, arg2) {
            stub();

            return 1 + arg1 + arg2;
        }
    }
}

export module Module31 {

    export class GrandParent {

        private _innerValue : number = 111;

        public get foo() {

            this.getStub();
            return this._innerValue;
        }

        public set foo(value : number) {

            this.setStub();
            this._innerValue = value;
        }

        constructor(private getStub : Function, private setStub : Function) { }
    }

    export class Parent extends GrandParent {

        constructor(getStub : Function, setStub : Function) {
            super(getStub, setStub);
        }
    }
}

export module Module32 {

    export class Parent {

        constructor(private barStub : Function, private fooStub : Function) { }

        public bar(arg) {
            var result = 0;

            if(arg > 0)
                result = arg+ this.foo(arg - 1);

            this.barStub();
            return result;
        }

        public foo(arg){

            var result = 0;

            if(arg > 0)
                result = arg+ this.bar(arg - 1);

            this.fooStub();
            return result;
        }
    }
}

export module Module33 {

    export class Parent {

        private _foo = 3;

        public bar(arg) {
            var result = 0;

            if(arg > 0)
                result = this.foo + this.bar(arg - 1);

            this.barStub();
            return result;
        }

        public get foo() {
            this.fooStub();

            return this._foo;
     }

        constructor(private barStub : Function, private fooStub : Function) { }
    }
}

export module Module34 {

    export var getStub : Function;
    export var setStub : Function;

    export class Parent {

        private static _innerValue : number;

        public static get foo() {

            getStub();

            return Parent._innerValue;
        }

        public static set foo(value : number) {

            setStub();

            Parent._innerValue = value;
        }
    }
}

export module Module35 {

    export var getBarStub, setBarStub, getFooStub, setFooStub;

    export class Parent {

        private static _barValue;
        private static _fooValue;

        public static get bar() {
            getBarStub();
            return Parent._barValue + Parent.foo;
        }

        public static set bar(value) {
            setBarStub();
            Parent._barValue = value;
        }

        public static get foo() {
            getFooStub();
            return Parent._fooValue;
        }

        public static set foo(value) {
            setFooStub();
            Parent.bar = value;
            Parent._fooValue = value;
        }
    }
}

export module Module36 {

    export class Parent {

        constructor(public start) { }

        public rec(value : number) {

            if(!value) return value;

            this.start = value;

            return value + this.rec(value - 1);
        }

    }
}

export module Module37 {

    export class Parent {

        public get foo() {
            if(!this.start) return this.start;

            this.start--;

            return this.foo;
        }

        public set foo(value) {
            if(!value) return;

            this.start = value;

            this.foo = value - 1;
        }

        constructor(public start) {}
    }
}

export module Module38 {

    export class Parent {

        public get foo() {
            return this.start;
        }

        public set foo(value) {
            this.start = value;
        }

        constructor(public start) {}
    }
}

export module Module39 {

    export class Parent {

        constructor(private start){}

        public foo() {
            return this.start;
        }
    }
}

export module Module40 {

    export class Parent {

        constructor(public start){}

        public foo(value) {
            return this.start = value;
        }
    }
}

export module Module41 {

    export class Parent {

        constructor(public start){}

        public foo(value) {
            return this.start + value;
        }
    }
}

export module Module42 {

    export class Parent {
        public foo(value) {
            return value;
        }
    }

    export class Accumulator {
        constructor(public start) {}

        public add(value) {
            this.start+= value;
        }
    }


}