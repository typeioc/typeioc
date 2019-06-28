import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IContainerBuilder, scope, ResolutionError, ScopeType } from '@lib'
import { Test1Base, Test1, Test4 } from '@data/base'

type Context = { builder: IContainerBuilder }

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = typeioc.createBuilder()
    done()
})

tap.test<Context>('service registered on parent resolve on child container', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test1())
        .within(scope.hierarchy)

    const container = builder.build()
    const child = container.createChild()

    const test1 = child.resolve<Test1>(Test1Base)

    test.equal(test1.Name, 'test 1')
    test.done()
})

tap.test<Context>('service registered named on parent resolves named on child container',
(test) => {

    const { builder } = test.context

    const registrationName = 'name reg'

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test1())
        .named(registrationName)
        .within(scope.hierarchy)

    const container = builder.build()
    const child = container.createChild()

    const test1 = child.resolveNamed<Test1>(Test1Base, registrationName)

    test.equal(test1.Name, 'test 1')
    test.done()
})

tap.test<Context>('service registered on parent resolves on child container no hierarchy',
(test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test1())

    const container = builder.build()
    const child = container.createChild()

    const test1 = child.resolve<Test1>(Test1Base)

    test.equal(test1.Name, 'test 1')
    test.done()
})

tap.test<Context>('hierarchy scoped instance is reused on same container',
(test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('test 4'))
        .within(scope.hierarchy)

    const container = builder.build()
    const test1 = container.resolve<Test4>(Test1Base)
    test1.Name = 'test 1'
    const test2 = container.resolve<Test4>(Test1Base)

    test.equal(test1.Name, 'test 1')
    test.equal(test2.Name, 'test 1')
    test.equal(test1, test2)
    test.done()
})

tap.test<Context>('scope hierarchy instance is reused on same container child first',
(test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('test 4'))
        .within(scope.hierarchy)

    const container = builder.build()
    const child = container.createChild()

    const test1 = child.resolve<Test4>(Test1Base)
    test1.Name = 'test 1'
    const test2 = container.resolve<Test4>(Test1Base)

    test.equal(test1.Name, 'test 1')
    test.equal(test2.Name, 'test 1')
    test.equal(test1, test2)

    test.done()
})

tap.test<Context>('container scoped instance is not reused on child container', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('test 4'))
        .within(scope.container)

    const container = builder.build()
    const child = container.createChild()

    const test1 = container.resolve<Test4>(Test1Base)
    test1.Name = 'test 1'
    const test2 = child.resolve<Test4>(Test1Base)

    test.equal(test1.Name, 'test 1')
    test.equal(test2.Name, 'test 4')
    test.notEqual(test1, test2)

    test.done()
})

tap.test<Context>('unknown scope error', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('test 4'))
        .within(5 as unknown as ScopeType)

    const container = builder.build()
    const child = container.createChild()

    const delegate = () => child.resolve(Test1Base)

    test.throws(delegate, new ResolutionError({ message: 'Unknown scoping' }))

    test.done()
})
