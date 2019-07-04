import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { builder, IContainerBuilder } from '@lib'
import { Test2Base, Test1, Test2, Test4 } from '@data/base'

type Context = {
    builder: IContainerBuilder
}

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = builder()
    done()
})

tap.test<Context>('asSelf resolves basic', (test) => {
    const { builder } = test.context

    builder.register(Test1).asSelf()

    const container = builder.build()
    const actual = container.resolve<Test1>(Test1)

    test.ok(actual)
    test.equal(actual.Name, 'test 1')
    test.done()
})

tap.test<Context>('asSelf resolves with params', (test) => {
    const { builder } = test.context

    builder.register(Test4).asSelf()
    const container = builder.build()
    const actual = container.resolve<Test4>(Test4, '---')

    test.ok(actual)
    test.equal(actual.Name, '---')
    test.done()
})

tap.test<Context>('asSelf resolves with multiple params', (test) => {
    const { builder } = test.context

    const service = function (arg1: number, arg2: number, arg3: number) {
        // @ts-ignore
        this.name = `${arg1} ${arg2} ${arg3}`
    }

    builder.register(service).asSelf()
    const container = builder.build()
    const actual = container.resolve<{name: string}>(service, 1, 2, 3)

    test.ok(actual)
    test.equal(actual.name, '1 2 3')
    test.done()
})

tap.test<Context>('asSelf resolves with dependencies', (test) => {
    const { builder } = test.context

    const test4 = function () {
        // @ts-ignore
        this.Name = 'test 4'
    }

    const test7 = function (arg1: any, arg2: any, arg3: any) {
        // @ts-ignore
        this.Name = `${arg1.Name} ${arg2.Name} ${arg3.Name}`
    }

    builder.register(Test1).asSelf()
    builder.register(Test2Base).asType(Test2)
    builder.register(test4).asSelf()
    builder.register(test7)
            .asSelf(Test1, Test2Base, test4)

    const container = builder.build()
    const actual = container.resolve<{Name: string}>(test7)

    test.ok(actual)
    test.equal(actual.Name, 'test 1 test 2 test 4')
    test.done()
})
