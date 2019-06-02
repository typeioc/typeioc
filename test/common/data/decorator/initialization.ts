import typeioc from '@lib'

export const decorator = typeioc.createDecorator()
const interceptor = typeioc.createInterceptor()

export class TestBase {
    public foo() {
    }
}

export class TestBase1 {
    public foo() {
    }
}

@decorator.provide(TestBase)
    .initializeBy((_c, item) => {
        (item as Test2).text = 'foo 2'
        return item
    })
    .register()
export class Test2 extends TestBase {

    public text: string | null = null

    public foo() {
        return `Test : foo ${this.text}`
    }
}

@decorator.provide<Test3>(TestBase1)
    .initializeBy((_c, item) => {
        item.text = 'foo 3'
        item = interceptor.interceptInstance(item, {
            method: 'foo',
            wrapper() {
                return `${(this as any).text} interceptor`
            }
        })

        return item
    })
    .register()
export class Test3 extends TestBase1 {
    public text: string | null = null

    public foo() {
        return `Test : foo ${this.text}`
    }
}