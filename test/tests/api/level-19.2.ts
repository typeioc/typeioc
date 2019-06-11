import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IContainerBuilder, ResolutionError } from '@lib'
import * as Integration from '@data/decorator/integration'
import * as ValueResolution from '@data/decorator/resolution/by-value'

type Context = {
    builder: IContainerBuilder
}

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = typeioc.createBuilder()
    done()
})

tap.test('resolve basic registration', (test) => {
    Integration.decorator.register(Integration.TestBase1).as(() => ({
        get name() {
            return 'Dep name 1'
        }
    }))

    Integration.decorator.register(Integration.valueKey).asValue(1234567)
    Integration.decorator.register(Integration.valueKey1).asType(Integration.Test1)

    const container = Integration.decorator.build()
    const actual = container.resolve<Integration.TestBase>(Integration.TestBase)

    test.equal(actual.name, 'test Dep name 1 1234567 test 1')
    test.done()
})

tap.test<Context>('resolve with import', (test) => {
    const { builder } = test.context

    builder.register(Integration.valueKey2).asValue(2)
    builder.register(Integration.valueKey3).asValue(3)
    Integration.decorator.import(builder)

    const container = Integration.decorator.build()
    const actual = container.resolve<Integration.Test2>(Integration.Test2)

    test.equal(actual.name, 'test 2 3')
    test.done()
})

tap.test<Context>('resolve with import keeps registrations', (test) => {
    const { builder } = test.context

    let test1Copies = 0
    let test2Copies = 0

    class Test1 {
        constructor() {
            test1Copies += 1
        }
    }

    class Test2 {
        constructor() {
            test2Copies += 1
        }
    }

    builder.register(Integration.valueKey2)
    .asType(Test1)
    .singleton()

    builder.register(Integration.valueKey3)
    .asType(Test2)
    .singleton()

    Integration.decorator.import(builder)

    const containerDecorator = Integration.decorator.build()
    const actualDecorator = containerDecorator.resolve<Integration.TestBase>(Integration.Test2)

    const containerBuilder = builder.build()
    containerBuilder.resolve(Integration.valueKey2)
    containerBuilder.resolve(Integration.valueKey3)

    test.equal(actualDecorator.name, 'test [object Object] [object Object]')
    test.equal(test1Copies, 2)
    test.equal(test2Copies, 2)

    test.done()
})

tap.test('resolve by value function', (test) => {

    const decorator = ValueResolution.decorator
    const container = decorator.build()
    const actual = container
    .resolve<ValueResolution.TestBase>(
        ValueResolution.test11)

    test.equal(actual.foo(), 'Test1 : decorator value func')
    test.done()
})

tap.test<Context>('cached resolutions cleanup', (test) => {
    const { builder } = test.context

    builder.register('A')
    .as(() => ({ a: 'A' }))

    builder.register('B')
    .as(() => ({ b: 'B' }))

    const container = builder.build()
    container.resolveWith('A').cache('a').exec()
    container.resolveWith('B').cache('b').exec()

    const { a, b } = container.cache.instance

    container.dispose()

    test.equal(a.a, 'A')
    test.equal(b.b, 'B')

    test.equal(container.cache.instance.a, undefined)
    test.equal(container.cache.instance.b, undefined)

    test.done()
})

tap.test<Context>('cache resolve throws when no resolution', (test) => {
    const { builder } = test.context

    const serviceName = 'A'
    const container = builder.build()

    const delegate = () => {
        container.cache.resolve<number>(serviceName)
    }

    test.throws(delegate, new ResolutionError({
        message: 'Could not resolve service',
        data: serviceName
    }))

    test.done()
})

tap.test<Context>('cache instance returns undefined when no resolution', (test) => {
    const { builder } = test.context

    const container = builder.build()

    test.ok(container.cache.instance.a === undefined)
    test.done()
})
