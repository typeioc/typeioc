import sinon from 'sinon'
import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import { createResolve, Context } from '@common/interceptor'
import typeioc from '@lib'

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.resolve = createResolve({
        builder: typeioc.createBuilder(),
        interceptor: typeioc.createInterceptor()
    })

    done()
})

tap.test<Context>('proxy prototype method', (test) => {
    const { resolve } = test.context

    class Parent {

        constructor(private arg1: number, private _stub: Function) { }

        public foo () {
            this._stub()
            return this.arg1
        }
    }

    const stub = sinon.stub()

    const object = new Parent(1, stub)
    const instance1 = resolve(Parent, object)
    const instance2 = resolve(Parent.prototype, object)

    test.equal(instance1.foo(), 1)
    test.equal(instance2.foo(), 1)
    test.ok(stub.calledTwice)

    test.done()
})

tap.test<Context>('proxy inherited prototype method', (test) => {
    const { resolve } = test.context

    class GrandParent {
        constructor(private arg1: number, private _stub: Function) { }

        public foo () {
            this._stub()
            return this.arg1
        }
    }

    class Parent extends GrandParent {
        constructor(arg1: number, stub: Function) {
            super(arg1, stub)
        }
    }

    const stub = sinon.stub()
    const object = new Parent(1, stub)
    const instance = resolve(Parent, object)

    test.equal(instance.foo(), 1)
    test.ok(stub.calledOnce)

    test.done()
})

tap.test<Context>('proxy prototype field', (test) => {
    const { resolve } = test.context

    class Parent {
        public foo : number = 1
        public getFoo() {
            return this.foo
        }
    }

    const object = new Parent()
    const instance = resolve(Parent, object)

    test.equal(instance.getFoo(), 1)
    test.equal(instance.foo, 1)
    instance.foo = 123
    test.equal(instance.foo, 123)
    test.equal(instance.getFoo(), 123)

    test.done()
})

tap.test<Context>('proxy inherited prototype field', (test) => {
    const { resolve } = test.context

    class GrandParent {
        public foo = 1
    }

    class Parent extends GrandParent { }

    const object = new Parent()
    const instance = resolve(Parent, object)

    test.equal(1, instance.foo)
    test.done()
})

tap.test<Context>('proxy prototype getter', (test) => {
    const { resolve } = test.context

    class Parent {
        public get foo() {
            this._stub()
            return this._foo
        }

        constructor(private _foo: number, private _stub: Function) { }
    }

    const stub = sinon.stub()

    const object = new Parent(1, stub)
    const instance = resolve(Parent, object)

    test.equal(instance.foo, 1)
    test.ok(stub.calledOnce)
    test.done()
})

tap.test<Context>('proxy prototype setter', (test) => {
    const { resolve } = test.context

    class Parent {
        public set foo(value: number) {
            this._stub(value)
        }

        constructor(private _stub : Function) { }
    }

    const stub = sinon.stub()
    const object = new Parent(stub)
    const instance = resolve(Parent, object)

    instance.foo = 3

    test.ok(stub.calledOnce)
    test.ok(stub.calledWith(3))

    test.done()
})

tap.test<Context>('proxy prototype property', (test) => {
    const { resolve } = test.context

    class Parent {
        private _innerValue: number = 10

        public get foo(): number {
            this._getStub()
            return this._innerValue
        }

        public set foo(value: number) {
            this._setStub(value)
            this._innerValue = value + 1
        }

        constructor(private _getStub: Function, private _setStub: Function) { }
    }

    const getStub = sinon.stub()
    const setStub = sinon.stub()

    const object = new Parent(getStub, setStub)
    const instance = resolve(Parent, object)
    instance.foo = 3

    test.equal(instance.foo, 4)
    test.ok(getStub.calledOnce)
    test.ok(setStub.calledOnce)
    test.ok(setStub.calledWith(3))

    test.done()
})

tap.test<Context>('proxy inherited prototype getter', (test) => {
    const { resolve } = test.context

    class GrandParent {
        private innerValue = 333

        public get foo() {
            this._stub()
            return this.innerValue
        }

        constructor(private _stub: Function, value: number) {
            this.innerValue = value
        }
    }

    class Parent extends GrandParent {
        constructor(stub: Function, value: number) {
            super(stub, value)
        }
    }

    const stub = sinon.stub()

    const object = new Parent(stub, 3)
    const instance = resolve(Parent, object)

    test.equal(instance.foo, 3)
    test.ok(stub.calledOnce)

    test.done()
})

tap.test<Context>('proxy inherited prototype property', (test) => {
    const { resolve } = test.context

    class GrandParent {
        private _innerValue = 333

        public get foo() {
            this.getStub()
            return this._innerValue
        }

        public set foo(value : number) {
            this.setStub()
            this._innerValue = value
        }

        constructor(private getStub: Function, private setStub: Function, value: number) {
            this._innerValue = value
        }
    }

    class Parent extends GrandParent {
        constructor(getStub: Function, setStub: Function) {
            super(getStub, setStub, 0)
        }
    }

    const getStub = sinon.stub()
    const setStub = sinon.stub()

    const object = new Parent(getStub, setStub)
    const instance = resolve(Parent, object)
    instance.foo = 3

    test.equal(instance.foo, 3)
    test.ok(getStub.calledOnce)
    test.ok(setStub.calledOnce)

    test.done()
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

    const object = new Parent(stub, 1)
    const instance = resolve(Parent, object)

    test.equal(instance.foo(2, 3), 6)
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

    const object = new Parent(stub)
    const instance = resolve(Parent, object)

    test.equal(instance.foo(1, 2), 3)
    test.ok(stub.calledOnce)

    test.done()
})

tap.test<Context>('proxy cross method', (test) => {
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
    const barStub = sinon.stub()

    const object = new Parent(barStub, fooStub)
    const instance = resolve(Parent, object)

    test.equal(instance.foo(5), 15)
    test.ok(fooStub.calledThrice)
    test.ok(barStub.calledThrice)

    test.done()
})

tap.test<Context>('proxy cross method field', (test) => {

    const { resolve } = test.context

    class Parent {
        private bar: number = 1

        public foo (arg: number) {
            let result = 0

            if (arg > this.bar) {
                result = arg + this.foo(arg - 1)
            }

            this.stub()
            return result
        }

        constructor(private stub : Function) {}
    }

    const fooStub = sinon.stub()

    const object = new Parent(fooStub)
    const instance = resolve(Parent, object)

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

        public set prop(value: number) {
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

    const object = new Parent(getStub, setStub, fooStub)
    const instance = resolve(Parent, object)

    test.equal(instance.foo(), 10)
    test.equal(fooStub.callCount, 6)
    test.equal(getStub.callCount, 16)
    test.equal(setStub.callCount, 5)

    test.done()
})
