import typeioc from '@lib'

export const decorator = typeioc.createDecorator()

export class TestBase {
    public foo() {}
}

@decorator.provide(TestBase).register()
export class Test extends TestBase {

    constructor(@decorator.by('dependency').resolve() private _arg1: TestBase) {
        super()
    }

    public foo() {
        return ['Test', this._arg1.foo()].join(' ')
    }
}

@decorator.provide('dependency').register()
export class Test1 {

    public foo() {
        return 'Test1'
    }
}
