import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc,
{ IContainer, IContainerBuilder, ResolutionError, IDynamicDependency, ApplicationError }
    from '@lib'
import { Test1Base, Test2Base, Test1, Test2, Test3, Test4, Test7 } from '@data/base'

type Context = { builder: IContainerBuilder }

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = typeioc.createBuilder()
    done()
})

tap.test<Context>('resolves with dependency', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() =>  new Test2())

    builder.register(Test1Base)
        .as(c => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        factory: () => {
            return {
                get Name() {
                    return 'name from dependency'
                }
            }
        }
    }]

    const actualDynamic = container.resolveWithDependencies<Test1>(Test1Base, dependencies)

    test.equal(actualDynamic.Name, 'Test 3 name from dependency')
    test.done()
})

tap.test<Context>('resolve with dependency uses dynamic container', (test) => {

    const { builder } = test.context

    test.plan(1)

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
        factory: (c: IContainer) => {

            test.notEqual(container, c)

            return {
                get Name() {
                    return 'name from dependency'
                }
            }
        }
    }]

    container.resolveWithDependencies(Test1Base, dependencies)

    test.done()
})

tap.test<Context>('resolves with no dependency is the same', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())
    builder.register(Test1Base)
        .as(c => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })

    const container = builder.build()
    const actualNative = container.resolve<Test3>(Test1Base)

    const dependencies = [{
        service: Test2Base,
        factory: () => {
            return {
                get Name() {
                    return 'name from dependency'
                }
            }
        }
    }]

    const actualDynamic = container.resolveWithDependencies<Test3>(Test1Base, dependencies)

    test.notEqual(actualDynamic, actualNative)
    test.ok(actualNative instanceof Test3)
    test.equal(actualNative.Name, 'Test 3 test 2')

    test.done()
})

tap.test<Context>('resolution error when no dependencies', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())

    builder.register(Test1Base)
        .as(c => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })

    const container = builder.build()

    const delegate = (dependencies: IDynamicDependency[]) => () =>
        container.resolveWithDependencies<Test3>(Test1Base, dependencies)

    const error = new ResolutionError({ message: 'No dependencies provided' })
    test.throws(delegate(null as any as IDynamicDependency[]), error)
    test.throws(delegate(undefined as any as IDynamicDependency[]), error)
    test.throws(delegate([]), error)

    test.done()
})

tap.test<Context>('resolution error when no registration with dependencies', (test) => {

    const { builder } = test.context

    builder.register(Test2Base)
        .as(() => new Test2())

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        factory: () => {
            return {
                get Name() {
                    return 'name from dependency'
                }
            }
        }
    }]

    const delegate = () => container.resolveWithDependencies(Test1Base, dependencies)

    test.throws(delegate,
        new ResolutionError({ message: 'Could not resolve service', data: Test1Base }))

    test.done()
})

tap.test<Context>('resolution error when no dependencies registration', (test) => {

    const { builder } = test.context

    builder.register(Test1Base)
        .as(c => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        factory: () => {
            return {
                get Name() {
                    return 'name from dependency'
                }
            }
        }
    }]

    const delegate = () => container.resolveWithDependencies(Test1Base, dependencies)

    test.throws(delegate, new ResolutionError({
        message: 'Could not resolve service', data: Test2Base
    }))

    test.done()
})

tap.test<Context>('resolve with missing dependency', (test) => {

    const { builder } = test.context

    builder.register(Test1Base)
        .as(c => {
            const test2 = c.resolve<Test2>(Test2Base)
            return new Test3(test2)
        })

    const container = builder.build()

    const dependencies = [{
        service: Test2Base,
        required : false,
        factory : () => {
            return {
                get Name() {
                    return 'name from dependency'
                }
            }
        }
    }]

    const actual = container.resolveWithDependencies<Test1>(Test1Base, dependencies)

    test.ok(actual)
    test.equal(actual.Name, 'Test 3 name from dependency')

    test.done()
})

tap.test<Context>('resolve with partial missing dependencies', (test) => {

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
        named: 'Test 4',
        factory: () => ({
            get Name () {
                return 'test 4 base'
            }
        })
    }]

    const actual = <{Name : string}>container.resolveWithDependencies(dynamicService, dependencies)
    test.ok(actual)
    test.ok(actual instanceof Test7)
    test.equal(actual.Name, 'test 1 base test 2 base test 4 base')

    test.done()
})

tap.test<Context>('resolve with dependencies throws when wrong dependency format', (test) => {

    const { builder } = test.context

    const container = builder.build()

    const dependencies: IDynamicDependency[] = [{
        service: Test2Base,
        factory: () => {
            return {
                get Name() {
                    return 'name from dependency'
                }
            }
        },
        factoryValue: 123
    }]

    const delegate = () => {
        container.resolveWithDependencies<Test1>(Test1Base, dependencies)
    }

    test.throws(delegate, new ApplicationError({ message: 'Unknown registration type' }))

    test.done()
})

tap.test<Context>('resolve with dependencies throws when no service', (test) => {

    const { builder } = test.context

    const container = builder.build()

    const dependencies: IDynamicDependency[] = [{
        service: null as unknown as {},
        factory: () => {
            return {
                get Name() {
                    return 'name from dependency'
                }
            }
        }
    }]

    const delegate = () => {
        container.resolveWithDependencies<Test1>(Test1Base, dependencies)
    }

    test.throws(delegate, new ResolutionError({
        message: 'Could not resolve service',
        data: Test1Base
    }))

    test.done()
})
