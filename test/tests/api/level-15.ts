import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { builder, IContainerBuilder, ResolutionError, scope } from '@lib'
import { Test1Base, Test2Base, Test2, Test3, Test4, Test5 } from '@data/base'

type Context = {
    builder: IContainerBuilder
}

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = builder()
    done()
})

tap.test<Context>('resolveWith resolves service', async test => {
    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())

    const container = builder.build()

    await container.resolveWith<Test2Base>(Test2Base)
        .execAsync()
        .then(actual => {
            test.ok(actual)
            test.ok(actual instanceof Test2)
            test.equal(actual.Name, 'test 2')
        })
})

tap.test<Context>('resolveWith throws error when not found', (test) => {
    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())

    const container = builder.build()
    const result = container.resolveWith(Test1Base)
        .execAsync()

    result.catch((error: ResolutionError) => {
        test.equal(error.message, 'Could not resolve service')
        test.equal(error.data, Test1Base)
        test.ok(error instanceof ResolutionError)

        test.done()
    })
})

tap.test<Context>('resolveWith resolves service with args', async test => {
    const { builder } = test.context

    const arg1 = 'arg 1'
    const arg2 = 'arg 2'
    const expected = `${arg1}' '${arg2}`

    builder.register(Test1Base)
        .as((_c, _name1, _name2) => {
            return new Test4(expected)
        })

    const container = builder.build()

    await container
    .resolveWith<Test1Base>(Test1Base)
    .args(arg1, arg2)
    .execAsync()
    .then(actual => {
        test.ok(actual)
        test.ok(actual instanceof Test4)
        test.equal(actual.Name, expected)
    })
})

tap.test<Context>('resolve with attempts resolves service', async test => {
    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())

    const container = builder.build()

    await container
    .resolveWith<Test2Base>(Test2Base)
    .attempt()
    .execAsync()
    .then(actual => {
        test.ok(actual)
        test.ok(actual instanceof Test2)
        test.equal(actual.Name, 'test 2')
    })
})

tap.test<Context>('resolveWith resolves named service', async test => {
    const { builder } = test.context

    const testName = 'testName'

    builder.register(Test2Base)
        .as(() => new Test2())
        .named(testName)

    const container = builder.build()

    await container
    .resolveWith<Test2Base>(Test2Base)
    .name(testName)
    .execAsync()
    .then(actual => {
        test.ok(actual)
        test.ok(actual instanceof Test2)
        test.equal(actual.Name, 'test 2')
    })
})

tap.test<Context>('resolvesWith resolves dependency', async test => {
    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())

    builder.register(Test1Base)
    .as(c => {
        const test2 = c.resolve<Test2>(Test2Base)
        return new Test3(test2)
    })

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        factory() {
            return {
                get Name() {
                    return 'name from dependency'
                }
            }
        }
    }]

    await container
    .resolveWith<Test1Base>(Test1Base)
    .dependencies(dependencies)
    .execAsync()
    .then(actual => {
        test.ok(actual)
        test.ok(actual instanceof Test1Base)
        test.equal(actual.Name, 'Test 3 name from dependency')
    })
})

tap.test<Context>('resolvesWith resolves named dependency', async test => {
    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())
        .named('A')

    builder.register(Test1Base)
    .as(c => {
        const test2 = c.resolveNamed<Test2>(Test2Base, 'A')
        return new Test3(test2)
    })

    const container = builder.build()

    const dependencies = [{
        named: 'A',
        service: Test2Base,
        factory: () => ({
            get Name() {
                return 'name from dependency'
            }
        })
    }]

    await container
    .resolveWith<Test1Base>(Test1Base)
    .dependencies(dependencies)
    .execAsync()
    .then(actual => {
        test.ok(actual)
        test.ok(actual instanceof Test1Base)
        test.equal(actual.Name, 'Test 3 name from dependency')
    })
})

tap.test<Context>('resolveWith resolves cache default', async test => {
    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())

    const container = builder.build()

    await container
    .resolveWith<Test2Base>(Test2Base)
    .cache()
    .execAsync()
    .then(() => {
        const cache = container.cache
        const actual = cache.resolve<Test2Base>('Test2Base')
        const actual2 = cache.resolve<Test2Base>('Test2Base')

        test.ok(actual)
        test.ok(actual instanceof Test2)
        test.equal(actual.Name, 'test 2')

        test.equal(actual, actual2)
    })
})

tap.test<Context>('container owned instances are disposed async', async(test) => {
    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item)  => { (item as Test5).dispose() })
        .within(scope.none)

    const container = builder.build()
    const test1 = container.resolve<Test5>(Test1Base)

    test.equal(test1.Disposed, false)

    await container.disposeAsync()

    test.equal(test1.Disposed, true)
})
