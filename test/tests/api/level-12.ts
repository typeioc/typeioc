import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { createResolve, Context } from '@common/interceptor'
import {
    builder, interceptor as createInterceptor, ISubstituteInfo, ICallInfo, callInfo
} from '@lib'

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.resolve = createResolve({
        builder: builder(),
        interceptor: createInterceptor()
    })

    done()
})

tap.test<Context>('decorate recursive method', (test) => {
    const { resolve } = test.context

    class Parent {
        constructor(public start: number) { }

        public rec(value: number): number {
            if (!value) {
                return value
            }

            this.start = value
            return value + this.rec(value - 1)
        }

    }

    const proto = resolve(Parent, Parent)
    const instance = new proto(-1)

    test.equal(instance.rec(3), 6)
    test.equal(instance.start, 1)
    test.done()
})

tap.test<Context>('proxy recursive method by override', (test) => {
    const { resolve } = test.context

    class Parent {
        constructor(public start: number) { }

        public rec(value: number): number {

            if (!value) {
                return value
            }

            this.start = value
            return value + this.rec(value - 1)
        }

    }

    const substitute: ISubstituteInfo = {
        method: 'rec',
        wrapper: (info: ICallInfo) => {
            return info.args[0] + 1
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(-1)

    test.equal(instance.rec(3), 4)
    test.equal(instance.start, -1)

    test.done()
})

tap.test<Context>('proxy recursive method', (test) => {
    const { resolve } = test.context

    class Parent {
        constructor(public start: number) { }

        public rec(value: number): number {

            if (!value) {
                return value
            }

            this.start = value
            return value + this.rec(value - 1)
        }
    }

    const substitute: ISubstituteInfo = {
        method: 'rec',
        wrapper: (info: ICallInfo) => {
            info.args[0] -= 1
            return info.invoke(info.args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(-1)

    test.equal(instance.rec(3), 2)
    test.equal(instance.start, 2)
    test.done()
})

tap.test<Context>('proxy recursive property', (test) => {
    const { resolve } = test.context

    class Parent {
        public get foo(): number {

            if (this.start <= 0) return this.start

            this.start -= 1
            return this.foo
        }

        public set foo(value) {
            if (!value) return

            this.start = value
            this.foo = value - 1
        }

        constructor(public start: number) {}
    }

    const proto = resolve(Parent, Parent)

    const instance = new proto(0)
    instance.foo = 10

    test.equal(instance.start, 1)

    instance.start = 10
    test.equal(instance.foo, 0)
    test.done()
})

tap.test<Context>('decorate recursive property by override', (test) => {
    const { resolve } = test.context

    class Parent {
        public get foo(): number {

            if (this.start <= 0) return this.start

            this.start -= 1
            return this.foo
        }

        public set foo(value) {
            if (!value) return

            this.start = value
            this.foo = value - 1
        }

        constructor(public start: number) {}
    }

    const substitute: ISubstituteInfo = {
        method: 'foo',
        wrapper(info: ICallInfo) {
            if (info.type === callInfo.getter) {
                return 3
            }

            if (info.type === callInfo.setter) {
                // @ts-ignore
                this.start = 11
            }

            return undefined
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(0)
    instance.foo = 10

    test.equal(instance.start, 11)

    instance.start = 10
    test.equal(instance.foo, 3)

    test.done()
})

tap.test<Context>('decorate recursive property', (test) => {
    const { resolve } = test.context

    class Parent {
        public get foo(): number {

            if (this.start <= 0) return this.start

            this.start -= 1
            return this.foo
        }

        public set foo(value) {
            if (!value) return

            this.start = value
            this.foo = value - 1
        }

        constructor(public start: number) {}
    }

    const substitute: ISubstituteInfo = {
        method: 'foo',
        wrapper(info: ICallInfo) {
            if (info.type === callInfo.getter) {

                // @ts-ignore
                if (this.start === 3) {
                    // @ts-ignore
                    return this.start * this.start
                }

                // @ts-ignore
                this.start -= 1
                // @ts-ignore
                return this.foo
            }

            if (info.type === callInfo.setter) {
                info.invoke([3])
            }
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(0)
    instance.foo = 10

    test.equal(instance.start, 1)

    instance.start = 10
    test.equal(instance.foo, 9)

    test.done()
})

tap.test<Context>('use get set for callInfo invoke', (test) => {

    const { resolve } = test.context

    class Parent {
        public get foo() {
            return this.start
        }

        public set foo(value) {
            this.start = value
        }

        constructor(public start: number) {}
    }

    const substitute: ISubstituteInfo = {
        method: 'foo',
        wrapper(info: ICallInfo) {
            if (info.type === callInfo.getter) {
                return info.get!() + 1
            }

            if (info.type === callInfo.setter) {
                info.set!(info.args[0] + 1)
            }
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(0)
    instance.foo = 10

    test.equal(instance.start, 11)
    test.equal(instance.foo, 12)

    test.done()
})

tap.test<Context>('set \"get\" and \"set\" to null when method', (test) => {
    const { resolve } = test.context

    test.plan(2)

    class Parent {
        constructor(private start: number) {}

        public foo() {
            return this.start
        }
    }

    const substitute: ISubstituteInfo = {
        method: 'foo',
        wrapper(info: ICallInfo) {
            test.notOk(info.get)
            test.notOk(info.set)
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(0)
    instance.foo()

    test.done()
})

tap.test<Context>('call invoke with non array parameter', (test) => {
    const { resolve } = test.context

    class Parent {
        constructor(public start: number) {}

        public foo(value: number) {
            return this.start = value
        }
    }

    const substitute: ISubstituteInfo = {
        method: 'foo',
        wrapper(info: ICallInfo) {
            return info.invoke(info.args[0]) + info.invoke(info.args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(0)

    test.equal(instance.foo(100), 200)
    test.equal(instance.start, 100)

    test.done()
})

tap.test<Context>('call set with exact value', (test) => {
    const { resolve } = test.context

    class Parent {
        public get foo() {
            return this.start
        }

        public set foo(value) {
            this.start = value
        }

        constructor(public start: number | number[]) {}
    }

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.setter,
        wrapper(info: ICallInfo) {
            info.set!(info.args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(0)
    instance.foo = 10

    test.equal((instance.start as number[])[0], 10)
    test.done()
})

tap.test<Context>('resolve by prototype method with args value', (test) => {
    const { resolve } = test.context

    class Parent {
        constructor(public start: number) {}

        public foo(value: number) {
            return this.start = value
        }
    }

    const substitute: ISubstituteInfo = {
        method: 'foo',
        wrapper(info: ICallInfo) {
            return info.invoke(info.args[0]) + info.invoke(info.args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(0)

    test.equal(instance.foo(100), 200)
    test.equal(instance.start, 100)

    test.done()
})

tap.test<Context>('decorate triple proxy', (test) => {
    const { resolve } = test.context

    class Parent {
        constructor(public start: number) { }

        public foo(value: number) {
            return this.start + value
        }
    }

    const substitute: ISubstituteInfo = {
        method: 'foo',
        wrapper: (info: ICallInfo) => {
            const result = info.invoke(info.args)
            return info.next!(result)
        }
    }

    const substitute1: ISubstituteInfo = {
        method: 'foo',
        wrapper(info: ICallInfo) {
            const result = info.invoke(info.args)
            return info.next!(info.result + result)
        }
    }

    const substitute2: ISubstituteInfo = {
        method: 'foo',
        wrapper(info: ICallInfo) {
            return info.invoke(info.args) + info.result + 1.5
        }
    }

    const proto = resolve(Parent, Parent, [substitute, substitute1, substitute2])
    const instance = new proto(1)

    test.equal(instance.foo(1), 7.5)

    test.done()
})

tap.test<Context>('decorate 100 method proxies', (test) => {
    const { resolve } = test.context

    class Parent {
        public foo(value: number) {
            return value
        }
    }

    class Accumulator {
        constructor(public start: number) {}

        public add(value: number) {
            this.start += value
        }
    }

    const substitutes: ISubstituteInfo[] = []
    let index = 0
    const limit = 100
    const acc = new Accumulator(0)

    while (substitutes.length < limit) {
        substitutes.push({
            method: 'foo',
            wrapper(info: ICallInfo) {
                index += 1
                acc.add(index)
                return info.invoke(index) + (index === limit ? 0 : info.next!())
            }
        })
    }

    const proto = resolve(Parent, Parent, substitutes)
    const instance = new proto()

    const actual = instance.foo(1)
    test.equal(actual, acc.start)

    test.done()
})

tap.test('decorate multiple method interceptions', (test) => {
    const interceptor = createInterceptor()

    class Parent {
        constructor(public start: string) {}

        public foo(value: string) {
            return this.start + value
        }
    }

    const substitute1: ISubstituteInfo = {
        method: 'foo',
        wrapper() {
            const second = interceptor.intercept(Parent, [substitute2])
            return `substitute 1 ${new second('2').foo('2')}`
        }
    }

    const substitute2: ISubstituteInfo = {
        method: 'foo',
        wrapper() {
            const third = interceptor.intercept(Parent, [substitute3])
            return `substitute 2 ${new third('2').foo('2')}`
        }
    }

    const substitute3: ISubstituteInfo = {
        method: 'foo',
        wrapper() {
            return 'substitute 3'
        }
    }

    const proto = interceptor.intercept(Parent, [substitute1])
    const instance = new proto('1')

    test.equal(instance.foo('some value 1'), 'substitute 1 substitute 2 substitute 3')
    test.done()
})

tap.test('intercept prototype', (test) => {
    const interceptor = createInterceptor()

    class Parent {

        get start() {
            return this._start
        }

        constructor(private _start: number) { }

        public getStart() {
            return this.start + 1
        }

    }

    const proto = interceptor.interceptPrototype(Parent, [{
        method: 'start',
        type: callInfo.getter,
        wrapper(info: ICallInfo) {
            return info.get!() + 1
        }
    }, {
        method: 'getStart',
        type: callInfo.method,
        wrapper(info: ICallInfo) {
            return info.invoke() + 1
        }
    }])

    const instance = new proto(10)

    test.equal(instance.start, 11)
    test.equal(instance.getStart(), 13)
    test.done()
})

tap.test('intercept instance', (test) => {
    const interceptor = createInterceptor()

    class Parent {

        get start() {
            return this._start
        }

        constructor(private _start: number) { }

        public getStart() {
            return this.start + 1
        }

    }

    const instance = interceptor.interceptInstance(new Parent(10), [{
        method: 'start',
        type: callInfo.getter,
        wrapper(info: ICallInfo) {
            return info.get!() + 1
        }
    }, {
        method: 'getStart',
        type: callInfo.method,
        wrapper(info: ICallInfo) {
            return info.invoke() + 1
        }
    }])

    test.equal(instance.start, 11)
    test.equal(instance.getStart(), 13)
    test.done()
})

tap.test('intercept built in instance', (test) => {

    const interceptor = createInterceptor()

    const math = interceptor.interceptInstance(Math, [{
        method: 'abs',
        type: callInfo.method,
        wrapper(info: ICallInfo) {
            return info.args[0] * info.args[0]
        }
    }])

    test.equal(math.abs(3), 9)
    test.equal(math.abs(-3), 9)
    test.done()
})

tap.test('intercept returns instance when no substitutes', (test) => {
    const interceptor = createInterceptor()

    const math = interceptor.intercept(Math)

    test.equal(math.pow(2, 0.5), Math.pow(2, 0.5))
    test.done()
})
