import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IContainerBuilder } from '@lib'
import { Test1Base, Test2Base, Test2, Test3, Test4, Test7 } from '@data/base'

type Context = { builder: IContainerBuilder }

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = typeioc.createBuilder()
    done()
})

tap.test<Context>('resolveWith attempt with name', (test) => {

    const { builder } = test.context

    const argName = 'AAAAA'
    const resolutionName = 'Test'

    builder.register(Test1Base)
        .as(() => {
            return new Test4(argName)
        })
        .named(resolutionName)

    const container = builder.build()

    const actual = container
        .resolveWith<Test1Base>(Test1Base)
        .attempt()
        .name(resolutionName)
        .exec()

    test.ok(actual instanceof Test4)
    test.equal(actual.Name, argName)

    test.done()
})

tap.test<Context>('resolveWith attempt dependencies', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => ({
            get Name() {
                return 'Test2Base'
            }
        }))

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
                return 'Test2 substitute'
            }
        })
    }]

    const actual = container
        .resolveWith<Test1Base>(Test1Base)
        .attempt()
        .dependencies(dependencies)
        .exec()

    test.equal(actual.Name, 'Test 3 Test2 substitute')

    test.done()
})

tap.test<Context>('resolveWith attempt dependencies missing resolution', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => ({
            get Name() {
                return 'Test2Base'
            }
        }))

    builder.register(Test1Base)
        .as(c => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })

    const container = builder.build()

    const dependencies = [{
        service: {},
        factory: () => ({
            get Name() {
                return 'Test2 substitute'
            }
        })
    }]

    const actual = container.resolveWith(Test1Base)
        .attempt()
        .dependencies(dependencies)
        .exec()

    test.notOk(actual)

    test.done()
})

tap.test<Context>('resolveWith attempt dependencies missing non required resolution', (test) => {

    const { builder } = test.context

    builder.register(Test1Base)
        .as(c => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        required: false,
        factory: () => ({
            get Name() {
                return 'name from dependency'
            }
        })
    }]

    const actual = container
        .resolveWith<Test1Base>(Test1Base)
        .attempt()
        .dependencies(dependencies)
        .exec()

    test.equal(actual.Name, 'Test 3 name from dependency')
    test.done()
})

tap.test<Context>('resolveWith attempt partial missing non required dependencies', (test) => {

    const { builder } = test.context

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

    const dependencies = [{
        service: Test1Base,
        factory: () => ({
            get Name() {
                return 'test 1 base'
            }
        })
    }, {
        service: Test2Base,
        required: false,
        factory: () => ({
            get Name() {
                return 'test 2 base'
            }
        })
    }, {
        service: Test1Base,
        named : 'Test 4',
        factory: () => ({
            get Name () {
                return 'test 4 base'
            }
        })
    }]

    const actual = container
        .resolveWith<{Name : string}>(dynamicService)
        .attempt()
        .dependencies(dependencies)
        .exec()

    test.ok(actual instanceof Test7)
    test.equal(actual.Name, 'test 1 base test 2 base test 4 base')

    test.done()
})

tap.test<Context>('resolveWith attempt cache', (test) => {

    const { builder } = test.context

    const argName = 'AAAAA'

    builder.register(Test1Base)
        .as(() => {
            return new Test4(argName)
        })

    const container = builder.build()

    container
        .resolveWith<Test1Base>(Test1Base)
        .attempt()
        .cache()
        .exec()

    const actual = container.cache.instance.Test1Base

    test.ok(actual instanceof Test4)
    test.equal(actual.Name, argName)

    test.done()
})

tap.test<Context>('resolveWith name dependencies', (test) => {

    const { builder } = test.context

    const resolutionName = 'AAAAA'

    builder.register(Test2Base)
        .as(() => ({
            get Name() {
                return 'Test2Base'
            }
        }))

    builder.register(Test1Base)
        .as((c) => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })
        .named(resolutionName)

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        factory: () => ({
            get Name() {
                return 'Test2 substitute'
            }
        })
    }]

    const actual = container
        .resolveWith<Test1Base>(Test1Base)
        .name(resolutionName)
        .dependencies(dependencies)
        .exec()

    test.equal(actual.Name, 'Test 3 Test2 substitute')
    test.done()
})

tap.test<Context>('resolutionWith name cache', (test) => {

    const { builder } = test.context

    const argName = 'ArgName'
    const resolutionName = 'AAAAA'

    builder.register(Test1Base)
        .as(() => {
            return new Test4(argName)
        })
        .named(resolutionName)

    const container = builder.build()

    container
        .resolveWith<Test1Base>(Test1Base)
        .name(resolutionName)
        .cache()
        .exec()

    const actual = container.cache.instance.AAAAA

    test.ok(actual instanceof Test4)
    test.equal(actual.Name, argName)

    test.done()
})

tap.test<Context>('resolveWith dependencies cache', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => ({
            get Name() {
                return 'Test2Base'
            }
        }))

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
                return 'Test2 substitute'
            }
        })
    }]

    container.resolveWith<Test1Base>(Test1Base)
        .dependencies(dependencies)
        .cache()
        .exec()

    const actual = container.cache.instance.Test1Base

    test.ok(actual)
    test.ok(actual instanceof Test3)

    test.equal(actual.Name, 'Test 3 Test2 substitute')
    test.done()
})

tap.test<Context>('resolveWith fluent api', (test) => {

    const { builder } = test.context

    const container = builder.build()
    const registration = container.resolveWith(Test1Base)

    test.ok(registration.args)
    test.ok(registration.attempt)
    test.ok(registration.name)
    test.ok(registration.dependencies)
    test.ok(registration.cache)
    test.ok(registration.exec)

    test.done()
})

tap.test<Context>('resolveWith fluentApi args', (test) => {

    const { builder } = test.context

    const container = builder.build()
    const registration = container
        .resolveWith(Test1Base)
        .args([])

    test.notOk((registration as any).args)
    test.ok(registration.attempt)
    test.ok(registration.name)
    test.ok(registration.dependencies)
    test.ok(registration.cache)
    test.ok(registration.exec)

    test.done()
})

tap.test<Context>('resolveWith fluentApi args attempt', (test) => {

    const { builder } = test.context

    const container = builder.build()
    const registration = container
        .resolveWith(Test1Base)
        .args([])
        .attempt()

    test.notOk((registration as any).args)
    test.notOk((registration as any).attempt)
    test.ok(registration.name)
    test.ok(registration.dependencies)
    test.ok(registration.cache)
    test.ok(registration.exec)

    test.done()
})

tap.test<Context>('resolveWith fluentApi args attempt name', (test) => {

    const { builder } = test.context

    const container = builder.build()
    const registration = container
        .resolveWith(Test1Base)
        .args([])
        .attempt()
        .name('')

    test.notOk((registration as any).args)
    test.notOk((registration as any).attempt)
    test.notOk((registration as any).name)
    test.ok(registration.dependencies)
    test.ok(registration.cache)
    test.ok(registration.exec)

    test.done()
})

tap.test<Context>('resolveWith fluentApi argsAttemptNameDependencies', (test) => {

    const { builder } = test.context

    const container = builder.build()
    const registration = container
        .resolveWith(Test1Base)
        .args([])
        .attempt()
        .name('')
        .dependencies([])

    test.notOk((registration as any).args)
    test.notOk((registration as any).attempt)
    test.notOk((registration as any).name)
    test.ok(registration.dependencies)
    test.ok(registration.cache)
    test.ok(registration.exec)

    test.done()
})

tap.test<Context>('fluentApi ResolveWith args attempt name dependencies cache', (test) => {

    const { builder } = test.context

    const container = builder.build()
    const registration = container
        .resolveWith(Test1Base)
        .args([])
        .attempt()
        .name('')
        .dependencies([])
        .cache()

    test.notOk((registration as any).args)
    test.notOk((registration as any).attempt)
    test.notOk((registration as any).name)
    test.notOk((registration as any).dependencies)
    test.notOk((registration as any).cache)
    test.ok(registration.exec)

    test.done()
})
