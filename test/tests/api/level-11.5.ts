import sinon from 'sinon'
import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { createResolve, Context } from '@common/interceptor'
import typeioc, { ISubstituteInfo, CallInfo } from '@lib'

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.resolve = createResolve({
        builder: typeioc.createBuilder(),
        interceptor: typeioc.createInterceptor()
    })

    done()
})

tap.test<Context>('decorate prototype field', (test) => {
    const { resolve } = test.context

    class Parent {
        public foo: number = 1
    }

    const fieldStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.Field,
        wrapper: (callInfo) => {
            const args = callInfo.args
            fieldStub(args)
            return 2 * callInfo.invoke(args)
        }
    }

    const object = new Parent()
    const instance = resolve(Parent, object, [substitute])

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

    const object = new Parent(stub, 2)
    const instance = resolve(Parent, object, [substitute])

    test.equal(instance.foo(), 4)
    test.ok(stub.calledOnce)

    test.done()
})

tap.test<Context>('decorate inherited prototype method', (test) => {
    const { resolve } = test.context

    class GrandParent {
        constructor(private stub : Function) {}

        public foo() {
            this.stub()
            return 3
        }
    }

    class Parent extends GrandParent {
        constructor(stub : Function) {
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

    const object = new Parent(stub)
    const instance = resolve(Parent, object, [substitute])

    test.equal(instance.foo(), 9)
    test.ok(stub.calledOnce)
    test.ok(wrapperStub.calledOnce)

    test.done()
})

tap.test<Context>('decorate prototype method by chain', (test) => {
    const { resolve } = test.context

    class Parent {
        constructor(private stub: Function, private arg: number) {}

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

    const object = new Parent(stub, 1)
    const instance = resolve(Parent, object, [substitute1, substitute2])

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

    const object = new Parent(stub, 1)
    const instance = resolve(Parent, object, [substitute1, substitute2])

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

    const object = new Parent(stub, 1)
    const instance = resolve(Parent, object, [substitute1, substitute2])

    test.equal(instance.foo(2, 3), 14)
    test.ok(stub.calledTwice)
    test.ok(wrapperStub.calledTwice)

    test.done()
})

tap.test<Context>('decorate prototype getter for full property', (test) => {
    const { resolve } = test.context

    class Parent {
        private _innerValue: number = 10

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
        type: CallInfo.Getter,
        wrapper: (callInfo) => {
            wrapperStub()
            return 2 * callInfo.invoke()
        }
    }

    const object = new Parent(getStub, setStub)
    const instance = resolve(Parent, object, [substitute])
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
        type: CallInfo.Setter,
        wrapper: (callInfo) => {
            wrapperStub()
            return callInfo.invoke(2 * callInfo.args[0])
        }
    }

    const object = new Parent(getStub, setStub)
    const instance = resolve(Parent, object, [substitute])
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
        public set foo(value: number) {
            this.setStub(value)
        }

        constructor(private setStub : Function) {}
    }

    const setStub = sinon.stub()
    const wrapperStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.Setter,
        wrapper: (callInfo) => {
            wrapperStub()
            return callInfo.invoke(2 * callInfo.args[0])
        }
    }

    const object = new Parent(setStub)
    const instance = resolve(Parent, object, [substitute])
    instance.foo = 2

    test.ok(setStub.withArgs(4).calledOnce)
    test.ok(wrapperStub.calledOnce)
    test.done()
})

tap.test<Context>('decorate prototype full property', (test) => {
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
    const getterWrapperStub = sinon.stub()
    const setterWrapperStub = sinon.stub()

    const substitute: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.GetterSetter,
        wrapper: (callInfo) => {
            wrapperStub()

            if (callInfo.type === CallInfo.Getter) {
                getterWrapperStub()
                return 3 + callInfo.invoke()
            }

            if (callInfo.type === CallInfo.Setter) {
                setterWrapperStub()
                callInfo.invoke(2 * callInfo.args[0])
            }
        }
    }

    const object = new Parent(getStub, setStub)
    const instance = resolve(Parent, object, [substitute])
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

        public set foo(value : number) {
            this.setStub()
            this._innerValue = value
        }

        constructor(private getStub : Function, private setStub : Function) { }
    }

    class Parent extends GrandParent {
        constructor(getStub : Function, setStub : Function) {
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
        type: CallInfo.GetterSetter,
        wrapper: (callInfo) => {
            wrapperStub()

            if (callInfo.type === CallInfo.Getter) {
                getterWrapperStub()
                return 3 + callInfo.invoke()
            }

            if (callInfo.type === CallInfo.Setter) {
                setterWrapperStub()
                callInfo.invoke(2 * callInfo.args[0])
            }
        }
    }

    const object = new Parent(getStub, setStub)
    const instance = resolve(Parent, object, [substitute])
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

tap.test<Context>('decorate cross method', (test) => {
    const { resolve } = test.context

    class Parent {
        constructor(private barStub: Function, private fooStub: Function) { }

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
        type: CallInfo.Method,
        wrapper: (callInfo) => {
            fooWrapperStub()
            return 1 + callInfo.invoke(callInfo.args)
        }
    }

    const substitute2: ISubstituteInfo = {
        method: 'bar',
        type: CallInfo.Method,
        wrapper: (callInfo) => {
            barWrapperStub()
            return 2 + callInfo.invoke(callInfo.args)
        }
    }

    const object = new Parent(barStub, fooStub)
    const instance = resolve(Parent, object, [substitute1, substitute2])

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

        constructor(private barStub : Function, private fooStub : Function) { }
    }

    const fooStub = sinon.stub()
    const fooWrapperStub = sinon.stub()
    const barStub = sinon.stub()
    const barWrapperStub = sinon.stub()

    const substitute1: ISubstituteInfo = {
        method: 'bar',
        type: CallInfo.Method,
        wrapper: (callInfo) => {
            barWrapperStub()
            return 1 + callInfo.invoke(callInfo.args)
        }
    }

    const substitute2: ISubstituteInfo = {
        method: 'foo',
        type: CallInfo.Getter,
        wrapper: (callInfo) => {
            fooWrapperStub()
            return 2 + callInfo.invoke()
        }
    }

    const object = new Parent(barStub, fooStub)
    const instance = resolve(Parent, object, [substitute1, substitute2])

    test.equal(instance.bar(3), 19)
    test.equal(fooStub.callCount, 3)
    test.equal(fooWrapperStub.callCount, 3)
    test.equal(barStub.callCount, 4)
    test.equal(barWrapperStub.callCount, 4)

    test.done()
})

tap.test('decorate Math', (test) => {

    const interceptor = typeioc.createInterceptor()

    const math = interceptor.intercept(Math, [{
        wrapper : (callInfo) => callInfo.next!(`${callInfo.result} 2`)
    }, {
        method: 'pow',
        wrapper : (callInfo) => callInfo.next!(callInfo.args[0] + callInfo.args[1])
    }, {
        wrapper : (callInfo) => `${callInfo.result} 3`
    }, {
        method: 'pow',
        wrapper : (callInfo) => callInfo.next!(`${callInfo.result} 1`)
    }, {
        method: 'round',
        wrapper : (callInfo) => callInfo.next!(callInfo.args[0])
    }])

    test.equal(math.pow(2, 3), '5 1 2 3')
    test.equal(math.round(5.777), '5.777 2 3')
    test.done()
})
