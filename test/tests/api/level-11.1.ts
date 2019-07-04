import { Tap } from '@common/tap'
import sinon from 'sinon'
const tap = require('tap') as Tap
import * as typeioc from '@lib'
import { createResolve, Context } from '@common/interceptor'

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.resolve = createResolve({
        builder: typeioc.builder(),
        interceptor: typeioc.interceptor()
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
    const proto = resolve(Parent, Parent)
    const instance = new proto(1, stub)

    test.equal(instance.foo(), 1)
    test.ok(stub.calledOnce)

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
        constructor(arg1 : number, stub : Function) {
            super(arg1, stub)
        }
    }

    const stub = sinon.stub()

    const proto = resolve(Parent, Parent)
    const instance = new proto(1, stub)

    test.equal(instance.foo(), 1)
    test.ok(stub.calledOnce)

    test.done()
})

tap.test<Context>('proxy static method', (test) => {
    const { resolve } = test.context
    const stub = sinon.stub()

    class Parent {
        public static foo() {
            stub()
            return 10
        }
    }

    const proto = resolve(Parent, Parent)

    test.equal(proto.foo(), 10)
    test.ok(stub.calledOnce)

    test.done()
})

tap.test<Context>('proxy prototype field', (test) => {
    const { resolve } = test.context

    class Parent {
        public foo: number = 1

        public getFoo() {
            return this.foo
        }
    }

    const proto = resolve(Parent, Parent)
    const instance = new proto()

    test.equal(instance.getFoo(), 1)
    test.equal(instance.foo, 1)
    instance.foo = 123
    test.equal(instance.foo, 123)
    test.equal(instance.getFoo(), 123)

    test.done()
})

tap.test<Context>('proxy static field', (test) => {
    const { resolve } = test.context

    class Parent {
        public static foo: number = 1

        public static getFoo() {
            return Parent.foo
        }
    }

    const proto = resolve(Parent, Parent)

    test.equal(proto.getFoo(), 1)
    proto.foo = 2
    test.equal(proto.getFoo(), 2)

    test.done()
})

tap.test<Context>('proxy inherited prototype_field', (test) => {
    const { resolve } = test.context

    class GrandParent {
        public foo = 1
    }

    class Parent extends GrandParent {}

    const proto = resolve(Parent, Parent)
    const instance = new proto()

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

        constructor(private _foo : number, private _stub : Function) { }
    }

    const stub = sinon.stub()
    const proto = resolve(Parent, Parent)
    const instance = new proto(1, stub)

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

        constructor(private _stub: Function) { }
    }

    const stub = sinon.stub()
    const proto = resolve(Parent, Parent)
    const instance = new proto(stub)

    instance.foo = 3

    test.ok(stub.calledOnce)
    test.ok(stub.calledWith(3))

    test.done()
})

tap.test<Context>('proxy prototype property', (test) => {
    const { resolve } = test.context

    class Parent {
        private _innerValue: number = 0

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

    const proto = resolve(Parent, Parent)
    const instance = new proto(getStub, setStub)
    instance.foo = 3

    test.equal(instance.foo, 4)
    test.ok(getStub.calledOnce)
    test.ok(setStub.calledOnce)
    test.ok(setStub.calledWith(3))

    test.done()
})

tap.test<Context>('proxy static getter', (test) => {
    const { resolve } = test.context
    const stub = sinon.stub()

    class Parent {
        public static get foo() {
            stub()
            return 11
        }
    }

    const proto = resolve(Parent, Parent)

    test.equal(proto.foo, 11)
    test.ok(stub.calledOnce)
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
        constructor(stub : Function, value : number) {
            super(stub, value)
        }
    }

    const stub = sinon.stub()
    const proto = resolve(Parent, Parent)
    const instance = new proto(stub, 3)

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
        constructor(getStub : Function, setStub : Function) {
            super(getStub, setStub, 0)
        }
    }

    const getStub = sinon.stub()
    const setStub = sinon.stub()

    const proto = resolve(Parent, Parent)
    const instance = new proto(getStub, setStub)
    instance.foo = 3

    test.equal(instance.foo, 3)
    test.ok(getStub.calledOnce)
    test.ok(setStub.calledOnce)

    test.done()
})

tap.test<Context>('proxy static property ', (test) => {
    const { resolve } = test.context
    const getStub = sinon.stub()
    const setStub = sinon.stub()

    class Parent {
        private static _innerValue = 0

        public  static get foo() {
            getStub()
            return this._innerValue
        }

        public static set foo(value: number) {
            setStub()
            this._innerValue = value
        }
    }

    const proto = resolve(Parent, Parent)
    proto.foo = 123

    test.equal(proto.foo, 123)
    test.ok(getStub.calledOnce)
    test.ok(setStub.calledOnce)
    test.done()
})
