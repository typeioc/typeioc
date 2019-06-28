import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc,
    { IContainer, IContainerBuilder, scope, owner, ResolutionError } from '@lib'
import {
    Test1Base,
    Test1,
    Test5,
    Test6,
    Initializable,
    InitializableChild
} from '@data/base'

type Context = { builder: IContainerBuilder }

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.builder = typeioc.createBuilder()
    done()
})

tap.test('owner is exported', (test) => {
    test.equal(owner.container, 1)
    test.equal(owner.externals, 2)

    test.equal(owner.container, 1)
    test.equal(owner.externals, 2)

    test.done()
})

tap.test<Context>('registrations with dispose setting are disposed', (test) => {
    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item)  => { (item as Test5).dispose() })
        .within(scope.none)

    const container = builder.build()
    const test1 = container.resolve<Test5>(Test1Base)

    test.equal(test1.Disposed, false)
    container.dispose()
    test.equal(test1.Disposed, true)

    test.done()
})

tap.test<Context>('container owned instances are disposed', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item)  => { (item as Test5).dispose() })
        .within(scope.none)
        .ownedBy(owner.container)

    const container = builder.build()
    const test1 = container.resolve<Test5>(Test1Base)

    test.equal(test1.Disposed, false)
    container.dispose()
    test.equal(test1.Disposed, true)
    test.done()
})

tap.test<Context>('internally owned instances are disposed', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item) => { (item as Test5).dispose() })
        .within(scope.none)
        .ownedInternally()

    const container = builder.build()

    const test1 = container.resolve<Test5>(Test1Base)

    test.equal(test1.Disposed, false)
    container.dispose()
    test.equal(test1.Disposed, true)

    test.done()
})

tap.test<Context>('container owned instances are disposed', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item) => (item as Test5).dispose())
        .ownedBy(owner.container)

    const container = builder.build()
    const test1 = container.resolve<Test5>(Test1Base)

    test.equal(test1.Disposed, false)
    container.dispose()
    test.equal(test1.Disposed, true)

    test.done()
})

tap.test<Context>('container owned and container reused instances are disposed', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item)  => { (item as Test5).dispose() })
        .within(scope.container)
        .ownedBy(owner.container)

    const container = builder.build()
    const test1 = container.resolve<Test5>(Test1Base)

    test.equal(test1.Disposed, false)
    container.dispose()
    test.equal(test1.Disposed, true)
    test.done()
})

tap.test<Context>('container owned and hierarchy reused instances are disposed', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item)  => { (item as Test5).dispose() })
        .within(scope.hierarchy)
        .ownedBy(owner.container)

    const container = builder.build()
    const test1 = container.resolve<Test5>(Test1Base)

    test.equal(test1.Disposed, false)
    container.dispose()
    test.equal(test1.Disposed, true)

    test.done()
})

tap.test<Context>('child container instance with parent registration is not disposed', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item)  => { (item as Test5).dispose() })
        .within(scope.hierarchy)
        .ownedBy(owner.container)

    const container = builder.build()
    const child = container.createChild()

    const test1 = child.resolve<Test5>(Test1Base)
    child.dispose()

    test.equal(test1.Disposed, false)
    test.done()
})

tap.test<Context>('disposing parent container disposes child container instances', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item)  => { (item as Test5).dispose() })
        .within(scope.none)
        .ownedBy(owner.container)

    const container = builder.build()
    const child = container.createChild()

    const test1 = child.resolve<Test5>(Test1Base)

    test.equal(test1.Disposed, false)
    container.dispose()
    test.equal(test1.Disposed, true)

    test.done()
})

tap.test<Context>('disposing container does not dispose external owned instances', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base).as(() => new Test5()).
        within(scope.hierarchy).
        ownedBy(owner.externals)

    const container = builder.build()
    const child = container.createChild()

    const test1 = child.resolve<Test5>(Test1Base)

    container.dispose()
    test.equal(test1.Disposed, false)

    test.done()
})

tap.test<Context>('disposing container does not dispose hierarchically owned instances', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .within(scope.hierarchy)
        .ownedExternally()

    const container = builder.build()
    const child = container.createChild()

    const test1 = child.resolve<Test5>(Test1Base)

    test.equal(test1.Disposed, false)
    container.dispose()
    test.equal(test1.Disposed, false)
    test.done()
})

tap.test<Context>('disposing container removes all registrations', (test) => {
    const { builder } = test.context

    builder.register(Test1Base)
    .as(() => new Test1())
    .named('A')

    builder.register(Test1Base)
    .as(() => new Test5())
    .within(scope.hierarchy)
    .ownedInternally()

    const container = builder.build()
    const first = container.resolveNamed<Test1Base>(Test1Base, 'A')
    const second = container.resolve<Test1Base>(Test1Base)

    container.dispose()

    const first2 = container.tryResolveNamed<Test1Base>(Test1Base, 'A')
    const second2 = container.tryResolve<Test1Base>(Test1Base)

    const delegate1 = () => container.resolveNamed(Test1Base, 'A')
    const delegate2 = () => container.resolve(Test1Base)

    test.ok(first)
    test.ok(second)
    test.notOk(first2)
    test.notOk(second2)

    test.throws(delegate1, new ResolutionError({
        message: 'Could not resolve service',
        data: Test1Base
    }))

    test.throws(delegate2, new ResolutionError({
        message: 'Could not resolve service',
        data: Test1Base
    }))

    test.done()
})

tap.test<Context>('disposing container removes all child registrations', (test) => {

    const { builder } = test.context

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .within(scope.container)
        .ownedInternally()

    const container = builder.build()
    const child = container.createChild()

    const first = child.resolve(Test1Base)
    container.dispose()

    const delegate1 = () => child.resolve(Test1Base)

    test.ok(first)

    test.throws(delegate1, new ResolutionError({
        message: 'Could not resolve service',
        data: Test1Base
    }))

    test.done()
})

tap.test<Context>('initialize is called when instance is created', (test) => {

    const { builder } = test.context

    const className = 'item'

    builder.register<Initializable>(Initializable)
        .as(() => new InitializableChild()).
        initializeBy((_c, item) => { item.initialize(className); return item })

    const container = builder.build()

    const i1 = container.resolve<Initializable>(Initializable)

    test.equal(i1.name, className)
    test.done()
})

tap.test<Context>('initialize and resolve dependencies', (test) => {

    const { builder } = test.context

    const className = 'item'

    const initializer = (c: IContainer, item: Initializable) => {
        item.initialize(className)
        item.test6 = c.resolve<Test6>(Test6)
        return item
    }

    builder.register<Test6>(Test6).as(() => new Test6())

    builder.register<Initializable>(Initializable)
        .as(() => new Initializable())
        .initializeBy(initializer)

    const container = builder.build()
    const i1 = container.resolve<Initializable>(Initializable)

    test.equal(i1.name, className)
    test.ok(i1.test6)

    test.done()
})

tap.test<Context>('instances from different containers are disposed independently', (test) => {

    const { builder } = test.context

    const secondBuilder = typeioc.createBuilder()

    builder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item)  => (item as Test5).dispose())
        .within(scope.none)
        .ownedBy(owner.container)

    secondBuilder.register<Test1Base>(Test1Base)
        .as(() => new Test5())
        .dispose((item)  => { (item as Test5).dispose() })
        .within(scope.none)
        .ownedBy(owner.container)

    const container = builder.build()
    const secondContainer = secondBuilder.build()

    const test1 = container.resolve<Test1Base>(Test1Base)
    const test2 = secondContainer.resolve<Test1Base>(Test1Base)

    test.equal(test1.Disposed, false)
    test.equal(test2.Disposed, false)

    container.dispose()

    test.equal(test1.Disposed, true)
    test.equal(test2.Disposed, false)

    secondContainer.dispose()

    test.equal(test1.Disposed, true)
    test.equal(test2.Disposed, true)

    test.done()
})
