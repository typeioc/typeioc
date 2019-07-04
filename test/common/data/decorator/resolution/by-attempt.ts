import * as typeioc from '@lib'

export const decorator = typeioc.decorator()

export class TestBase {
    public foo() {}
}

export class TestBase1 {
    public foo1() {}
}

@decorator.provide(TestBase1).register()
export class Test1 extends TestBase1 {
    public foo1() {
        return 'Test1'
    }
}

@decorator.provide<TestBase>(TestBase).register()
export class Test extends TestBase {

    public foo() {
        return `Test${(this.value1 || ' no value ')}${this.value2.foo1()}`
    }

    constructor(@decorator.by().attempt().resolve() private value1: string,
                @decorator.by().attempt().resolve() private value2: TestBase1) {
        super()
    }
}
