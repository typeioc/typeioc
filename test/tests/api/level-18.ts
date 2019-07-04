import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { builder, IContainerBuilder } from '@lib'
import { Test1Base, Test2Base, Test1 } from '@data/base'

type Context = {
    builder: IContainerBuilder
}

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = builder()
    done()
})

tap.test<Context>('asValue resolves basic', (test) => {
    const { builder } = test.context

    const value = 123
    builder.register(Test1).asValue(value)

    const container = builder.build()
    const actual = container.resolve(Test1)

    test.equal(actual, value)
    test.done()
})

tap.test<Context>('asValue resolves with args', (test) => {
    const { builder } = test.context

    const value = 123
    builder.register(Test1).asValue(value)

    const container = builder.build()
    const actual = container.resolve(Test1, 1, 2, 3)

    test.equal(actual, value)
    test.done()
})

tap.test<Context>('asValue resolves as dependency for asType', (test) => {
    const { builder } = test.context

    const service = function () {}
    const resolution = function (value: string) {
        // @ts-ignore
        this.name = value
    }
    const serviceValue = ''
    const value = '123'

    builder.register(serviceValue).asValue(value)
    builder.register(service).asType(resolution, serviceValue)

    const container = builder.build()
    const actual = container.resolve<{name: string}>(service)

    test.ok(actual)
    test.equal(actual.name, value)
    test.done()
})

tap.test<Context>('asValue resolves as dependency for asSelf', (test) => {
    const { builder } = test.context

    class Test1 {
        public name = 'test 1'

        constructor(name: string) {
            this.name = name
        }

    }

    const serviceValue = 'value'
    const value = '123'

    builder.register(Test1)
        .asSelf(serviceValue)
    builder.register(serviceValue).asValue(value)

    const container = builder.build()
    const actual = container.resolve<Test1>(Test1)

    test.ok(actual)
    test.equal(actual.name, value)
    test.done()
})

tap.test<Context>('asValue resolves named', (test) => {
    const { builder } = test.context

    const value = 123
    builder.register(Test1).asValue(value)
    builder.register(Test1).asValue(value).named('A')
    builder.register(Test1).asValue(value).named('B')

    const container = builder.build()
    const actual1 = container.resolve(Test1)
    const actual2 = container.resolveNamed(Test1, 'A')
    const actual3 = container.resolveNamed(Test1, 'B')

    test.equal(actual1, actual2)
    test.equal(actual2, actual3)
    test.equal(actual1, value)
    test.done()
})

tap.test<Context>('asValue resolves as dynamic dependency', (test) => {
    const { builder } = test.context

    const value = 123
    builder.register(Test1Base).asValue(value)

    builder.register(Test2Base)
    .as(c => {
        const v = c.resolve<number>(Test1Base)
        return v + 5
    })

    const container = builder.build()
    const actual1 = container.resolve(Test2Base)
    const actual2 = container.resolveWithDependencies(Test2Base, [{
        service: Test1Base,
        factoryValue: 3
    }])

    test.equal(actual1, 123 + 5)
    test.equal(actual2, 3 + 5)

    test.done()
})

tap.test<Context>('asValue resolves as dynamic dependency named', (test) => {
    const { builder } = test.context

    const value = 123
    builder.register(Test1Base).asValue(value).named('A')

    builder.register(Test2Base)
    .as(c => {
        const v = c.resolveNamed<number>(Test1Base, 'A')
        return v + 5
    })

    const container = builder.build()
    const actual1 = container.resolve(Test2Base)
    const actual2 = container.resolveWithDependencies(Test2Base, [{
        service: Test1Base,
        factoryValue: 3,
        named: 'A'
    }])

    test.equal(actual1, 123 + 5)
    test.equal(actual2, 3 + 5)

    test.done()
})
