import * as typeioc from '@lib'

export const decorator = typeioc.decorator()

export class TestBase {
    public foo() {}
}

export class TestBase1 {
    public foo() {}
}

export class TestBase2 {
    public foo() {}
}

@decorator.provide<TestBase>(TestBase)
    .register()
export class Test extends TestBase {

    constructor() {
        super()
    }

    public foo() {
        return 'Test'
    }
}

@decorator.provide<TestBase1>(TestBase1)
    .register()
export class Test1 extends TestBase1 {

    constructor(private _value1: TestBase,
                @decorator
                .by(TestBase)
                .resolve() private _value2: TestBase) {
        super()
    }

    public foo() {
        return ['Test1', this._value1.foo(), this._value2.foo()].join(' ')
    }
}

@decorator.provide<TestBase2>(TestBase2)
    .register()
export class Test2 extends TestBase2 {

    constructor(@decorator
                .by(TestBase1)
                .resolve() private _value1: TestBase1,
                @decorator
                .by(TestBase)
                .resolve() private _value2: TestBase) {
        super()
    }

    public foo() {
        return ['Test2', this._value1.foo(), this._value2.foo()].join(' ')
    }
}
