import * as typeioc from '@lib'

export const decorator = typeioc.decorator()

export class TestBase {
    public foo() {
    }
}

export class TestBase1 {
    public foo1() {
    }
}

export class TestBase2 {
    public foo2() {
    }
}

@decorator.provide(TestBase).register()
export class Test extends TestBase {

    public foo() {
        return 'Test : foo'
    }
}

@decorator.provide(TestBase1).register()
export class Test1 implements TestBase1 {

    constructor(private testBase: TestBase) {}

    public foo1() {

        return `${this.testBase.foo()} : foo1`
    }
}

@decorator.provide(TestBase2).register()
export class Test2 implements TestBase2 {

    constructor(private testBase : TestBase, private testBase1 : TestBase1) {}

    public foo2() {

        return [this.testBase.foo(), this.testBase1.foo1(), 'foo2'].join(' | ')
    }
}
