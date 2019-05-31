export class Test1Base {
    public get Name(): string | null { return null }

    public set Name(_value: string | null) { }

    public get Disposed() : boolean {
        return false
    }
}

export class Test2Base {
    public get Name(): string | null { return null }
}

export class Test1 extends Test1Base {

    private name = 'test 1'

    public get Name(): string {
        return this.name
    }

    public set Name(value: string) {
        this.name = value
    }
}

export class Test2 extends Test2Base {

    private name = 'test 2'
    public get Name(): string {
        return this.name
    }
}

export class Test3 extends Test1Base {
    private test2: Test2

    public get Name(): string {

        let result = 'Test 3 '

        if (this.test2) {
            result += this.test2.Name
        }

        return result
    }

    constructor(test2 : Test2) {
        super()

        this.test2 = test2
    }
}

export class Test4 extends Test1Base{

    public get Name(): string {
        return this.name
    }

    public set Name(value: string) {
        this.name = value
    }

    constructor(private name: string) {
        super()
    }
}

export class Test5 extends  Test1Base {
    private _disposed = false

    public get Name(): string {
        return 'test 5'
    }

    public get Disposed(): boolean {
        return this._disposed
    }

    public dispose() {
        this._disposed = true
    }
}

export class Test6 {
    constructor() {

    }
}

export class Test7 extends Test1Base {

    constructor(private _base1 : Test1Base,
                private _base2 : Test2Base,
                private _test4 : Test4) {
        super()
    }

    public get Name() {
        return [this._base1.Name, this._base2.Name, this._test4.Name].join(' ')
    }
}

export class Initializable {
    public name = '---'
    public test6: Test6 | null = null

    public initialize(name: string) {
        this.name = name
    }
}

export class InitializableChild extends Initializable { }
