import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { builder, IContainerBuilder, scope } from '@lib'
import { Test1Base, Test1, Test4 } from '@data/base'

type Context = { builder: IContainerBuilder }

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = builder()
    done()
})

tap.test('scope is exported', (test) => {
    test.equal(scope.none, 1)
    test.equal(scope.container, 2)
    test.equal(scope.hierarchy, 3)

    test.equal(scope.none, 1)
    test.equal(scope.container, 2)
    test.equal(scope.hierarchy, 3)

    test.done()
})

tap.test<Context>('default scoping is none, different instances (no reuse)', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('test 4'))

    const container = builder.build()
    const test1 = container.resolve<Test1>(Test1Base)
    test1.Name = 'test 1'
    const test2 = container.resolve<Test1>(Test1Base)

    test.equal(test1.Name, 'test 1')
    test.equal(test2.Name, 'test 4')
    test.notEqual(test1, test2)

    test.done()
})

tap.test<Context>('scope none behaves as no instance reuse', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('test 4'))
        .within(scope.none)

    const container = builder.build()
    const test1 = container.resolve<Test4>(Test1Base)
    test1.Name = 'test 1'
    const test2 = container.resolve<Test4>(Test1Base)

    test.equal(test1.Name, 'test 1')
    test.equal(test2.Name, 'test 4')
    test.notEqual(test1, test2)

    test.done()
})

tap.test<Context>('transient scope returns new instance', (test) => {

    const { builder } = test.context

    builder.register(Test1Base)
        .as(() => new Test4('test 4'))
        .transient()

    const container = builder.build()
    const child1 = container.createChild()
    const child2 = child1.createChild()

    const actual1 = container.resolve<Test1Base>(Test1Base)
    const actual2 = container.resolve<Test1Base>(Test1Base)
    const actual3 = child1.resolve<Test1Base>(Test1Base)
    const actual4 = child2.resolve<Test1Base>(Test1Base)

    test.equal(actual1.Name, 'test 4')
    test.equal(actual2.Name, 'test 4')
    test.equal(actual3.Name, 'test 4')
    test.equal(actual4.Name, 'test 4')
    test.notEqual(actual1, actual2)
    test.notEqual(actual1, actual3)
    test.notEqual(actual1, actual4)
    test.notEqual(actual2, actual3)
    test.notEqual(actual2, actual4)
    test.notEqual(actual3, actual4)

    test.done()
})

tap.test<Context>('scope container different instances across containers', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test4('test 4'))
        .within(scope.container)

    const container = builder.build()
    const test1 = container.resolve<Test4>(Test1Base)
    test1.Name = 'test 1'

    const child = container.createChild()
    const test2 = child.resolve<Test4>(Test1Base)

    test.equal(test1.Name, 'test 1')
    test.equal(test2.Name, 'test 4')
    test.notEqual(test1, test2)

    test.done()
})

tap.test<Context>('instance per container returns different instances across containers',
(test) => {

    const { builder } = test.context

    builder.register(Test1Base)
    .as(() => new Test4('test 4'))
    .instancePerContainer()

    const container = builder.build()
    const child = container.createChild()

    const actual11 = container.resolve(Test1Base)
    const actual12 = container.resolve(Test1Base)
    const actual21 = child.resolve(Test1Base)
    const actual22 = child.resolve(Test1Base)

    test.equal(actual11, actual12)
    test.equal(actual21, actual22)
    test.notEqual(actual11, actual21)
    test.notEqual(actual11, actual22)
    test.notEqual(actual12, actual21)
    test.notEqual(actual12, actual22)

    test.done()
})

tap.test<Context>('scope hierarchy reuses instances across containers', (test) => {

    const { builder } = test.context

    builder.register(Test1Base)
        .as(() => new Test4('test 4'))
        .within(scope.hierarchy)

    const container = builder.build()
    const test1 = container.resolve<Test1>(Test1Base)
    test1.Name = 'test 1'

    const child = container.createChild()
    const test2 = child.resolve<Test1>(Test1Base)

    test.equal(test1.Name, 'test 1')
    test.equal(test2.Name, 'test 1')
    test.equal(test1, test2)

    test.done()
})

tap.test<Context>('singleton returns same instance within and across containers', (test) => {

    const { builder } = test.context

    builder.register(Test1Base)
    .as(() => new Test4('test 4'))
    .singleton()

    const container = builder.build()
    const child1 = container.createChild()
    const child2 = child1.createChild()

    const actual1 = container.resolve<Test1Base>(Test1Base)
    const actual2 = container.resolve(Test1Base)
    const actual3 = child1.resolve(Test1Base)
    const actual4 = child2.resolve(Test1Base)

    test.equal(actual1.Name, 'test 4')
    test.equal(actual1, actual2)
    test.equal(actual1, actual3)
    test.equal(actual1, actual4)
    test.equal(actual2, actual3)
    test.equal(actual2, actual4)
    test.equal(actual3, actual4)

    test.done()
})

tap.test<Context>('resolution with arguments returns new instances for scope hierarchy', (test) => {

    const { builder } = test.context

    builder.register(Test1Base)
        .as((_c, data: string) => new Test4(data))
        .within(scope.hierarchy)

    const container = builder.build()
    const child = container.createChild()
    const test1 = container.resolve<Test1Base>(Test1Base, 'A')
    const test2 = container.resolve<Test1Base>(Test1Base, 'B')
    const test3 = child.resolve<Test1Base>(Test1Base, 'A')
    const test4 = child.resolve<Test1Base>(Test1Base, 'B')

    test.notEqual(test1, test2)
    test.notEqual(test2, test3)
    test.notEqual(test3, test4)
    test.equal(test1.Name, 'A')
    test.equal(test2.Name, 'B')
    test.equal(test3.Name, 'A')
    test.equal(test4.Name, 'B')

    test.done()
})

tap.test<Context>('resolution with arguments returns new instance for container', (test) => {

    const { builder } = test.context

    builder.register(Test1Base)
        .as((_c, data: string) => new Test4(data))
        .within(scope.container)

    const container = builder.build()
    const test1 = container.resolve<Test1Base>(Test1Base, 'A')
    const test2 = container.resolve<Test1Base>(Test1Base, 'B')

    test.notEqual(test1, test2)
    test.equal(test1.Name, 'A')
    test.equal(test2.Name, 'B')

    test.done()
})
