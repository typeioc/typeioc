import typeioc from '@lib'

export const decorator = typeioc.createDecorator()

export class TestBase {
    public foo() {}
}

export class TestBase1 {
    public foo() {}
}

@decorator.provide<TestBase>(TestBase)
    .named('Some test name').register()
export class Test extends TestBase {

    constructor(private arg1: string, private arg2: string) {
        super()
    }

    public foo() {
        return ['Test', this.arg1, this.arg2].join(' ')
    }
}

@decorator.provide<TestBase1>(TestBase1).register()
export class Test1 extends TestBase1 {
    constructor(
        @decorator.by()
        .name('Some test name')
        .resolve() private arg1: TestBase) {
        super()
    }

    public foo() {
        return ['Test', this.arg1.foo()].join(' ')
    }
}

export class TestDep extends TestBase {
    constructor() {
        super()
    }

    public foo() {
        return 'dependency Some test name'
    }
}
