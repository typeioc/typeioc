import sinon from 'sinon'
import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { createResolve, Context } from '@common/interceptor'
import typeioc, { CallInfo, ISubstituteInfo } from '@lib'

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.resolve = createResolve({
        builder: typeioc.createBuilder(),
        interceptor: typeioc.createInterceptor()
    })

    done()
})

tap.test<Context>('proxy prototype method with args', (test) => {
    const { resolve } = test.context

    class Parent {
        public foo(arg1: number, arg2: number) {
            this.stub()
            return this.arg1 + arg1 + arg2
        }

        constructor(private stub : Function, private arg1 : number) {}
    }

    const stub = sinon.stub()

    const proto = resolve(Parent, Parent)
    const instance = new proto(stub, 1)

    test.equal(6, instance.foo(2, 3))
    test.ok(stub.calledOnce)
    test.done()
})

tap.test<Context>('proxy inherited prototype method with args', (test) => {

    const { resolve } = test.context

    class GrandParent {
        public foo(arg1: number, arg2: number) {
            this.stub()
            return arg1 + arg2
        }

        constructor(private stub: Function) {}
    }

    class Parent extends GrandParent {
        constructor(stub: Function) {
            super(stub)
        }
    }

    const stub = sinon.stub()

    const proto = resolve(Parent, Parent)
    const instance = new proto(stub)

    test.equal(instance.foo(1, 2), 3)
    test.ok(stub.calledOnce)
    test.done()
})

tap.test<Context>('proxy static method with args', (test) => {
    const { resolve } = test.context
    const stub = sinon.stub()

    class Parent {
        public static foo(arg1: number, arg2: number) {
            stub()
            return arg1 + arg2
        }
    }

    const proto = resolve(Parent, Parent)

    test.equal(proto.foo(1, 2), 3)
    test.ok(stub.calledOnce)
    test.done()
})

tap.test<Context>('proxy cross method', (test) => {

    const { resolve } = test.context

    class Parent {
        constructor(private barStub : Function, private fooStub : Function) { }

        public bar(arg: number) {
            let result = 0

            if (arg > 0) {
                result = arg + this.foo(arg - 1)
            }

            this.barStub()
            return result
        }

        public foo(arg: number) {
            let result = 0

            if (arg > 0) {
                result = arg + this.bar(arg - 1)
            }

            this.fooStub()
            return result
        }
    }

    const fooStub = sinon.stub()
    const barStub = sinon.stub()

    const proto = resolve(Parent, Parent)
    const instance = new proto(barStub, fooStub)

    test.equal(instance.foo(5), 15)
    test.ok(fooStub.calledThrice)
    test.ok(barStub.calledThrice)

    test.done()
})

tap.test<Context>('proxy cross method field', (test) => {

    const { resolve } = test.context

    class Parent {
        private bar: number = 1

        public foo(arg: number) {

            let result = 0

            if (arg > this.bar) {
                result = arg + this.foo(arg - 1)
            }

            this.stub()
            return result
        }

        constructor(private stub: Function) {}
    }

    const fooStub = sinon.stub()
    const proto = resolve(Parent, Parent)
    const instance = new proto(fooStub)

    test.equal(instance.foo(5), 14)
    test.equal(fooStub.callCount, 5)

    test.done()
})

tap.test<Context>('proxy cross method property', (test) => {
    const { resolve } = test.context

    class Parent {
        private _innerValue: number = 5

        public get prop(): number {
            this.getStub()
            return this._innerValue
        }

        public set prop(value : number) {
            this.setStub()
            this._innerValue = value
        }

        constructor(
            private getStub: Function,
            private setStub: Function,
            private fooStub: Function) {}

        public foo() {
            let result = 0

            if (this.prop > 0) {
                this.prop = this.prop - 1
                result = this.prop + this.foo()
            }

            this.fooStub()
            return result
        }
    }

    const fooStub = sinon.stub()
    const getStub = sinon.stub()
    const setStub = sinon.stub()

    const proto = resolve(Parent, Parent)
    const instance = new proto(getStub, setStub, fooStub)

    test.equal(instance.foo(), 10)
    test.equal(fooStub.callCount, 6)
    test.equal(getStub.callCount, 16)
    test.equal(setStub.callCount, 5)

    test.done()
})

tap.test<Context>('decorate prototype field', (test) => {

    const { resolve } = test.context

    class Parent {
        public foo: number = 1
    }

    const fieldStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method : 'foo',
        type: CallInfo.Field,
        wrapper: (callInfo) => {
            const args = callInfo.args
            fieldStub(args)
            return 2 * callInfo.invoke(args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto()

    test.equal(instance.foo, 2)
    instance.foo = 12
    test.equal(instance.foo, 24)
    test.ok(fieldStub.calledThrice)

    test.done()
})

tap.test<Context>('decorate prototype method by name', (test) => {

    const { resolve } = test.context

    class Parent {
        constructor(private stub: Function, private arg1: number) {}

        public foo() {
            this.stub()
            return this.arg1
        }
    }

    const stub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.Method,
        wrapper: (callInfo) => {
            return 2 * callInfo.invoke()
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(stub, 2)

    test.equal(instance.foo(), 4)
    test.ok(stub.calledOnce)

    test.done()
})

tap.test<Context>('decorate inherited prototype method', (test) => {
    const { resolve } = test.context

    class GrandParent {
        constructor(private stub: Function) {}

        public foo() {
            this.stub()
            return 3
        }
    }

    class Parent extends GrandParent {
        constructor(stub: Function) {
            super(stub)
        }
    }

    const stub = sinon.stub()
    const wrapperStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.Method,
        wrapper: (callInfo) => {
            wrapperStub()
            return 3 * callInfo.invoke()
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(stub)

    test.equal(instance.foo(), 9)
    test.ok(stub.calledOnce)
    test.ok(wrapperStub.calledOnce)

    test.done()
})

tap.test<Context>('decorate static method', (test) => {

    const { resolve } = test.context
    const stub = sinon.stub()

    class Parent {
        public static foo() {
            stub()
            return 3
        }
    }

    const wrapperStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.Method,
        wrapper: (callInfo) => {
            wrapperStub()
            return 3 * callInfo.invoke()
        }
    }

    const proto = resolve(Parent, Parent, [substitute])

    test.equal(proto.foo(), 9)
    test.ok(stub.calledOnce)
    test.ok(wrapperStub.calledOnce)

    test.done()
})

tap.test<Context>('decorate prototype method by chain', (test) => {
    const { resolve } = test.context

    class Parent {
        constructor(private stub : Function, private arg: number) {}

        public foo(arg2: number, arg3: number) {
            this.stub()
            return this.arg + arg2 + arg3
        }
    }

    const stub = sinon.stub()
    const wrapperStub = sinon.stub()

    const substitute1: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.Method,
        wrapper: (callInfo) => {
            wrapperStub()
            const result = callInfo.invoke(callInfo.args)
            return 1 + callInfo.next!(result)
        }
    }

    const substitute2: ISubstituteInfo = {
        method: 'foo',
        wrapper: (callInfo) => {
            wrapperStub()
            return 1 + callInfo.result + callInfo.invoke(callInfo.args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute1, substitute2])
    const instance = new proto(stub, 1)

    test.equal(instance.foo(2, 3), 14)
    test.ok(stub.calledTwice)
    test.ok(wrapperStub.calledTwice)

    test.done()
})

tap.test<Context>('decorate prototype method by chain multi invoke', (test) => {
    const { resolve } = test.context

    class Parent {
        constructor(private stub: Function, private arg1: number) {}

        public foo(arg2: number, arg3: number) {
            this.stub()
            return this.arg1 + arg2 + arg3
        }
    }

    const stub = sinon.stub()
    const wrapperStub = sinon.stub()

    const substitute1: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.Method,
        wrapper: (callInfo) => {
            wrapperStub()
            const result = callInfo.invoke(callInfo.args)
            return 1 + callInfo.next!(result)
        }
    }

    const substitute2: ISubstituteInfo  = {
        method: 'foo',
        wrapper: (callInfo) => {
            wrapperStub()
            return 1 + callInfo.result + callInfo.invoke(callInfo.args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute1, substitute2])
    const instance = new proto(stub, 1)

    test.equal(instance.foo(2, 3), 14)
    test.ok(stub.calledTwice)
    test.ok(wrapperStub.calledTwice)

    test.equal(instance.foo(2, 3), 14)
    test.done()
})

tap.test<Context>('decorate inherited prototype method by chain', (test) => {
    const { resolve } = test.context

    class GrandParent {
        constructor(private stub: Function, private arg1: number) { }

        public foo(arg2: number, arg3: number) {
            this.stub()
            return this.arg1 + arg2 + arg3
        }
    }

    class Parent extends GrandParent {
        constructor(stub: Function, arg1: number) {
            super(stub, arg1)
        }
    }

    const stub = sinon.stub()
    const wrapperStub = sinon.stub()

    const substitute1: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.Method,
        wrapper: (callInfo) => {

            wrapperStub()
            const result = callInfo.invoke(callInfo.args)
            return 1 + callInfo.next!(result)
        }
    }

    const substitute2: ISubstituteInfo = {
        method: 'foo',
        wrapper: (callInfo) => {
            wrapperStub()
            return 1 + callInfo.result + callInfo.invoke(callInfo.args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute1, substitute2])
    const instance = new proto(stub, 1)

    test.equal(instance.foo(2, 3), 14)
    test.ok(stub.calledTwice)
    test.ok(wrapperStub.calledTwice)

    test.done()
})

tap.test<Context>('decorate static method by chain', (test) => {
    const { resolve } = test.context
    const stub = sinon.stub()
    const wrapperStub = sinon.stub()

    class Parent {
        public static foo(arg1: number, arg2: number) {
            stub()
            return 1 + arg1 + arg2
        }
    }

    const substitute1: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.Method,
        wrapper: (callInfo) => {
            wrapperStub()
            const result = callInfo.invoke(callInfo.args)
            return 1 + callInfo.next!(result)
        }
    }

    const substitute2: ISubstituteInfo = {
        method: 'foo',
        wrapper: (callInfo) => {
            wrapperStub()
            return 1 + callInfo.result + callInfo.invoke(callInfo.args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute1, substitute2])

    test.equal(proto.foo(2, 3), 14)
    test.ok(stub.calledTwice)
    test.ok(stub.calledTwice)

    test.done()
})
