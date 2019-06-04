import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IContainerBuilder, ResolutionError } from '@lib'
import { Test1Base, Test2Base, Test1, Test2, Test3, Test4 } from '@data/base'

type Context = {
    builder: IContainerBuilder
}

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = typeioc.createBuilder()
    done()
})

tap.test<Context>('resolveAsync', async (test) => {
    const { builder } = test.context

    builder.register(Test1Base).as(() => {
        return new Test1()
    })

    const container = builder.build()
    await container.resolveAsync<Test1Base>(Test1Base)
    .then(actual => {
        test.ok(actual)
        test.equal(actual.Name, 'test 1')
    })
})

tap.test<Context>('resolveAsync promise factory', async (test) => {
    const { builder } = test.context

    builder.register(Test1Base).as(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(new Test1())
            }, 1)
        })
    })

    const container = builder.build()
    await container.resolveAsync<Test1Base>(Test1Base)
    .then(actual => {
        test.ok(actual)
        test.equal(actual.Name, 'test 1')
    })
})

tap.test<Context>('resolveAsync fails', async (test) => {
    const { builder } = test.context

    builder.register(Test1Base).as(() => {
        throw 'Test Error'
    })

    const container = builder.build()
    await container.resolveAsync(Test1Base)
    .catch(error => {
        test.equal(error.message, 'Could not instantiate service')
        test.ok(error.data === Test1Base)
        test.ok(error.innerError === 'Test Error')
        test.ok(error instanceof ResolutionError)
    })
})

tap.test<Context>('resolveAsync_with params', async (test) => {
    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
    .as((_c, name) => {
        return new Test4(name)
    })

    const container = builder.build()
    await container.resolveAsync<Test1Base>(Test1Base, 'test 4')
    .then(actual => {
        test.ok(actual)
        test.equal(actual.Name, 'test 4')
    })
})

tap.test<Context>('tryResolveAsync no resolution', async (test) => {
    const { builder } = test.context

    const container = builder.build()

    await container.tryResolveAsync<Test1Base>(Test1Base)
    .then(actual => {
        test.ok(actual === undefined)
    })
})

tap.test<Context>('tryResolveAsync with_params', async (test) => {
    const { builder } = test.context

    builder.register(Test1Base).as((_c, name) => {
        return new Test4(name)
    })

    const container = builder.build()
    await container.tryResolveAsync<Test1Base>(Test1Base, 'test 4')
        .then(actual => {
            test.ok(actual)
            test.equal(actual!.Name, 'test 4')
        })
})

tap.test<Context>('resolveNamedAsync', async (test) => {
    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as((_c, name) => new Test4(name))
        .named('A')

    builder.register<Test1Base>(Test1Base)
        .as((_c, name) => new Test4(name))
        .named('B')

    const container = builder.build()
    const p1 = container.resolveNamedAsync<Test1Base>(Test1Base, 'A', 'a')
    const p2 = container.resolveNamedAsync<Test1Base>(Test1Base, 'B', 'b')

    await Promise.all([p1, p2])
        .then(values => {

            const actual1 = values[0]
            const actual2 = values[1]

            test.ok(actual1)
            test.ok(actual2)
            test.equal(actual1.Name, 'a')
            test.equal(actual2.Name, 'b')
        })
})

tap.test<Context>('tryResolveNamedAsync',  async (test) => {
    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as((_c, name) => new Test4(name))
        .named('A')

    const container = builder.build()
    await container.tryResolveNamedAsync<Test1Base>(Test1Base, 'A', 'test')
        .then(actual => {
            test.equal('test', actual!.Name)
        })
})

tap.test<Context>('resolveWithDependencies',  async (test) => {
    const { builder } = test.context

    builder.register<Test2Base>(Test2Base)
        .as(() => new Test2())

    builder.register<Test1Base>(Test1Base)
        .as(c => {
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

    await container
        .resolveWithDependenciesAsync<Test1Base>(Test1Base, dependencies)
        .then(actual => {
            test.equal(actual.Name, 'Test 3 name from dependency')
        })
})
