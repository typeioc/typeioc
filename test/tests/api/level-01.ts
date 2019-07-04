import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { builder, IContainerBuilder, ArgumentError, ResolutionError } from '@lib'
import { Test1Base, Test1, Test2Base, Test2, Test3 } from '@data/base'

type Context = { builder: IContainerBuilder }

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = builder()
    done()
})

tap.test<Context>('container construction', (test) => {
    const { builder } = test.context

    const container = builder.build()
    test.ok(container)
    test.done()
})

tap.test<Context>('error when no service provided', (test) => {
    const { builder } = test.context

    test.test('null', (test) => {
        const delegate = function () {
            builder.register(null as unknown as {})
        }

        test.throws(delegate, new ArgumentError('service'))
        test.done()
    })

    test.test('undefined', (test) => {
        const delegate = function () {
            builder.register(undefined as unknown as {})
        }

        test.throws(delegate, new ArgumentError('service'))
        test.done()
    })

    test.done()
})

tap.test<Context>('parameter-less resolution ', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test1())

    const container = builder.build()
    const actual = container.resolve<Test1Base>(Test1Base)

    test.ok(actual)
    test.equal(actual.Name, 'test 1')

    test.done()
})

tap.test<Context>('multiple parameter-less resolutions', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base).as(() => new Test1())
    builder.register<Test2Base>(Test2Base).as(() => new Test2())

    const container = builder.build()
    const actual1 = container.resolve<Test1Base>(Test1Base)
    const actual2 = container.resolve<Test1Base>(Test2Base)

    test.ok(actual1)
    test.equal(actual1.Name, 'test 1')
    test.ok(actual2)
    test.equal(actual2.Name, 'test 2')
    test.done()
})

tap.test<Context>('overriding resolutions', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>('service').as(() => new Test1())
    builder.register<Test2Base>('service').as(() => new Test2())

    const container = builder.build()
    const actual = container.resolve<Test1Base>('service')

    test.ok(actual)
    test.equal(actual.Name, 'test 2')

    test.done()
})

tap.test<Context>('error no registration', (test) => {

    const { builder } = test.context

    const container = builder.build()
    const delegate = () => container.resolve(Test1Base)

    test.throws(delegate, new ResolutionError({
        message: 'Could not resolve service', data: Test1Base
    }))

    test.done()
})

tap.test<Context>('attempt resolution', (test) => {

    const { builder } = test.context

    const container = builder.build()
    const actual = container.tryResolve(Test1Base)

    test.ok(actual === undefined)
    test.done()
})

tap.test<Context>('attempt named resolution', (test) => {

    const { builder } = test.context

    test.test('missing registration', (test) => {
        const container = builder.build()
        const actual = container.tryResolveNamed(Test1Base, 'Test Name')

        test.ok(actual === undefined)
        test.done()
    })

    test.test('existing registration', (test) => {
        builder.register<Test1Base>(Test1Base).as(() => new Test1())
        const container = builder.build()
        const actual = container.tryResolveNamed(Test1Base, 'Test Name')

        test.ok(actual === undefined)
        test.done()
    })

    test.done()
})

tap.test<Context>('attempt named services resolution no name error', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test1()).named('A')

    const container = builder.build()
    const delegate1 = () => container.tryResolveNamed(Test1Base, null as unknown as string)
    const delegate2 = () => container.tryResolveNamed(Test1Base, undefined as unknown as string)

    test.throws(delegate1, new ArgumentError('name'))
    test.throws(delegate2, new ArgumentError('name'))

    test.done()
})

tap.test<Context>('dependencies resolution', (test) => {

    const { builder } = test.context

    builder.register<Test2Base>(Test2Base).as(() => new Test2())
    builder.register<Test1Base>(Test1Base).as((c) => {
        const test2 = c.resolve<Test2>(Test2Base)
        return new Test3(test2)
    })

    const container = builder.build()
    const actual = container.resolve<Test1Base>(Test1Base)

    test.ok(actual)
    test.equal(actual.Name, 'Test 3 test 2')

    test.done()
})
