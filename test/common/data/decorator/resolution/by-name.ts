import * as typeioc from '@lib'

export const decorator = typeioc.decorator()

export class TestBase {
    public foo() {}
}

export class TestBase1 {
    public foo() {}
}

@decorator.provide(TestBase).register()
@decorator.provide(TestBase).named('Some name 1').register()
@decorator.provide(TestBase).named('Some name 2').register()
export class Test extends TestBase {

    public foo() {
        return 'Test'
    }
}

@decorator.provide(TestBase1).register()
export class Test1 extends TestBase1 {

    constructor(private value1: TestBase,
                @decorator.by().name('Some name 1').resolve()
                private value2: TestBase,
                @decorator.by().name('Some name 2').resolve()
                private value3: TestBase) {
        super()
    }

    public foo() {
        return ['Test1 :', this.value1.foo(), this.value2.foo(), this.value3.foo()].join(' ')
    }
}
