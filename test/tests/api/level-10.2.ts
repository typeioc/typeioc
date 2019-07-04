import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { builder, IContainer, IContainerBuilder, ResolutionError, ArgumentError } from '@lib'
import { Test1Base, Test2Base, Test2, Test3, Test4 } from '@data/base'

type Context = { builder: IContainerBuilder }

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = builder()
    done()
})

tap.test<Context>('resolveWith resolves cache default', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => {
            return new Test2()
        })

    const container = builder.build()

    container
        .resolveWith<Test2Base>(Test2Base)
        .cache()
        .exec()

    const cache = container.cache

    const actual = cache.instance.Test2Base
    const actual2 = cache.instance.Test2Base

    test.ok(actual instanceof Test2)
    test.equal(actual.Name, 'test 2')

    test.equal(actual, actual2)

    test.done()
})

tap.test<Context>('resolveWith resolves cache with name', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => {
            return new Test2()
        })

    const container = builder.build()

    container.resolveWith(Test2Base)
        .cache('TestName111')
        .exec()

    const cache = container.cache

    const actual = cache.resolve<Test2Base>('TestName111')

    test.ok(actual instanceof Test2)
    test.equal(actual.Name, 'test 2')

    test.done()
})

tap.test<Context>('resolveWith resolves cache with service named resolution', (test) => {

    const { builder } = test.context

    const named: any = function AAAAA() {}

    builder.register(Test2Base)
        .as(() => {
            return new Test2()
        })
        .named(named.name)

    const container = builder.build()

    container.resolveWith(Test2Base)
        .name(named.name)
        .cache()
        .exec()

    const cache = container.cache

    const actual = cache.instance.AAAAA

    test.ok(actual instanceof Test2)
    test.equal(actual.Name, 'test 2')

    test.done()
})

tap.test<Context>('resolveWith resolves cache with service value name', (test) => {

    const { builder } = test.context

    const name = 'AAAAAA'

    builder.register(name)
        .as(() => {
            return new Test2()
        })

    const container = builder.build()

    container.resolveWith(name)
        .cache()
        .exec()

    const cache = container.cache

    const actual = cache.instance[name]
    const actual2 = cache.instance.AAAAAA

    test.ok(actual instanceof Test2)
    test.equal(actual.Name, 'test 2')
    test.equal(actual, actual2)

    test.done()
})

tap.test<Context>('resolveWith cache throws when no name', (test) => {

    const { builder } = test.context

    const service = {}

    builder.register(service)
        .as(() => {
            return new Test2()
        })

    const container = builder.build()

    const delegate = function () {
        container.resolveWith(service)
            .cache()
            .exec()
    }

    test.throws(delegate, new ResolutionError({
        message: 'Missing cache name',
        data: undefined
    }))

    test.done()
})

tap.test<Context>('resolveWith cache from child container', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => {
            return new Test2()
        })

    const container = builder.build()
    const child = container.createChild()

    const actual = child
        .resolveWith<Test2Base>(Test2Base)
        .cache()
        .exec()

    test.ok(actual instanceof Test2)
    test.equal(actual.Name, 'test 2')

    test.done()
})

tap.test<Context>('resolveWith args attempt', (test) => {

    const { builder } = test.context

    const name = 'AAAAA'

    builder.register(Test1Base)
        .as((_c, name) => {
            return new Test4(name)
        })

    const container = builder.build()

    const actual = container
        .resolveWith<Test1Base>(Test1Base)
        .args(name)
        .attempt()
        .exec()

    test.ok(actual instanceof Test4)
    test.equal(actual.Name, name)

    test.done()
})

tap.test<Context>('resolve with args attempt not found', (test) => {

    const { builder } = test.context

    const name = 'AAAAA'

    builder.register(Test1Base)
        .as((_c, name) => {
            return new Test4(name)
        })

    const container = builder.build()

    const actual = container
        .resolveWith<Test2Base>(Test2Base)
        .args(name)
        .attempt()
        .exec()

    test.notOk(actual)

    test.done()
})

tap.test<Context>('resolve with args named', (test) => {

    const { builder } = test.context

    const argName = 'AAAAA'
    const resolutionName = 'Test name'

    builder.register(Test1Base)
        .as((_c, name) => {
            return new Test4(name)
        })
        .named(resolutionName)

    const container = builder.build()

    const actual = container
        .resolveWith<Test1Base>(Test1Base)
        .args(argName)
        .name(resolutionName)
        .exec()

    test.ok(actual instanceof Test4)
    test.equal(actual.Name, argName)

    test.done()
})

tap.test<Context>('resolveWith args dependencies', (test) => {

    const { builder } = test.context

    const param = 'Some name'

    builder.register(Test2Base)
        .as(() => {
            return new Test2()
        })

    builder.register(Test1Base)
        .as((c, arg) => {
            const test2 = c.resolve<Test2>(Test2Base)
            const result = new Test3(test2)

            return {
                get Name() {
                    return [result.Name, arg].join(' ')
                }
            }
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
        .args(param)
        .dependencies(dependencies)
        .exec()

    test.equal(actual.Name, 'Test 3 name from dependency Some name')
    test.done()
})

tap.test<Context>('resolve with args params dependencies', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as((_, a, b, d) => ({
            get Name() {
                return [a, b, d].join(' ')
            }
        }))

    builder.register(Test1Base)
        .as((c, a, b, d) => {
            const test2 = c.resolve<Test2>(Test2Base, a, b, d)
            return new Test3(test2)
        })

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        factory: (_c: IContainer, a: string, b: string, d: string) => ({
            get Name() {
                return [a, b, d].join(' - ')
            }
        })
    }]

    const actual = container
        .resolveWith<Test1Base>(Test1Base)
        .args('4', '5', '6')
        .dependencies(dependencies)
        .exec()

    test.equal(actual.Name, 'Test 3 4 - 5 - 6')
    test.done()
})

tap.test<Context>('resolveWith args params dependencies throws when wrong args count', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as((_, a, b, d) => ({
            get Name() {
                return [a, b, d].join(' ')
            }
        }))

    builder.register(Test1Base)
        .as((c, a, b, d) => {
            const test2 = c.resolve<Test2>(Test2Base, a, b, d)
            return new Test3(test2)
        })

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        factory: (_c: IContainer, a: string, b: string) => ({
            get Name() {
                return [a, b].join(' - ')
            }
        })
    }]

    const delegate = function () {
        container.resolveWith<Test1Base>(Test1Base)
            .args('4', '5', '6')
            .dependencies(dependencies)
            .exec()
    }

    test.throws(delegate, new ResolutionError({
        message: 'Could not resolve service',
        data: Test2Base
    }))

    test.done()
})

tap.test<Context>('resolve with args cache no name', (test) => {

    const { builder } = test.context

    const argName = 'AAAAA'

    builder.register(Test1Base)
        .as((_c, name) => {
            return new Test4(name)
        })

    const container = builder.build()

    container
        .resolveWith<Test1Base>(Test1Base)
        .args(argName)
        .cache()
        .exec()

    const actual = container.cache.instance.Test1Base

    test.ok(actual instanceof Test4)
    test.equal(actual.Name, argName)

    test.done()
})

tap.test<Context>('resolveWith throws when no service', (test) => {
    const { builder } = test.context

    const container = builder.build()

    const delegate = () => {
        container
        .resolveWith<Test1Base>(undefined as unknown as Test1Base)
        .exec()
    }

    test.throws(delegate, new ArgumentError('service'))
    test.done()
})
