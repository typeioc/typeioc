import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IContainerBuilder } from '@lib'
import { Test1Base, Test2Base, Test1 } from '@data/base'

type Context = {
    builder1: IContainerBuilder
    builder2: IContainerBuilder
}

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context = {
        builder1: typeioc.createBuilder(),
        builder2: typeioc.createBuilder()
    }

    done()
})

tap.test<Context>('copy copies registrations', (test) => {
    const { builder1, builder2 } = test.context

    builder1.register('testData.TestBase1').asType(Test1)
    builder1.register(Test1).asSelf()
    builder1.register(Test2Base).as(() => 123)
    builder1.register('value').asValue('test - value')

    builder2.copy(builder1)

    const container = builder2.build()

    test.equal(container.resolve<Test1Base>('testData.TestBase1').Name, 'test 1')
    test.equal(container.resolve<Test1Base>(Test1).Name, 'test 1')
    test.equal(container.resolve(Test2Base), 123)
    test.equal(container.resolve('value'), 'test - value')

    test.done()
})

tap.test<Context>('copy keeps source registrations', (test) => {
    const { builder1, builder2 } = test.context

    builder1.register('testData.TestBase1').asType(Test1)
    builder1.register(Test1).asSelf()
    builder1.register(Test2Base).as(() => 123)
    builder1.register('value').asValue('test - value')

    builder2.copy(builder1)

    const container1 = builder1.build()
    const container2 = builder2.build()

    test.equal(container1.resolve<Test1Base>('testData.TestBase1').Name, 'test 1')
    test.equal(container1.resolve<Test1>(Test1).Name, 'test 1')
    test.equal(container1.resolve(Test2Base), 123)
    test.equal(container1.resolve('value'), 'test - value')

    test.equal(container2.resolve<Test1Base>('testData.TestBase1').Name, 'test 1')
    test.equal(container2.resolve<Test1>(Test1).Name, 'test 1')
    test.equal(container2.resolve(Test2Base), 123)
    test.equal(container2.resolve('value'), 'test - value')

    test.done()
})

tap.test<Context>('copy keeps destination registrations', (test) => {
    const { builder1, builder2 } = test.context

    builder1.register('testData.TestBase1').asType(Test1)
    builder1.register(Test1).asSelf()
    builder2.register(Test2Base).as(() => 123)
    builder2.register('value').asValue('test - value')

    builder2.copy(builder1)

    const container2 = builder2.build()

    test.equal(container2.resolve<Test1Base>('testData.TestBase1').Name, 'test 1')
    test.equal(container2.resolve<Test1>(Test1).Name, 'test 1')
    test.equal(container2.resolve(Test2Base), 123)
    test.equal(container2.resolve('value'), 'test - value')
    test.done()
})
