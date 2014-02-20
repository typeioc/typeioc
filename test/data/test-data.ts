
'use strict';

export class Test1Base {
    public get Name() { return null; }

    public get Disposed() : boolean {
        return false;
    }
}


export class Test2Base {
    public get Name() { return null; }
}

export class Test1 extends Test1Base {

    private name : string = "test 1";
    public get Name() : string {
        return this.name;
    }
}

export class Test2 extends Test2Base {

    private name : string = "test 2";
    public get Name() : string {
        return this.name;
    }
}

export class Test3 extends Test1Base{
    private test2 : Test2;

    public get Name() : string {

        var result = "Test 3 ";

        if(this.test2) {
            result += this.test2.Name;
        }

        return result;
    }

    constructor(test2 : Test2) {
        super();

        this.test2 = test2;
    }
}

export class Test4 extends Test1Base{

    private name : string;

    public get Name() : string {
        return this.name;
    }

    public set Name(value: string){
        this.name = value;
    }

    constructor(name : string) {
        super();

        this.name = name;
    }
}

export class Test5 extends  Test1Base {
    private name : string;
    private _disposed : boolean = false;

    public get Name() : string {
        return "test 5";
    }

    public get Disposed() : boolean {
        return this._disposed;
    }

    public Dispose() {
        this._disposed = true;
    }
}

export class Test6 {
    constructor() {

    }
}


export class Initializable {
    public name : string = "test name";
    public test6 : Test6 = null;

    public initialize(name : string) {
        this.name = name;
    }
}

export class Initializable2 extends Initializable {


}


export module TestModule1 {
    export class Test1 {
        public name = "test 1";

        constructor(name : string) {
            this.name = name;
        }

    }

    export class Test2 {
        public age(){
            return 0;
        }
    }

    export function testNoclass() {}

}


export module TestModule2 {
    export class Test1 {
        public name = "test 1";

        constructor(name : string) {
            this.name = name;
        }

    }

    export class Test3 {
        public age1() {
            return 0;
        }
    }

    export class Test4 {
        public age(){
            return 0;
        }

        public age1(){
            return 0;
        }
    }

    export function testNoclass() {}
}


export function TestNoClass() {};

