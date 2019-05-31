import typeioc from '@lib'

export const decorator = typeioc.createDecorator()

export class TestBase {
    public foo() { }
}

@decorator.provide<TestBase>(TestBase)
    .named('Some name')
    .register()
export class Test extends TestBase {
    public text: string = 'test'

    public foo() {
        return `Test : foo ${this.text}`
    }
}

@decorator.provide<TestBase>(TestBase)
    .named('Some name 2')
    .register()
export class Test2 extends TestBase {
    public text: string = 'test'

    public foo() {
        return `Test2 : foo ${this.text}`
    }
}
