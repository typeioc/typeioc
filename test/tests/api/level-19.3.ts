import { Tap } from '@common/tap'
const tap = require('tap') as Tap
import typeioc, { IInterceptor, callInfo, ProxyError } from '@lib'

type Context = {
    interceptor: IInterceptor
}

tap.beforeEach<Context>((done, setUp) => {
    setUp!.context.interceptor = typeioc.createInterceptor()
    done()
})

tap.test<Context>('instance method receives original object', (test) => {
    const { interceptor } = test.context

    const math = interceptor.intercept(Math, [{
        method: 'pow',
        wrapper: (callInfo) =>
            callInfo.next!(
                (callInfo.source as Math).round((callInfo.source as any).PI) +
                callInfo.args[0] +
                callInfo.args[1])
    }, {
        method: 'pow',
        wrapper: (callInfo) =>
            (callInfo.source as Math).round((callInfo.source as Math).PI) +
            callInfo.result
    }])

    const actual = math.pow(2, 3)

    test.equal(actual, 11)
    test.done()
})

tap.test<Context>('instance field receives original object', (test) => {
    const { interceptor } = test.context
    let PI = 3.14

    const mathClass = {
        PI: 3.14
    }

    const math = interceptor.intercept(mathClass, [{
        method: 'PI',
        type: callInfo.field,
        wrapper(callInfo) {
            if (callInfo.get) {
                return callInfo.next!((callInfo.source as Math).PI + PI)
            }

            if (callInfo.set) {
                callInfo.next!(callInfo.args[0] + 1)
            }
        }
    }, {
        method: 'PI',
        type: callInfo.field,
        wrapper(callInfo) {
            if (callInfo.get) {
                return callInfo.result + (callInfo.source as Math).PI + PI
            }

            if (callInfo.set) {
                PI = callInfo.result + callInfo.args[0] + 1
            }
        }
    }])

    test.equal(math.PI, (mathClass.PI + PI) * 2)
    math.PI = 7
    test.equal(PI, 16)
    test.done()
})

tap.test<Context>('instance getter receives original object', (test) => {
    const { interceptor } = test.context

    const subject = {
        get value() {
            return 'value'
        }
    }

    const subjectIntercepted = interceptor.intercept(subject, [{
        method: 'value',
        wrapper: (callInfo) => {
            return callInfo.next!(`${(callInfo.source as any).value} 1`)
        }
    }, {
        method: 'value',
        wrapper: (callInfo) => {
            return `${callInfo.result} ${(callInfo.source as any).value} 2`
        }
    }])

    test.equal(subjectIntercepted.value, 'value 1 value 2')
    test.done()
})

tap.test<Context>('instance setter receives original object', (test) => {
    const { interceptor } = test.context

    type Value1 = {
        value1: number
    }

    const subject = {
        value1: 3,
        value2: null as (number | null),

        set value(value: number) {
            this.value2 = value
        }
    }

    const subjectIntercepted = interceptor.intercept(subject, [{
        method: 'value',
        wrapper: (callInfo) => {
            callInfo.next!(callInfo.args[0] + (callInfo.source as Value1).value1)
        }
    }, {
        method: 'value',
        wrapper: (callInfo) => {
            callInfo.set!(callInfo.result + (callInfo.source as Value1).value1)
        }
    }])

    subjectIntercepted.value = 1

    test.equal(subjectIntercepted.value2, 7)
    test.done()
})

tap.test<Context>('prototype method receives original object', (test) => {
    const { interceptor } = test.context

    class Test {
        get value() {
            return 10
        }

        test(a: number) {
            return a + 1
        }
    }

    const intercepted = interceptor.intercept(Test, [{
        method: 'test',
        wrapper: (callInfo) =>
            callInfo.next!(
                (callInfo.source as Test).value + callInfo.args[0])
    }, {
        method: 'test',
        wrapper: (callInfo) =>
            (callInfo.source as Test).value + callInfo.result
    }])

    const instance = new intercepted()
    const actual = instance.test(3)

    test.equal(actual, 23)
    test.done()
})

tap.test<Context>('instance withSubstitute intercepts', (test) => {
    const { interceptor } = test.context

    const math = interceptor.withSubstitute({
        method: 'pow',
        wrapper: (callInfo) => {
            return callInfo.next!(callInfo.args[0] + callInfo.args[1])
        }
    })
    .withSubstitute({
        method: 'pow',
        wrapper: (callInfo) => {
            return callInfo.result + callInfo.args[0] + callInfo.args[1]
        }
    })
    .interceptInstance(Math)

    test.equal(math.pow(2, 3), 10)
    test.done()
})

tap.test<Context>('prototype withSubstitute intercepts', (test) => {
    const { interceptor } = test.context

    class Proto {
        pow(a: number, b: number) {
            return a - b
        }
    }

    const protoI = interceptor.withSubstitute({
        method: 'pow',
        wrapper: (callInfo) => {
            return callInfo.next!(callInfo.args[0] + callInfo.args[1])
        }
    })
    .withSubstitute({
        method: 'pow',
        wrapper: (callInfo) => {
            return callInfo.result + callInfo.args[0] + callInfo.args[1]
        }
    })
    .interceptPrototype(Proto)

    const actual = new protoI()

    test.equal(actual.pow(2, 3), 10)
    test.done()
})

tap.test<Context>('intercept withSubstitute intercepts', (test) => {
    const { interceptor } = test.context

    class Proto {
        pow(a: number, b: number) {
            return a - b
        }
    }

    const protoI = interceptor.withSubstitute({
        method: 'pow',
        wrapper: (callInfo) => {
            return (callInfo.args[0] + callInfo.args[1])
        }
    })
    .intercept(Proto)

    const math = interceptor.withSubstitute({
        method: 'pow',
        wrapper: (callInfo) => {
            return (callInfo.args[0] + callInfo.args[1])
        }
    })
    .intercept(Math)

    const pi = new protoI()

    test.equal(pi.pow(2, 3), 5)
    test.equal(math.pow(2, 3), 5)

    test.done()
})

tap.test<Context>('intercept mixed chain', (test) => {
    const { interceptor } = test.context

    const mathTest = {
        pow (a: number, b: number) {
            return Math.pow(a, b)
        }
    }

    const math = interceptor.intercept(mathTest, [{
        method: 'pow',
        type: callInfo.method,
        wrapper: (callInfo) => {
            return callInfo.next!(callInfo.args[0] + callInfo.args[1])
        }
    }, {
        method: 'pow',
        wrapper: (callInfo) => {
            return callInfo.next!(`${callInfo.result} 1`)
        }
    }, {
        method: 'pow',
        type: callInfo.method,
        wrapper: (callInfo) => {
            return callInfo.next!(`${callInfo.result} 2`)
        }
    }, {
        method: 'pow',
        wrapper: (callInfo) => {
            return `${callInfo.result} 3`
        }
    }])

    test.equal(math.pow(2, 3), '5 1 2 3')
    test.done()
})

tap.test<Context>('intercept throws when incompatible types', (test) => {
    const { interceptor } = test.context

    const subject = {
        field: 1
    }

    const delegate = () => {
        interceptor.intercept(subject, {
            method: 'field',
            type: 1,
            wrapper: () => {}
        })
    }

    test.throws(delegate, new ProxyError({
        message: [
            'Could not match proxy type and property type.',
            'Expected one of: Any, Getter, Setter, GetterSetter, Field. Actual: Method'
        ].join(' ')
    }))

    test.done()
})
