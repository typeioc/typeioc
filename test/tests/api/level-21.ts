import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { builder, decorator, IDecorator, IContainerBuilder } from '@lib'

type Lazy = {
    value: number,
    next: Lazy
}

type Context = {
    decorator: IDecorator,
    builder: IContainerBuilder
}

tap.beforeEach<Context>((done, setUp) => {

    setUp!.context = {
        decorator: decorator(),
        builder: builder()
    }

    done()
})

tap.test<Context>('self resolution', (test) => {
    const { decorator } = test.context

    @decorator
    .provide<A>(A)
    .lazy()
    .register()
    class A {
        public get value() {
            return 'value'
        }

        public child() {
            const t = this.a as any as () => A
            return t()
        }

        constructor(private a: A) {
        }
    }

    const container = decorator.build()
    const a = container.resolve<() => A>(A)()

    test.equal(a.value, 'value')
    test.equal(a.child().value, 'value')

    test.done()
})

tap.test<Context>('self resolution param resolve', (test) => {
    const { decorator } = test.context

    type Application = () => A

    @decorator
    .provide<A>(A)
    .lazy()
    .register()
    class A {
        public get value() {
            return 'value'
        }

        public child() {
            return this.a()
        }

        constructor(@decorator.by(A).resolve() private a: Application) {
        }
    }

    const container = decorator.build()
    const a = container.resolve<Application>(A)()

    test.equal(a.value, 'value')
    test.equal(a.child().value, 'value')

    test.done()
})

tap.test<Context>('fibonacci', (test) => {
    const { decorator } = test.context

    @decorator
    .provide<F>(F)
    .lazy()
    .register()
    class F {
        constructor(@decorator.by(F).resolve() private f: () => F) {
        }

        public next(h: number, n: number) {
            const value = h
            const next = () => {
                return (this.f()).next(n, h + n)
            }

            return {
                value,
                get next() {
                    return next()
                }
            }
        }
    }

    const builder = decorator.build()

    const f = builder.resolve<() => F>(F)()
    const lazy = f.next(0, 1)

    const data = [...Array(10).keys()].reduce((acc, _current) => {
        acc.result.push(acc.lazy.value)
        acc.lazy = acc.lazy.next
        return acc
    }, { lazy, result: [] } as { lazy: Lazy, result: number[] })

    const expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

    test.strictSame(data.result, expected)
    test.done()
})

tap.test<Context>('chain resolution', (test) => {
    const { decorator } = test.context

    @decorator
    .provide<A>('A')
    .lazy()
    .register()
    class A {

        public get value() {
            return 'A'
        }

        public get next() {
            return this.b
        }

        constructor(@decorator.by('B').resolve() private b: any) {
        }
    }

    @decorator
    .provide<B>('B')
    .register()
    class B {
        public get value() {
            return 'B'
        }

        public get next() {
            return this.c()
        }

        constructor(@decorator.by('C').resolve() private c: () => C) {
        }
    }

    @decorator
    .provide<C>('C')
    .lazy()
    .register()
    class C {
        public get value() {
            return 'C'
        }

        public get next() {
            return this.a()
        }

        constructor(@decorator.by('A').resolve() private a: () => A) {
        }
    }

    const container = decorator.build()
    const a = container.resolve<() => A>('A')()
    const b = container.resolve<B>('B')
    const c = container.resolve<() => C>('C')()

    test.equal(a.value, 'A')
    test.equal(a.next.value, 'B')
    test.equal(b.next.value, 'C')
    test.equal(c.value, 'C')
    test.equal(c.next.value, 'A')

    test.done()
})

tap.test<Context>('factory decorator lazy side by side', (test) => {
    const { builder, decorator } = test.context

    interface IFib {
        value: number
        next: IFib
    }

    builder.register('F')
    .as((c, h, n) => {
        const a = c.resolve<() => IFib>('F', n, h + n)

        return {
            value: h,
            get next() {
                return a()
            }
        }
    })
    .lazy()

    @decorator
    .provide<F>(F)
    .lazy()
    .register()
    class F {
        constructor(@decorator.by(F).resolve() private f: () => F) { }

        public next(h: number, n: number) {

            const value = h
            const next = () => {
                return (this.f()).next(n, h + n)
            }

            return {
                value,
                get next() {
                    return next()
                }
            }
        }
    }

    decorator.import(builder)
    const container = decorator.build()

    const lazy1 = container.resolve<() => IFib>('F', 0, 1)()

    const data1 = [...Array(10).keys()].reduce((acc, _current) => {
        acc.result.push(acc.lazy.value)
        acc.lazy = acc.lazy.next
        return acc
    }, { lazy: lazy1, result: [] } as { lazy: Lazy, result: number[] })

    const f = container.resolve<() => F>(F)()
    const lazy2 = f.next(0, 1)

    const data2 = [...Array(10).keys()].reduce((acc, _current) => {
        acc.result.push(acc.lazy.value)
        acc.lazy = acc.lazy.next
        return acc
    }, { lazy: lazy2, result: [] } as { lazy: Lazy, result: number[] })

    test.strictSame(data1.result, data2.result)
    test.done()
})
