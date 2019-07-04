import sinon from 'sinon'
import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { createResolve, Context } from '@common/interceptor'
import { builder, interceptor, callInfo, ICallInfo, ISubstituteInfo } from '@lib'

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.resolve = createResolve({
        builder: builder(),
        interceptor: interceptor()
    })

    done()
})

tap.test<Context>('decorate prototype getter for full property', (test) => {

    const { resolve } = test.context

    class Parent {
        private _innerValue: number = 0

        public get foo() {
            this.getStub()
            return this._innerValue
        }

        public set foo(value: number) {
            this.setStub()
            this._innerValue = value
        }

        constructor(private getStub: Function, private setStub: Function) {}
    }

    const getStub = sinon.stub()
    const setStub = sinon.stub()
    const wrapperStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.getter,
        wrapper: (callInfo) => {
            wrapperStub()
            return 2 * (callInfo.invoke() as number)
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(getStub, setStub)
    instance.foo = 2

    const result = instance.foo

    test.equal(result, 4)
    test.ok(getStub.calledOnce)
    test.ok(setStub.calledOnce)
    test.ok(wrapperStub.calledOnce)

    test.done()
})

tap.test<Context>('decorate prototype setter for full property', (test) => {
    const { resolve } = test.context

    class Parent {
        private _innerValue: number = 10

        public get foo() {
            this.getStub()
            return this._innerValue
        }

        public set foo(value : number) {
            this.setStub()
            this._innerValue = value
        }

        constructor(private getStub : Function, private setStub : Function) {}
    }

    const getStub = sinon.stub()
    const setStub = sinon.stub()
    const wrapperStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.setter,
        wrapper: (info: ICallInfo) => {
            wrapperStub()
            const arg = 2 * info.args[0]
            return info.invoke(arg)
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(getStub, setStub)
    instance.foo = 2

    const result = instance.foo

    test.equal(result, 4)
    test.ok(getStub.calledOnce)
    test.ok(setStub.calledOnce)
    test.ok(wrapperStub.calledOnce)

    test.done()
})

tap.test<Context>('decorate prototype setter', (test) => {
    const { resolve } = test.context

    class Parent {
        public set foo(value: any) {
            this.setStub(value)
        }

        constructor(private setStub : Function) {}
    }

    const setStub = sinon.stub()
    const wrapperStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.setter,
        wrapper: (info: ICallInfo) => {
            wrapperStub()
            const arg = 2 * info.args[0]
            return info.invoke(arg)
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(setStub)
    instance.foo = 2

    test.ok(setStub.withArgs(4).calledOnce)
    test.ok(wrapperStub.calledOnce)
    test.done()
})

tap.test<Context>('decorate with copy of args', (test) => {
    const { resolve } = test.context

    class Parent {
        public static foo(arg1: number, arg2: number) {
            stub()
            return 1 + arg1 + arg2
        }
    }

    const stub = sinon.stub()
    const wrapperStub = sinon.stub()

    const substitute1: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.method,
        wrapper: (info: ICallInfo) => {

            wrapperStub()
            const args = info.args
            args[0] = -1

            const result = info.invoke(args)
            return 1 + info.next!(result)
        }
    }

    const substitute2: ISubstituteInfo  = {
        method: 'foo',
        wrapper: (info: ICallInfo) => {
            wrapperStub()
            return 1 + info.result + info.invoke(info.args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute1, substitute2])

    test.equal(proto.foo(2, 3), 11)
    test.ok(stub.calledTwice)
    test.ok(stub.calledTwice)

    test.done()
})

tap.test<Context>('decorate prototype full property', (test) => {
    const { resolve } = test.context

    class Parent {
        private _innerValue: number = 0

        public get foo() {
            this.getStub()
            return this._innerValue
        }

        public set foo(value : number) {
            this.setStub()
            this._innerValue = value
        }

        constructor(private getStub : Function, private setStub : Function) {}
    }

    const getStub = sinon.stub()
    const setStub = sinon.stub()
    const wrapperStub = sinon.stub()
    const getterWrapperStub = sinon.stub()
    const setterWrapperStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.getterSetter,
        wrapper: (info: ICallInfo) => {
            wrapperStub()

            if (info.type === callInfo.getter) {
                getterWrapperStub()
                return 3 + info.invoke()
            }

            if (info.type === callInfo.setter) {
                setterWrapperStub()
                info.invoke(2 * info.args[0])
            }
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(getStub, setStub)
    instance.foo = 2

    const result = instance.foo

    test.equal(result, 7)
    test.ok(getStub.calledOnce)
    test.ok(setStub.calledOnce)
    test.ok(wrapperStub.calledTwice)
    test.ok(getterWrapperStub.calledOnce)
    test.ok(setterWrapperStub.calledOnce)

    test.done()
})

tap.test<Context>('decorate inherited prototype full property', (test) => {
    const { resolve } = test.context

    class GrandParent {
        private _innerValue : number = 111

        public get foo() {
            this.getStub()
            return this._innerValue
        }

        public set foo(value: number) {
            this.setStub()
            this._innerValue = value
        }

        constructor(private getStub: Function, private setStub: Function) { }
    }

    class Parent extends GrandParent {
        constructor(getStub: Function, setStub: Function) {
            super(getStub, setStub)
        }
    }

    const getStub = sinon.stub()
    const setStub = sinon.stub()
    const wrapperStub = sinon.stub()
    const getterWrapperStub = sinon.stub()
    const setterWrapperStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.getterSetter,
        wrapper: (info: ICallInfo) => {
            wrapperStub()

            if (info.type === callInfo.getter) {
                getterWrapperStub()
                return 3 + info.invoke()
            }

            if (info.type === callInfo.setter) {
                setterWrapperStub()
                info.invoke(2 * info.args[0])
            }
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    const instance = new proto(getStub, setStub)
    instance.foo = 2

    const result = instance.foo

    test.equal(result, 7)
    test.ok(getStub.calledOnce)
    test.ok(setStub.calledOnce)
    test.ok(wrapperStub.calledTwice)
    test.ok(getterWrapperStub.calledOnce)
    test.ok(setterWrapperStub.calledOnce)

    test.done()
})

tap.test<Context>('decorate_cross method', (test) => {
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
    const fooWrapperStub = sinon.stub()
    const barStub = sinon.stub()
    const barWrapperStub = sinon.stub()

    const substitute1: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.method,
        wrapper: (info: ICallInfo) => {
            fooWrapperStub()
            return 1 + info.invoke(info.args)
        }
    }

    const substitute2: ISubstituteInfo = {
        method: 'bar',
        type: callInfo.method,
        wrapper: (info: ICallInfo) => {
            barWrapperStub()
            return 2 + info.invoke(info.args)
        }
    }

    const proto = resolve(Parent, Parent, [substitute1, substitute2])
    const instance = new proto(barStub, fooStub)

    test.equal(instance.foo(3), 12)
    test.ok(fooStub.calledTwice)
    test.ok(barStub.calledTwice)

    test.done()
})

tap.test<Context>('decorate cross method property', (test) => {
    const { resolve } = test.context

    class Parent {
        private _foo = 3

        public bar(arg: number) {
            let result = 0

            if (arg > 0) {
                result = this.foo + this.bar(arg - 1)
            }

            this.barStub()
            return result
        }

        public get foo() {
            this.fooStub()
            return this._foo
        }

        constructor(private barStub: Function, private fooStub: Function) { }
    }

    const fooStub = sinon.stub()
    const fooWrapperStub = sinon.stub()
    const barStub = sinon.stub()
    const barWrapperStub = sinon.stub()

    const substitute1: ISubstituteInfo = {
        method: 'bar',
        type: callInfo.method,
        wrapper: (info: ICallInfo) => {
            barWrapperStub()
            return 1 + info.invoke(info.args)
        }
    }

    const substitute2: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.getter,
        wrapper: (info: ICallInfo) => {
            fooWrapperStub()
            return 2 + info.invoke()
        }
    }

    const proto = resolve(Parent, Parent, [substitute1, substitute2])
    const instance = new proto(barStub, fooStub)

    test.equal(instance.bar(3), 19)
    test.equal(fooStub.callCount, 3)
    test.equal(fooWrapperStub.callCount, 3)
    test.equal(barStub.callCount, 4)
    test.equal(barWrapperStub.callCount, 4)

    test.done()
})

tap.test<Context>('decorate static full property', (test) => {
    const { resolve } = test.context

    class Parent {
        private static _innerValue: number

        public static get foo() {
            getStub()
            return Parent._innerValue
        }

        public static set foo(value : number) {
            setStub()
            Parent._innerValue = value
        }
    }

    const getStub = sinon.stub()
    const setStub = sinon.stub()
    const wrapperStub = sinon.stub()
    const getterWrapperStub = sinon.stub()
    const setterWrapperStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.getterSetter,
        wrapper: (info: ICallInfo) => {
            wrapperStub()
            if (info.type === callInfo.getter) {
                getterWrapperStub()
                return 3 + info.invoke()
            }

            if (info.type === callInfo.setter) {
                setterWrapperStub()
                info.invoke(2 * info.args[0])
            }
        }
    }

    const proto = resolve(Parent, Parent, [substitute])
    proto.foo = 2

    const result = proto.foo

    test.equal(result, 7)
    test.ok(getStub.calledOnce)
    test.ok(setStub.calledOnce)
    test.ok(wrapperStub.calledTwice)
    test.ok(getterWrapperStub.calledOnce)
    test.ok(setterWrapperStub.calledOnce)

    test.done()
})

tap.test<Context>('decorate cross static full property', (test) => {
    const { resolve } = test.context

    class Parent {
        private static _barValue: number
        private static _fooValue: number

        public static get bar() {
            getBarStub()
            return Parent._barValue + Parent.foo
        }

        public static set bar(value) {
            setBarStub()
            Parent._barValue = value
        }

        public static get foo() {
            getFooStub()
            return Parent._fooValue
        }

        public static set foo(value) {
            setFooStub()
            Parent.bar = value
            Parent._fooValue = value
        }
    }

    const getBarStub = sinon.stub()
    const setBarStub = sinon.stub()
    const getterWrapperFooStub = sinon.stub()
    const setterWrapperFooStub = sinon.stub()
    const getFooStub = sinon.stub()
    const setFooStub = sinon.stub()
    const getterWrapperBarStub = sinon.stub()
    const setterWrapperBarStub = sinon.stub()

    const substitute1: ISubstituteInfo = {
        method: 'foo',
        type: callInfo.getterSetter,
        wrapper: (info: ICallInfo) => {
            if (info.type === callInfo.getter) {
                getterWrapperFooStub()
                return 3 + info.invoke()
            }

            if (info.type === callInfo.setter) {
                setterWrapperFooStub()
                info.invoke(2 * info.args[0])
            }
        }
    }

    const substitute2: ISubstituteInfo = {
        method: 'bar',
        type: callInfo.getterSetter,
        wrapper: (info: ICallInfo) => {
            if (info.type === callInfo.getter) {
                getterWrapperBarStub()
                return 1 + info.invoke()
            }

            if (info.type === callInfo.setter) {
                setterWrapperBarStub()
                info.invoke(3 * info.args[0])
            }
        }
    }

    const proto = resolve(Parent, Parent, [substitute1, substitute2])
    proto.foo = 2
    proto.bar = 2

    const resultFoo = proto.foo
    const resultBar = proto.bar

    test.equal(resultFoo, 7)
    test.equal(resultBar, 11)

    test.equal(getBarStub.callCount, 1)
    test.equal(setBarStub.callCount, 2)

    test.equal(getterWrapperFooStub.callCount, 1)
    test.equal(setterWrapperFooStub.callCount, 1)

    test.equal(getFooStub.callCount, 2)
    test.equal(setFooStub.callCount, 1)

    test.equal(getterWrapperBarStub.callCount, 1)
    test.equal(setterWrapperBarStub.callCount, 1)

    test.done()
})
