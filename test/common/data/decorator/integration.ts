import typeioc from '@lib'

export const decorator = typeioc.createDecorator()

export const valueKey = 'value-key'
export const valueKey1 = 'value-key-1'
export const valueKey2 = 'value-key-2'
export const valueKey3 = 'value-key-3'

export class TestBase {
    get name(): string | null { return null }
}

export class TestBase1 {
    get name(): string | null { return null }
}

@decorator.provide(TestBase).register()
export class Test extends TestBase {

    constructor(
    @decorator.by(TestBase1).resolve()
    private dependency1: TestBase1,
    @decorator.by(valueKey).resolve()
    private dependency2: string,
    @decorator.by(valueKey1).resolve()
    private dependency3: any) {
        super()
    }

    get name() {
        return `test ${this.dependency1.name} ${this.dependency2} ${this.dependency3.name}`
    }
}

export class Test1 extends TestBase1 {
    get name() { return 'test 1' }
}

@decorator.provideSelf().register()
export class Test2 extends TestBase {

    constructor(
    @decorator.by(valueKey2).resolve()
    private dependency1: any,
    @decorator.by(valueKey3).resolve()
    private dependency2: any) {
        super()
    }

    get name() {
        return `test ${this.dependency1} ${this.dependency2}`
    }
}
