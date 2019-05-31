import typeioc from '@lib'

export const decorator = typeioc.createDecorator()

export class TestBase {
    public foo() {}
}

export class TestBase1 {
    public foo() {}
}

@decorator.provide(TestBase).register()
export class TestInit {

    constructor(@decorator.by(TestBase1).resolve() private arg1: TestBase1) { }

    public foo() {
        return ['Test', this.arg1.foo()].join(' ')
    }
}

export class TestDep extends TestBase1 {
    constructor() {
        super()
    }

    public foo() {
        return 'dependency'
    }
}
