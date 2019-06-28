import typeioc, { scope } from '@lib'

export const decorator = typeioc.createDecorator()

export class TestBase {
    public foo() { }
}

@decorator.provide<TestBase>(TestBase)
    .within(scope.none)
    .register()
export class Test extends TestBase {

    public text: string = ' test none'

    public foo() {
        return `Test : foo${this.text}`
    }
}

@decorator.provide<TestBase>('None')
    .transient()
    .register()
export class TestNone extends TestBase {

    public text: string = ' test none'

    public foo() {
        return `Test : foo${this.text}`
    }
}

export class TestBase2 {

    public foo() { }
}

@decorator.provide<TestBase2>(TestBase2)
    .within(scope.container)
    .register()
export class Test2 extends TestBase2 {
    public text : string = ' test Container'

    public foo() {
        return `Test : foo${this.text}`
    }
}

@decorator.provide<TestBase2>('Container')
    .instancePerContainer()
    .register()
export class Test2Container extends TestBase2 {
    public text: string = ' test Container'

    public foo() {
        return `Test : foo${this.text}`
    }
}

export class TestBase3 {
    public foo() { }
}

@decorator.provide<TestBase3>(TestBase3)
    .within(scope.hierarchy)
    .register()
export class Test3 extends TestBase3 {
    public text: string = ' test Hierarchy'

    public foo() {
        return `Test : foo${this.text}`
    }
}

@decorator.provide<TestBase2>('Single')
    .singleton()
    .register()
export class Test3Single extends TestBase3 {
    public text: string = ' test Hierarchy'

    public foo() {
        return `Test : foo${this.text}`
    }
}
