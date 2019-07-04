import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { builder, IContainerBuilder, ResolutionError } from '@lib'
import { Test1Base, Test2Base, Test2, Test3, Test4, Test7 } from '@data/base'

type Context = { builder: IContainerBuilder }

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = builder()
    done()
})

tap.test<Context>('resolveWith resolves service', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => {
            return new Test2()
        })

    const container = builder.build()

    const actual = container.resolveWith<Test2Base>(Test2Base)
        .exec()

    test.ok(actual)
    test.ok(actual instanceof Test2)
    test.equal(actual.Name, 'test 2')

    test.done()
})

tap.test<Context>('resolveWith throws error when not found', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => {
            return new Test2()
        })

    const container = builder.build()

    const delegate = function () {
        container.resolveWith(Test1Base)
            .exec()
    }

    test.throws(delegate, new ResolutionError({
        message: 'Could not resolve service',
        data: Test1Base
    }))

    test.done()
})

tap.test<Context>('resolveWith resolves service with args', (test) => {

    const { builder } = test.context

    const arg1 = 'arg 1'
    const arg2 = 'arg 2'
    const expected = `${arg1} ${arg2}`

    builder.register<Test1Base>(Test1Base)
        .as((_c, name1, name2) => {
            return new Test4(`${name1} ${name2}`)
        })

    const container = builder.build()

    const actual = container
        .resolveWith<Test1Base>(Test1Base)
        .args(arg1, arg2)
        .exec()

    test.ok(actual)
    test.ok(actual instanceof Test4)
    test.equal(actual.Name, expected)

    test.done()
})

tap.test<Context>('resolveWith attempts resolves service', (test) => {

    const { builder } = test.context

    builder.register('one')
        .as(() => {
            return new Test2()
        })

    const container = builder.build()

    const actual1 = container
        .resolveWith<Test2Base>('one')
        .attempt()
        .exec()

    const actual2 = container
        .resolveWith<Test2Base>('two')
        .attempt()
        .exec()

    test.ok(actual1 instanceof Test2)
    test.equal(actual1.Name, 'test 2')

    test.notOk(actual2)

    test.done()
})

tap.test<Context>('resolveWith resolves named service', (test) => {

    const { builder } = test.context

    const testName = 'testName'

    builder.register(Test2Base)
        .as(() => {
            return new Test2()
        })
        .named(testName)

    const container = builder.build()

    const actual = container
        .resolveWith<Test2Base>(Test2Base)
        .name(testName)
        .exec()

    const delegate = function () {
        container
            .resolveWith<Test2Base>(Test2Base)
            .exec()
    }

    test.ok(actual)
    test.ok(actual instanceof Test2)
    test.equal(actual.Name, 'test 2')

    test.throws(delegate, new ResolutionError({
        message: 'Could not resolve service',
        data: Test2Base
    }))

    test.done()
})

tap.test<Context>('resolvesWith resolves dependency', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => {
            return new Test2()
        })

    builder.register(Test1Base)
        .as((c) => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        factory: () => ({
            get Name() {
                return 'name from dependency'
            }
        })
    }]

    const actual = container
        .resolveWith<Test1Base>(Test1Base)
        .dependencies(dependencies)
        .exec()

    test.ok(actual instanceof Test1Base)
    test.equal(actual.Name, 'Test 3 name from dependency')

    test.done()
})

tap.test<Context>('resolveWith multiple dependencies separate arrays', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())
    builder.register(Test1Base)
        .as(c => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })

    builder.register(Test1Base)
        .as(() => new Test4('test 4'))
        .named('Test 4')

    const dynamicService = function () {}
    builder.register(dynamicService)
        .as(c => {
            const test1 = c.resolve<Test1Base>(Test1Base)
            const test2 = c.resolve<Test2Base>(Test2Base)
            const test4 = c.resolveNamed<Test4>(Test1Base, 'Test 4')

            return new Test7(test1, test2, test4)
        })

    const container = builder.build()

    const actual = container.resolveWith<{Name : string}>(dynamicService)
        .dependencies([{
            service: Test1Base,
            factory: () => ({
                get Name() {
                    return 'test 1 base'
                }
            })
        }])
        .dependencies([{
            service: Test2Base,
            factory: () => ({
                get Name() {
                    return 'test 2 base'
                }
            })
        }])
        .dependencies([{
            service: Test1Base,
            named : 'Test 4',
            factory: () => ({
                get Name () {
                    return 'test 4 base'
                }
            })
        }])
        .exec()

    test.ok(actual instanceof Test7)
    test.equal(actual.Name, 'test 1 base test 2 base test 4 base')

    test.done()
})

tap.test<Context>('resolveWith multiple dependencies separate non arrays', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())

    builder.register(Test1Base)
        .as(c => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })

    builder.register(Test1Base)
        .as(() => new Test4('test 4'))
        .named('Test 4')

    const dynamicService = function () {}
    builder.register(dynamicService)
        .as(c => {
            const test1 = c.resolve<Test1Base>(Test1Base)
            const test2 = c.resolve<Test2Base>(Test2Base)
            const test4 = c.resolveNamed<Test4>(Test1Base, 'Test 4')

            return new Test7(test1, test2, test4)
        })

    const container = builder.build()

    const actual = container.resolveWith<{Name : string}>(dynamicService)
        .dependencies({
            service: Test1Base,
            factory: () => ({
                get Name() {
                    return 'test 1 base'
                }
            })
        })
        .dependencies({
            service: Test2Base,
            factory: () => ({
                get Name() {
                    return 'test 2 base'
                }
            })
        })
        .dependencies([{
            service: Test1Base,
            named: 'Test 4',
            factory: () => ({
                get Name () {
                    return 'test 4 base'
                }
            })
        }])
        .exec()

    test.ok(actual instanceof Test7)
    test.equal(actual.Name, 'test 1 base test 2 base test 4 base')

    test.done()
})
