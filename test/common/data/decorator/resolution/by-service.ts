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

@decorator.provide<TestBase>(TestBase).register()
export class Test extends TestBase {

    public foo() {
        return 'Test'
    }
}

@decorator.provide<TestBase2>(TestBase2).register()
export class Test2 extends TestBase2 {

    public foo(): string {
        return 'Test2'
    }
}

@decorator.provide<TestBase1>(TestBase1).register()
    export class Test1 extends TestBase1 {

    constructor(private value111: TestBase,
                @decorator.by(TestBase2).resolve() private value222: TestBase2,
                @decorator.by(TestBase).resolve()  private value333: TestBase) {
        super()
    }

    public foo() {
        return ['Test1 :', this.value111.foo(), this.value222.foo(), this.value333.foo()].join(' ')
    }
}
