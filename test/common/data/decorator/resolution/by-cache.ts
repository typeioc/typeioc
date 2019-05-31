import typeioc from '@lib'

export const decorator = typeioc.createDecorator()

export class TestBase {
    public foo() {}
}

export class TestBase1 {
    public foo() {}
}

@decorator.provide<TestBase>(TestBase).register()
export class Test extends TestBase {

    public foo() {
        return 'Test'
    }
}

@decorator.provide<TestBase1>(TestBase1).register()
export class Test1 extends TestBase1 {

    constructor(@decorator.by().cache().resolve() private value: TestBase) {
        super()
    }

    public foo() {
        return ['Test1 :', this.value.foo()].join(' ')
    }
}
