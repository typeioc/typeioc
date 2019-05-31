import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IContainer, DecoratorError } from '@lib'
import * as ValueResolution from '@data/decorator/resolution/by-value'
import * as ServiceResolution from '@data/decorator/resolution/by-service'
import * as MultiServiceResolution from '@data/decorator/resolution/by-multiple-services'
import * as ArgsResolution from '@data/decorator/resolution/by-args'
import * as NameResolution from '@data/decorator/resolution/by-name'
import * as AttemptResolution from '@data/decorator/resolution/by-attempt'
import * as CacheResolution from '@data/decorator/resolution/by-cache'
import * as FullResolution from '@data/decorator/resolution/full-api'
import * as DepPropsResolution from '@data/decorator/resolution/dependencies-props'
import * as DepInitResolution from '@data/decorator/resolution/dependencies-init'
import * as DepNotReqResolution from '@data/decorator/resolution/dependencies-not-required'
import * as ObjectResolution from '@data/decorator/resolution/object-resolution'
import * as NumberResolution from '@data/decorator/resolution/number-resolution'
import * as MultiDecorator from '@data/decorator/resolution/multi-decorators'

type Context = {
    value: IContainer
    service: IContainer
    multiService: IContainer
    args: IContainer
    name: IContainer
    attempt: IContainer
    cache: IContainer
    fullApi: IContainer
    dependenciesProps: IContainer
    dependenciesInit: IContainer
    dependenciesNotReq: IContainer
    object: IContainer,
    byNumber: IContainer
    multiDecorator: {
        container: IContainer,
        container2: IContainer
    }
}

tap.beforeEach<Context>((done, setUp) => {

    const { context } = setUp!

    context.value = ValueResolution.decorator.build()
    context.service = ServiceResolution.decorator.build()
    context.multiService = MultiServiceResolution.decorator.build()
    context.args = ArgsResolution.decorator.build()
    context.name = NameResolution.decorator.build()
    context.attempt = AttemptResolution.decorator.build()
    context.cache = CacheResolution.decorator.build()
    context.fullApi = FullResolution.decorator.build()
    context.dependenciesProps = DepPropsResolution.decorator.build()
    context.dependenciesInit = DepInitResolution.decorator.build()
    context.dependenciesNotReq = DepNotReqResolution.decorator.build()
    context.object = ObjectResolution.decorator.build()
    context.byNumber = NumberResolution.decorator.build()
    context.multiDecorator = {
        container: MultiDecorator.decorator.build(),
        container2: MultiDecorator.decorator2.build()
    }

    done()
})

tap.test<Context>('resolveValue instantiation', (test) => {
    const { value } = test.context

    const actual = value.resolve<ValueResolution.TestBase>(ValueResolution.TestBase)

    test.equal(actual.foo(), 'Test1 : decorator value')
    test.done()
})

tap.test<Context>('multiple resolveValue instantiation', (test) => {
    const { value } = test.context

    const actual = value.resolve<ValueResolution.TestBase1>(ValueResolution.TestBase1)

    test.equal(actual.foo(), 'Test1 :  0 false   NaN')
    test.done()
})

tap.test<Context>('resolve by service instantiation', (test) => {
    const { service } = test.context

    const actual = service
        .resolve<ServiceResolution.TestBase1>(ServiceResolution.TestBase1)

    test.equal(actual.foo(), 'Test1 : Test Test2 Test')
    test.done()
})

tap.test<Context>('resolve by multiple service instantiation', (test) => {
    const { multiService } = test.context

    const actual1 = multiService
        .resolve<MultiServiceResolution.TestBase1>(MultiServiceResolution.TestBase1)
    const actual2 = multiService
        .resolve<MultiServiceResolution.TestBase2>(MultiServiceResolution.TestBase2)

    test.equal(actual1.foo(), 'Test1 Test Test')
    test.equal(actual2.foo(), 'Test2 Test1 Test Test Test')

    test.done()
})

tap.test<Context>('resolve by args instantiation', (test) => {
    const { args } = test.context

    const actual = args.resolve<ArgsResolution.TestBase1>(ArgsResolution.TestBase1)
    test.equal(actual.foo(), 'Test1 : Test 1 7')

    test.done()
})

tap.test<Context>('resolve by args directly', (test) => {
    const { args } = test.context

    const actual = args
        .resolve<ArgsResolution.TestBase>(ArgsResolution.TestBase, 11, 17)
    test.equal(actual.foo(), 'Test 11 17')

    test.done()
})

tap.test<Context>('resolve by name', (test) => {
    const { name } = test.context

    const actual = name.resolve<NameResolution.TestBase1>(NameResolution.TestBase1)
    test.equal(actual.foo(), 'Test1 : Test Test Test')
    test.done()
})

tap.test<Context>('resolve by attempt', (test) => {
    const { attempt } = test.context

    const actual = attempt
        .resolve<AttemptResolution.TestBase>(AttemptResolution.TestBase)

    test.equal(actual.foo(), 'Test no value Test1')

    const actual2 = attempt
        .tryResolve<AttemptResolution.TestBase>(AttemptResolution.TestBase)!

    test.equal(actual2.foo(), 'Test no value Test1')

    test.done()
})

tap.test<Context>('resolve by cache', (test) => {
    const { cache } = test.context

    const actual = cache.resolve<CacheResolution.TestBase1>(CacheResolution.TestBase1)

    test.equal(actual.foo(), 'Test1 : Test')

    const actual2 = <CacheResolution.TestBase>cache.cache['TestBase']

    test.ok(actual2)
    test.equal(actual2.foo(), 'Test')

    test.done()
})

tap.test('decorator target error', (test) => {
    const delegate = function () {
        const classDecorator = typeioc.createDecorator().provide('Test').register()
        classDecorator('Test' as unknown as Function)
    }

    test.throws(delegate, new DecoratorError({
        message: 'Decorator target not supported, not a prototype',
        data: { target: 'Test' }
    }))

    test.done()
})

tap.test<Context>('resolve full api', (test) => {
    const { fullApi } = test.context

    const actual1 = fullApi
        .resolveWith<FullResolution.TestBase3>(FullResolution.TestBase3)
        .args(1, 2)
        .name('Some name')
        .cache()
        .exec()

    test.ok(actual1)
    test.equal(actual1.foo(), 'Test 1 2')

    const actual2 = <FullResolution.TestBase>fullApi.cache['Some name']
    test.equal(actual2.foo(), 'Test 1 2')

    test.done()
})

tap.test<Context>('resolve with dependency', (test) => {
    const { fullApi } = test.context

    const dependencies = [{
        service: FullResolution.TestBase,
        factoryType: FullResolution.TestDep
    }]

    const actual = fullApi
        .resolveWith<FullResolution.TestBase1>(FullResolution.TestBase1)
        .dependencies(dependencies)
        .exec()

    test.ok(actual)
    test.equal(actual.foo(), 'Test dependency')

    test.done()
})

tap.test<Context>('resolve with multiple dependencies', (test) => {

    const { fullApi } = test.context

    const dependencies = [{
        service: FullResolution.TestBase,
        factoryType: FullResolution.TestDep
    }, {
        service: FullResolution.TestBase1,
        factoryType: FullResolution.TestDep1
    }, {
        service: FullResolution.TestBase3,
        factoryType: FullResolution.TestDep3,
        named: 'Some name'
    }]

    const actual = fullApi
        .resolveWith<FullResolution.TestBase2>(FullResolution.TestBase2)
        .dependencies(dependencies)
        .exec()

    test.ok(actual)
    test.equal(actual.foo(), 'Test dependency dependency 1 dependency 3')
    test.done()
})

tap.test<Context>('resolve with multiple dependencies with resolution value', (test) => {
    const { fullApi } = test.context

    const dependencies = [{
        service: FullResolution.TestBase,
        factoryType: FullResolution.TestDep
    }, {
        service: FullResolution.TestBase1,
        factoryType: FullResolution.TestDep1
    }, {
        service: FullResolution.TestBase3,
        factoryType: FullResolution.TestDep3,
        named: 'Some name'
    }]

    const actual = fullApi
        .resolveWith<FullResolution.TestBase4>(FullResolution.TestBase4)
        .dependencies(dependencies)
        .exec()

    test.ok(actual)
    test.equal(actual.foo(), 'Test dependency dependency 1 decorator value dependency 3')

    test.done()
})

tap.test<Context>('resolve with named dependencies', (test) => {
    const { dependenciesProps } = test.context

    const dependencies = [{
        service: DepPropsResolution.TestBase,
        factoryType: DepPropsResolution.TestDep,
        named : 'Some test name'
    }]

    const actual = dependenciesProps
        .resolveWith<DepPropsResolution.TestBase1>(DepPropsResolution.TestBase1)
        .dependencies(dependencies)
        .exec()

    test.ok(actual)
    test.equal(actual.foo(), 'Test dependency Some test name')

    test.done()
})

tap.test<Context>('resolve with initialized dependencies', (test) => {
    const { dependenciesInit } = test.context

    const actual = dependenciesInit
        .resolveWith<DepInitResolution.TestBase>('some TestInit')
        .exec()

    const actual2 = dependenciesInit
        .resolveWith<DepInitResolution.TestBase>('some TestInit')
        .dependencies({
            service: DepInitResolution.TestBase,
            factoryType: DepInitResolution.TestDep,
            initializer: (_c, item) => {
                (item as DepInitResolution.TestBase).foo =
                    function () { return 'Dependency initialized' }
                return item
            }
        })
        .exec()

    test.ok(actual)
    test.equal(actual.foo(), 'Test Initialized')
    test.equal(actual2.foo(), 'Test Dependency initialized')

    test.done()
})

tap.test<Context>('resolve with required dependencies', (test) => {
    const { dependenciesNotReq } = test.context

    const actual = dependenciesNotReq
        .resolveWith<DepNotReqResolution.TestBase>(DepNotReqResolution.TestBase)
        .dependencies({
            service: DepNotReqResolution.TestBase1,
            factoryType: DepNotReqResolution.TestDep,
            required : false
        })
        .exec()

    test.ok(actual)
    test.equal(actual.foo(), 'Test dependency')

    test.done()
})

tap.test<Context>('resolve by object string', (test) => {
    const { object } = test.context

    const actual = object
        .resolve<ObjectResolution.TestBase>(ObjectResolution.TestBase)

    test.equal(actual.foo(), 'Test Test1')

    test.done()
})

tap.test<Context>('resolve by object number', (test) => {
    const { byNumber } = test.context

    const actual = byNumber
        .resolve<NumberResolution.TestBase>(NumberResolution.TestBase)

    test.equal(actual.foo(), 'Test Test1')
    test.done()
})

tap.test<Context>('multiple decorators', (test) => {
    const { multiDecorator } = test.context

    const actual = multiDecorator.container
        .resolve<MultiDecorator.TestBase1>(MultiDecorator.TestBase1)

    const actual2 = multiDecorator.container2
        .resolve<MultiDecorator.TestBase1>(MultiDecorator.TestBase1)

    test.notEqual(actual, actual2)
    test.equal(actual.foo(), 'Test 1  Test Test2 Test3')
    test.equal(actual2.foo(), 'Test 1  Test Test2 Test3')

    test.done()
})
