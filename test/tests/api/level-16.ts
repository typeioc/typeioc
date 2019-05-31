import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IContainerBuilder, ResolutionError } from '@lib'
import { Test1Base, Test2Base, Test1, Test2, Test4, Test7 } from '@data/base'

type Context = {
    builder: IContainerBuilder
}

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = typeioc.createBuilder()
    done()
})

tap.test<Context>('resolves basic', (test) => {
    const { builder } = test.context

    builder.register(Test1Base).asType(Test1)
    const container = builder.build()
    const actual = container.resolve<Test1Base>(Test1Base)

    test.ok(actual)
    test.equal(actual.Name, 'test 1')
    test.done()
})

tap.test<Context>('resolves with params', (test) => {
    const { builder } = test.context

    builder.register(Test1Base).asType(Test4)
    const container = builder.build()
    const actual = container.resolve<Test1Base>(Test1Base, '---')

    test.ok(actual)
    test.equal(actual.Name, '---')
    test.done()
})

tap.test<Context>('resolves named:', (test) => {
    const { builder } = test.context

    builder.register(Test1Base)
            .asType(Test1).named('A')

    const container = builder.build()
    const actual = container.resolveNamed<Test1Base>(Test1Base, 'A')

    test.ok(actual)
    test.equal(actual.Name, 'test 1')
    test.done()
})

tap.test<Context>('resolves named with params', (test) => {
    const { builder } = test.context

    builder.register(Test1Base)
            .asType(Test4)
            .named('A')

    const container = builder.build()
    const actual = container.resolveNamed<Test1Base>(Test1Base, 'A', '---')

    test.ok(actual)
    test.equal(actual.Name, '---')
    test.done()
})

tap.test<Context>('plain instantiation asTypeClass', (test) => {
    const { builder } = test.context

    class TestBase {
        public foo() { }
    }

    class Test1 {
        public foo() { return 'Test : foo' }
    }

    class Test2 {
        constructor(public test1: Test1) {}

        public foo() { return `Test2 : foo ${this.test1.foo()}` }
    }

    builder.register(TestBase).asType(Test1)
    builder.register(TestBase).asType(Test2, TestBase).named('A')

    const container = builder.build()
    const actual = container.resolve<TestBase>(TestBase)

    test.ok(actual)
    test.equal(actual.foo(), 'Test : foo')

    const actual2 = container.resolveNamed<TestBase>(TestBase, 'A')
    test.equal(actual2.foo(), 'Test2 : foo Test : foo')
    test.done()
})

tap.test<Context>('resolves multiple registrations', (test) => {
    const { builder } = test.context

    builder.register(Test1Base)
            .asType(Test1)
    builder.register(Test1Base)
            .asType(Test1).named('A')
    builder.register(Test1Base)
            .asType(Test1).named('B')

    const container = builder.build()
    const actual = container.resolve<Test1Base>(Test1Base)
    const actualA = container.resolveNamed<Test1Base>(Test1Base, 'A')
    const actualB = container.resolveNamed<Test1Base>(Test1Base, 'B')

    test.equal(actual.Name, 'test 1')
    test.equal(actualA.Name, 'test 1')
    test.equal(actualB.Name, 'test 1')
    test.done()
})

tap.test<Context>('resolves with dependencies', (test) => {
    const { builder } = test.context

    const test4 = function () {
        // @ts-ignore
        this.Name = 'test 4'
    }

    const test7 = function () {}

    builder.register(Test1Base).asType(Test1)
    builder.register(Test2Base).asType(Test2)
    builder.register(test4).asType(test4)
    builder.register(test7)
            .asType(Test7, Test1Base, Test2Base, test4)

    const container = builder.build()
    const actual = container.resolve<Test1Base>(test7)

    test.ok(actual)
    test.equal(actual.Name, 'test 1 test 2 test 4')
    test.done()
})

tap.test<Context>('resolves named with dependencies', (test) => {
    const { builder } = test.context

    const test4 = function () {
        // @ts-ignore
        this.Name = 'test 4'
    }

    builder.register(Test1Base).asType(Test1)
    builder.register(Test2Base).asType(Test2)
    builder.register(test4).asType(test4)
    builder.register(Test1Base)
            .asType(Test7, Test1Base, Test2Base, test4)
            .named('A')

    const container = builder.build()
    const actual = container.resolveNamed<Test1Base>(Test1Base, 'A')

    test.ok(actual)
    test.equal(actual.Name, 'test 1 test 2 test 4')
    test.done()
})

tap.test<Context>('throws when params and arguments', (test) => {
    const { builder } = test.context

    const test1 = function () {
        // @ts-ignore
        this.name = 'test 1'
    }

    const test2 = function (test1: any, name: string) {
        // @ts-ignore
        this.name = [test1.name, name].join(' ')
    }

    builder.register(test1).asType(test1)
    builder.register(test2).asType(test2, test1)

    const container = builder.build()

    const delegate = () => container.resolve(test2, 'A')

    const innerError = new ResolutionError({
        message: [
            'Could not instantiate type.',
            'Arguments and dependencies are not allowed for simultaneous resolution.',
            'Pick dependencies or arguments'
        ].join(' '),
        data: test2
    })

    const error = new ResolutionError({
        message: [
            'Could not instantiate service.',
            'Could not instantiate type.',
            'Arguments and dependencies are not allowed for simultaneous resolution.',
            'Pick dependencies or arguments'
        ].join(' '),
        data: test2,
        error: innerError
    })

    test.throws(delegate, error)

    test.done()
})

tap.test<Context>('resolves with dynamic dependencies', (test) => {
    const { builder } = test.context

    const dependencyFactory = (name: string) => {
        return function () {
            // @ts-ignore
            this.Name = name
        }
    }

    const test4 = function () {}
    const test7 = function () {}

    builder.register(Test1Base).asType(Test1)
    builder.register(Test2Base).asType(Test2)
    builder.register(test4).asType(test4)
    builder.register(test7)
            .asType(Test7, Test1Base, Test2Base, test4)

    const container = builder.build()
    const actual = container.resolveWith<Test1Base>(test7)
    .dependencies([{
        service: Test1Base,
        factoryType: dependencyFactory('test dep 1')
    }, {
        service: Test2Base,
        factoryType: dependencyFactory('test dep 2')
    }, {
        service: test4,
        factoryType: dependencyFactory('test dep 4')
    }])
    .exec()

    test.ok(actual)
    test.equal(actual.Name, 'test dep 1 test dep 2 test dep 4')
    test.done()
})

tap.test<Context>('resolvesWith dynamic named dependencies', (test) => {
    const { builder } = test.context

    const dependencyFactory = (name: string) => {
        return function () {
            // @ts-ignore
            this.Name = name
        }
    }

    const test4 = function () { }
    const test7 = function () { }

    builder.register(Test1Base)
        .asType(Test1)
        .named('Test1')
    builder.register(Test2Base)
        .asType(Test2)
        .named('Test2')
    builder.register(test4).asType(test4)
        .named('Test4')
    builder.register(test7)
            .asType(Test7, Test1Base, Test2Base, test4)

    const container = builder.build()
    const actual = container.resolveWith<Test1Base>(test7)
    .dependencies([{
        service: Test1Base,
        factoryType: dependencyFactory('test dep 1'),
        named: 'Test1'
    }, {
        service: Test2Base,
        factoryType: dependencyFactory('test dep 2'),
        named: 'Test2'
    }, {
        service: test4,
        factoryType: dependencyFactory('test dep 4'),
        named: 'Test4'
    }])
    .exec()

    test.ok(actual)
    test.equal(actual.Name, 'test dep 1 test dep 2 test dep 4')
    test.done()
})

tap.test<Context>('tryResolveWith dynamic dependencies falsy return', (test) => {
    const { builder } = test.context

    const dependencyFactory = (name: string) => {
        return function () {
            // @ts-ignore
            this.Name = name
        }
    }

    builder.register(Test1Base)
        .asType(Test1)
        .named('A')

    const container = builder.build()
    const actual = container.resolveWith(Test1Base)
    .attempt()
    .dependencies([{
        service: Test1Base,
        factoryType: dependencyFactory('test dep 1')
    }])
    .exec()

    test.notOk(actual)
    test.done()
})
