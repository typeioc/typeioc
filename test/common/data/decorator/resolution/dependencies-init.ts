import * as typeioc from '@lib'

export const decorator = typeioc.decorator()

export class TestBase {
    public foo() {}
}

@decorator.provide<TestBase>(TestBase)
    .initializeBy((_c, item) => {
        item.foo = function () { return 'Initialized' }
        return item
    })
    .register()
export class Test extends TestBase{

    public foo() {
        return 'Test'
    }
}

@decorator.provide('some TestInit').register()
export class TestInit {

    constructor(@decorator.by().resolve() private arg1: TestBase) {}

    public foo() {
        return ['Test', this.arg1.foo()].join(' ')
    }
}

export class TestDep extends TestBase {
    constructor() {
        super()
    }

    public foo() {
        return 'dependency'
    }
}
