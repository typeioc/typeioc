import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import sinon from 'sinon'
import { builder, IContainerBuilder, IDynamicDependency, ResolutionError } from '@lib'
import { Test1Base, Test2Base, Test2, Test3, Test4, Test7 } from '@data/base'

type Context = { builder: IContainerBuilder }

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = builder()
    done()
})

tap.test<Context>('resolve with multiple dependencies', (test) => {

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

    const dependencies: IDynamicDependency[] = [{
        service: Test1Base,
        factory: () => ({
            get Name() {
                return 'test 1 base'
            }
        })
    }, {
        service: Test2Base,
        factory: () => ({
            get Name() {
                return 'test 2 base'
            }
        })
    }, {
        service: Test1Base,
        named: 'Test 4',
        factory: () => ({
            get Name () {
                return 'test 4 base'
            }
        })
    }]

    const actual = container.resolveWithDependencies<Test7>(dynamicService, dependencies)
    test.ok(actual)
    test.ok(actual instanceof Test7)
    test.equal(actual.Name, 'test 1 base test 2 base test 4 base')

    test.done()
})

tap.test<Context>('resolve with dependency throws when named registration', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() =>  new Test2())

    builder.register(Test1Base)
        .as(c => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        }).named('Test')

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        factory: () => ({
            get Name() {
                return 'name from dependency'
            }
        })
    }]

    const delegate = () => container.resolveWithDependencies(Test1Base, dependencies)

    test.throws(delegate, new ResolutionError({
        message: 'Could not resolve service',
        data: Test1Base
    }))

    test.done()
})

tap.test<Context>('resolve with dependency throws when registration with params', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())

    builder.register(Test1Base)
        .as((c, _, __, ___) => {
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

    const delegate = () => container.resolveWithDependencies(Test1Base, dependencies)

    test.throws(delegate, new ResolutionError({
        message: 'Could not resolve service',
        data:Test1Base
    }))

    test.done()
})

tap.test<Context>('resolve with dependency initializer is invoked', (test) => {

    const { builder } = test.context

    const resolutionInitializer = sinon.stub()
    const dependencyInitializer = sinon.stub()

    const resolveItem = new Test3(null as any as Test2)

    builder.register(Test2Base)
        .as(() => new Test2())

    builder.register(Test1Base)
        .as(c => {
            c.resolve(Test2Base)
            return resolveItem
        })
        .initializeBy(resolutionInitializer)

    const container = builder.build()
    const item = {
        get Name() {
            return 'name from dependency'
        }
    }

    const dependencies = [{
        service: Test2Base,
        factory: () => item,
        initializer: dependencyInitializer
    }]

    container.resolveWithDependencies(Test1Base, dependencies)

    test.ok(resolutionInitializer.calledOnce)
    test.ok(resolutionInitializer.calledWithExactly(sinon.match.any, resolveItem))

    test.ok(dependencyInitializer.calledOnce)
    test.ok(dependencyInitializer.calledWithExactly(sinon.match.any, item))

    test.done()
})

tap.test<Context>('resolve with partial unique dependencies', (test) => {

    const { builder } = test.context

    test.plan(4)

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

            test.ok(test2 instanceof Test2)

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
        service: Test1Base,
        named: 'Test 4',
        factory: () => ({
            get Name () {
                return 'test 4 base'
            }
        })
    }]

    const actual = container.resolveWithDependencies<Test7>(dynamicService, dependencies)
    test.ok(actual)
    test.ok(actual instanceof Test7)
    test.equal(actual.Name, 'test 1 base test 2 test 4 base')

    test.done()
})

tap.test<Context>('resolve with partial non named dependencies', (test) => {

    const { builder } = test.context

    test.plan(4)

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

            test.ok(test1 instanceof Test3)

            const test2 = c.resolve<Test2Base>(Test2Base)
            const test4 = c.resolveNamed<Test4>(Test1Base, 'Test 4')
            return new Test7(test1, test2, test4)
        })

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        factory: () => ({
            get Name() {
                return 'test 2 base'
            }
        })
    }, {
        service: Test1Base,
        named: 'Test 4',
        factory: () => ({
            get Name () {
                return 'test 4 base'
            }
        })
    }]

    const actual = container.resolveWithDependencies<Test7>(dynamicService, dependencies)
    test.ok(actual)
    test.ok(actual instanceof Test7)
    test.equal(actual.Name, 'Test 3 test 2 test 2 base test 4 base')

    test.done()
})

tap.test<Context>('resolve with partial named dependencies', (test) => {

    const { builder } = test.context

    test.plan(4)

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

            test.ok(test4 instanceof Test4)

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
        factory: () => ({
            get Name() {
                return 'test 2 base'
            }
        })
    }]

    const actual = container.resolveWithDependencies<Test7>(dynamicService, dependencies)
    test.ok(actual)
    test.ok(actual instanceof Test7)
    test.equal(actual.Name, 'test 1 base test 2 base test 4')

    test.done()
})
