import * as typeioc from '@lib'

export const decorator = typeioc.decorator()
export const decorator2 = typeioc.decorator()

export class TestBase {
    public foo() {}
}

export class TestBase1 {
    public foo() {}
}

export class TestBase2 {
    public foo() {}
}

@decorator.provide(TestBase).register()
@decorator2.provide(TestBase).register()
export class Test extends TestBase{
    public foo() {
        return 'Test'
    }
}

@decorator.provide(TestBase1).register()
@decorator2.provide(TestBase1).register()
export class Test1 extends TestBase1 {

    constructor(@decorator.by().resolve() @decorator2.by().resolve() private _arg1: TestBase,
                @decorator.by('decorator').resolve()
                @decorator2.by('decorator 2').resolve() private _arg2: TestBase2,
                private _arg3 : TestBase2) {
        super()
    }

    public foo() {
        return ['Test 1 ', this._arg1.foo(), this._arg2.foo(), this._arg3.foo()].join(' ')
    }
}

@decorator.provide('decorator').register()
@decorator2.provide('decorator 2').register()
export class Test2 extends TestBase2 {
    public foo() {
        return 'Test2'
    }
}

@decorator.provide(TestBase2).register()
@decorator2.provide(TestBase2).register()
export class Test3 extends TestBase2 {
    public foo() {
        return 'Test3'
    }
}
