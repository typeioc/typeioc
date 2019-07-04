import * as typeioc from '@lib'

export const decorator = typeioc.decorator()

export class TestBase {
    public foo() {}
}

export class TestBase1 {
    public foo() {}
}

export class TestBase2 {
    public foo() {}
}

export class TestBase3 {
    public foo() {}
}

export class TestBase4 {
    public foo() {}
}

@decorator.provide<TestBase3>(TestBase3)
.named('Some name')
.register()
export class Test3 extends TestBase3 {

    constructor(private arg1: string, private arg2: string) {
        super()
    }

    public foo() {
        return ['Test', this.arg1, this.arg2].join(' ')
    }
}

@decorator.provide<TestBase>(TestBase).register()
export class Test extends TestBase {

    constructor(private arg1: string, private arg2: string) {
        super()
    }

    public foo() {
        return ['Test', this.arg1, this.arg2].join(' ')
    }
}

@decorator.provide<TestBase1>(TestBase1).register()
export class Test1 extends TestBase1 {

    constructor(private arg1: TestBase) {
        super()
    }

    public foo() {
        return ['Test', this.arg1.foo()].join(' ')
    }
}

@decorator.provide<TestBase2>(TestBase2).register()
export class Test2 extends TestBase2 {

    constructor(private arg1: TestBase,
                private arg2: TestBase1,
                @decorator.by()
                .name('Some name')
                .resolve() private arg3: TestBase3) {
        super()
    }

    public foo() {
        return ['Test', this.arg1.foo(), this.arg2.foo(), this.arg3.foo()].join(' ')
    }
}

@decorator.provide<TestBase4>(TestBase4).register()
export class Test4 extends TestBase4 {

    constructor(private arg1: TestBase,
                private arg2: TestBase1,
                @decorator.resolveValue('decorator value') private arg21: string,
                @decorator.by(TestBase3).name('Some name').resolve() private arg3: TestBase3) {
        super()
    }

    public foo() {
        return ['Test', this.arg1.foo(), this.arg2.foo(), this.arg21, this.arg3.foo()].join(' ')
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

export class TestDep1 extends TestBase1 {
    constructor() {
        super()
    }

    public foo() {
        return 'dependency 1'
    }
}

export class TestDep3 extends TestBase3 {
    constructor() {
        super()
    }

    public foo() {
        return 'dependency 3'
    }
}
