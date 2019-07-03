import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { IContainer } from '@lib'
import * as Registration from '@data/decorator/registration'
import * as Initialization from '@data/decorator/initialization'
import * as Scoping from '@data/decorator/scope'
import * as Owing from '@data/decorator/owner'
import * as Named from '@data/decorator/named-registration'

type Context = {
    registration: IContainer
    initialization: IContainer
    scope: IContainer
    owner: IContainer
    name: IContainer
}

tap.beforeEach<Context>((done, setUp) => {

    const { context } = setUp!

    context.registration = Registration.decorator.build()
    context.initialization = Initialization.decorator.build()
    context.scope = Scoping.decorator.build()
    context.owner = Owing.decorator.build()
    context.name = Named.decorator.build()

    done()
})

tap.test<Context>('plain instantiation', (test) => {

    const { registration } = test.context

    const actual = registration
        .resolve<Registration.TestBase>(Registration.TestBase)

    test.ok(actual)
    test.equal(actual.foo(), 'Test : foo')
    test.done()
})

tap.test<Context>('instantiation with parameter resolution', (test) => {
    const { registration } = test.context

    const actual = registration
        .resolve<Registration.TestBase1>(Registration.TestBase1)

    test.ok(actual)
    test.equal(actual.foo1(), 'Test : foo : foo1')
    test.done()
})

tap.test<Context>('instantiation with multi parameter resolution', (test) => {
    const { registration } = test.context

    const actual = registration
        .resolve<Registration.TestBase2>(Registration.TestBase2)

    test.ok(actual)
    test.equal(actual.foo2(), 'Test : foo | Test : foo : foo1 | foo2')
    test.done()
})

tap.test<Context>('initializeBy usage', (test) => {
    const { initialization } = test.context

    const actual1 = initialization
        .resolve<Initialization.TestBase>(Initialization.TestBase)

    test.ok(actual1)
    test.equal(actual1.foo(), 'Test : foo foo 2')

    const actual2 = initialization
        .resolve<Initialization.TestBase1>(Initialization.TestBase1)

    test.ok(actual2)
    test.equal(actual2.foo(), 'foo 3 interceptor')
    test.done()
})

tap.test<Context>('scope none can resolve', (test) => {
    const { scope } = test.context

    const actual1 = scope.resolve<Scoping.TestBase>(Scoping.TestBase)
    const actual2 = scope.resolve<Scoping.TestBase>(Scoping.TestBase)
    const actual3 = scope.resolve<Scoping.TestBase>('None')
    const actual4 = scope.resolve<Scoping.TestBase>('None')

    test.ok(actual1 !== actual2)
    test.equal(actual1.foo(), 'Test : foo test none')
    test.equal(actual2.foo(), 'Test : foo test none')

    test.ok(actual3 !== actual4)
    test.equal(actual3.foo(), 'Test : foo test none')
    test.equal(actual4.foo(), 'Test : foo test none')

    test.done()
})

tap.test<Context>('scope container can resolve clone', (test) => {
    const { scope } = test.context

    const actual1 = scope.resolve<Scoping.TestBase2>(Scoping.TestBase2)
    const actual11 = scope.resolve<Scoping.TestBase2>('Container')
    const child = scope.createChild()
    const actual2 = child.resolve<Scoping.TestBase2>(Scoping.TestBase2)
    const actual21 = child.resolve<Scoping.TestBase2>('Container')

    test.equal(actual1.foo(), 'Test : foo test Container')
    test.equal(actual2.foo(), 'Test : foo test Container')
    test.notEqual(actual1, actual2)

    test.equal(actual11.foo(), 'Test : foo test Container')
    test.equal(actual21.foo(), 'Test : foo test Container')
    test.notEqual(actual11, actual21)

    test.done()
})

tap.test<Context>('scope hierarchy can resolve same instance', (test) => {
    const { scope } = test.context

    const actual1 = scope.resolve<Scoping.TestBase3>(Scoping.TestBase3)
    const actual11 = scope.resolve<Scoping.TestBase3>('Single')
    const child = scope.createChild()
    const actual2 = child.resolve<Scoping.TestBase3>(Scoping.TestBase3)
    const actual21 = child.resolve<Scoping.TestBase3>('Single')

    test.equal(actual1.foo(), 'Test : foo test Hierarchy')
    test.equal(actual2.foo(), 'Test : foo test Hierarchy')
    test.equal(actual1, actual2)

    test.equal(actual11.foo(), 'Test : foo test Hierarchy')
    test.equal(actual21.foo(), 'Test : foo test Hierarchy')
    test.equal(actual11, actual21)

    test.done()
})

tap.test<Context>('container owned instances are disposed', (test) => {
    const { owner } = test.context

    const child = owner.createChild()
    const actual1 = child.resolve<Owing.TestBase1>(Owing.TestBase1)
    const actual2 = child.resolve<Owing.TestBase1Api>(Owing.TestBase1Api)

    child.dispose()
    const result1 = actual1.foo()
    const result2 = actual2.foo()

    test.equal(result1, 'Test : foo disposed')
    test.equal(result2, 'Test : foo disposed')

    test.done()
})

tap.test<Context>('named instances resolved', (test) => {
    const { name } = test.context

    const actual1 = name.resolveNamed<Named.TestBase>(Named.TestBase, 'Some name')
    const actual2 = name.resolveNamed<Named.TestBase>(Named.TestBase, 'Some name 2')

    test.notEqual(actual1, actual2)
    test.equal(actual1.foo(), 'Test : foo test')
    test.equal(actual2.foo(), 'Test2 : foo test')

    test.done()
})
