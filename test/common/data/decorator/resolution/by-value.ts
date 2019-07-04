import * as typeioc from '@lib'

export const decorator = typeioc.decorator()

export class TestBase {
    public foo() {}
}

@decorator
.provide<TestBase>(TestBase)
.register()
export class Test1 extends TestBase {
    constructor(@decorator.resolveValue('decorator value')  private value: string) {
        super()
    }

    public foo() {
        return `Test1 : ${this.value}`
    }
}

export const test11 = 'test11'

@decorator
.provide<TestBase>(test11)
.register()
export class Test11 extends TestBase {
    constructor(@decorator.resolveValue(() => 'decorator value func')  private value: string) {
        super()
    }

    public foo() {
        return `Test1 : ${this.value}`
    }
}

export class TestBase1 {
    public foo() {}
}

@decorator.provide<TestBase1>(TestBase1).register()
export class Test2 extends TestBase1 {

    constructor(@decorator.resolveValue(null as unknown as {})  private value1: undefined,
                @decorator.resolveValue(0)  private value2: number,
                @decorator.resolveValue(false)  private value3: string,
                @decorator.resolveValue('')  private value4: string,
                @decorator.resolveValue(undefined as unknown as {})  private value5: undefined,
                @decorator.resolveValue(NaN)  private value6: undefined) {
        super()
    }

    public foo() {
        return [
            'Test1 :',
            this.value1,
            this.value2,
            this.value3,
            this.value4,
            this.value5,
            this.value6,
        ].join(' ')
    }
}
