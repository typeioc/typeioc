import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IDecorator, IContainerBuilder, CircularDependencyError } from '@lib'

type Context = {
    decorator: IDecorator
    builder: IContainerBuilder
}

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.decorator = typeioc.createDecorator()
    setUp!.context.builder = typeioc.createBuilder()
    done()
})

tap.test<Context>('resolve throws when two services', (test) => {
    const { decorator } = test.context

    abstract class ABase {}

    abstract class BBase {}

    @decorator.provide<A>(ABase).register()
    // @ts-ignore
    class A extends ABase {
        constructor(
            // @ts-ignore
            private _b: BBase) {
            super()
        }
    }

    @decorator.provide<B>(BBase).register()
    // @ts-ignore
    class B extends BBase {
        constructor(
            // @ts-ignore
            private _a: ABase) {
            super()
        }
    }

    const container = decorator.build()

    test.throws(() => {
        container.resolve(ABase)
    }, new CircularDependencyError('class ABase'))

    test.throws(() => {
        container.resolve(BBase)
    }, new CircularDependencyError('class BBase'))

    test.done()
})

tap.test<Context>('resolve throws when decorator circular dependencies', (test) => {
    const { decorator } = test.context

    abstract class ABase {}
    abstract class BBase {}
    abstract class CBase {}

    @decorator.provide<A>(ABase).register()
    // @ts-ignore
    class A extends ABase {
        constructor(
            // @ts-ignore
            private _b: BBase) {
            super()
        }
    }

    @decorator.provide<B>(BBase).register()
    // @ts-ignore
    class B extends BBase {
        constructor(
            // @ts-ignore
            private _c: CBase) {
            super()
        }
    }

    @decorator.provide<C>(CBase).register()
    // @ts-ignore
    class C extends CBase {
        constructor(@decorator.by(ABase).resolve()
        // @ts-ignore
        private _a: ABase) {
            super()
        }
    }

    const container = decorator.build()

    test.throws(() => {
        container.resolve(CBase)
    }, new CircularDependencyError('class CBase'))

    test.done()
})

tap.test<Context>('resolve throws when circular dependencies', (test) => {
    const { builder } = test.context

    class A {
        constructor(private b: B) {
            console.log(this.b)
        }
    }

    class B {
        constructor(private a: A) {
            console.log(this.a)
        }
    }

    builder.register('Service A')
    .as((c) => {
        const b = c.resolve<B>('Service B')
        return new A(b)
    })

    builder.register('Service B')
    .as((c) => {
        const a = c.resolve<A>('Service A')
        return new B(a)
    })

    const container = builder.build()

    test.throws(() => {
        container.resolve('Service A')
    }, 'Circular dependency for service: Service A')

    test.done()
})
