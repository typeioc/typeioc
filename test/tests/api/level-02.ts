import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IContainerBuilder, ResolutionError } from '@lib'
import { Test1Base, Test1, Test2, Test4 } from '@data/base'

type Context = { builder: IContainerBuilder }

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = typeioc.createBuilder()
    done()
})

tap.test<Context>('custom parameters resolution', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as((_c, name) => new Test4(name))

    const container = builder.build()
    const test1 = container.resolve<Test1Base>(Test1Base, 'test 4')

    test.ok(test1)
    test.equal(test1.Name, 'test 4')

    test.done()
})

tap.test<Context>('colliding resolutions', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('a'))
    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('b'))

    const container = builder.build()
    const actual1 = container.resolve<Test1Base>(Test1Base)
    const actual2 = container.resolve<Test1Base>(Test1Base)

    test.ok(actual1)
    test.ok(actual2)
    test.equal(actual1.Name, 'b')
    test.equal(actual2.Name, 'b')
    test.equal(Object.getPrototypeOf(actual1), Object.getPrototypeOf(actual2))

    test.done()
})

tap.test<Context>('overriding parameter resolutions', (test) => {

    const { builder } = test.context

    type Test = {
        name: string
        data: { Name: string }
    }

    builder.register<Test>(Test1Base)
        .as((_c, name: string) => ({ name, data: new Test1() }))

    builder.register<Test>(Test1Base)
        .as((_c, name1: string, name2: string) => ({ name: name1 + name2, data: new Test2() }))

    const container = builder.build()
    const actual = container.resolve<Test>(Test1Base, '1', '2')

    test.ok(actual)
    test.equal(actual.data.Name, 'test 2')
    test.equal(actual.name, '12')

    test.done()
})

tap.test<Context>('named services resolution', (test) => {
    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('null'))
    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('a')).named('A')
    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('b')).named('B')

    const container = builder.build()
    const actual1 = container.resolveNamed<Test4>(Test1Base, 'A')
    const actual2 = container.resolveNamed<Test4>(Test1Base, 'B')
    const actual3 = container.resolve<Test1Base>(Test1Base)

    test.ok(actual1)
    test.ok(actual2)
    test.ok(actual3)
    test.equal(actual1.Name, 'a')
    test.equal(actual2.Name, 'b')
    test.equal(actual3.Name, 'null')

    test.done()
})

tap.test<Context>('named services resolution with params', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as((_c, name) => new Test4(name)).named('A')
    builder.register<Test1Base>(Test1Base)
        .as((_c, name) => new Test4(name)).named('B')

    const container = builder.build()
    const actual1 = container.resolveNamed<Test4>(Test1Base, 'A', 'a')
    const actual2 = container.resolveNamed<Test4>(Test1Base, 'B', 'b')

    test.ok(actual1)
    test.ok(actual2)
    test.equal(actual1.Name, 'a')
    test.equal(actual2.Name, 'b')

    test.done()
})

tap.test<Context>('named services resolution with params error', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as((_c, name) => new Test4(name)).named('A')

    const container = builder.build()
    const delegate = () => container.resolveNamed(Test1Base, 'A')

    test.throws(delegate, new ResolutionError({
        message: 'Could not resolve service',
        data: Test1Base
    }))

    test.done()
})

tap.test<Context>('attempt services parameters resolution', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as((_c, name) => new Test4(name))

    const container = builder.build()
    const actual = container.tryResolve<Test4>(Test1Base, 'test')!
    test.equal(actual.Name, 'test')

    test.done()
})

tap.test<Context>('attempt named services parameters resolution', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as((_c, name) => new Test4(name)).named('A')

    const container = builder.build()
    const actual = container.tryResolveNamed<Test4>(Test1Base, 'A', 'test')!
    test.equal(actual.Name, 'test')

    test.done()
})
