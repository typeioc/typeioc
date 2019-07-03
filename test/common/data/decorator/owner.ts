import typeioc from '@lib'

export const decorator = typeioc.createDecorator()

export class TestBase1 {
    public foo() { }
    public dispose() {}
}

@decorator.provide<TestBase1>(TestBase1)
    .dispose((item) => { item.dispose() })
    .register()
export class Test extends TestBase1 {
    public text: string = 'test'

    public foo() {
        return `Test : foo ${this.text}`
    }

    public dispose() {
        this.text = 'disposed'
    }
}

export class TestBase2 {
    public foo() { }
    public dispose() {}
}

@decorator.provide<TestBase2>(TestBase2)
    .dispose((item: TestBase2) => { item.dispose() })
    .register()
export class Test2 extends TestBase2 {
    public text: string = 'test'

    public foo() {
        return `Test : foo ${this.text}`
    }

    public dispose() {
        this.text = 'disposed'
    }
}

// -------------------------

export class TestBase1Api {
    public foo() { }
    public dispose() {}
}

@decorator.provide<TestBase1Api>(TestBase1Api)
    .dispose((item) => { item.dispose() })
    .register()
export class TestApi extends TestBase1Api {
    public text: string = 'test'

    public foo() {
        return `Test : foo ${this.text}`
    }

    public dispose() {
        this.text = 'disposed'
    }
}

export class TestBase2Api {
    public foo() { }
    public dispose() {}
}

@decorator.provide<TestBase2Api>(TestBase2Api)
    .dispose((item) => { item.dispose() })
    .register()
export class Test2Api extends TestBase2Api {
    public text : string = 'test'

    public foo() {
        return `Test : foo ${this.text}`
    }

    public dispose() {
        this.text = 'disposed'
    }
}
