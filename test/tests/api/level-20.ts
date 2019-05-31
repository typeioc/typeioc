import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IDecorator, CircularDependencyError } from '@lib'

type Context = {
    decorator: IDecorator
}

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.decorator = typeioc.createDecorator()
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

tap.test<Context>('resolve throws when multiple services', (test) => {
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
