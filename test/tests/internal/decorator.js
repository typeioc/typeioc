const tap = require('tap')
const { Decorator } = require('@lib/interceptors')

tap.beforeEach((done, setUp) => {
    setUp.context.decorator = new Decorator()

    done()
})

tap.test('defineNonWrapStrategies getter no descriptor', (test) => {

    const { decorator } = test.context
    const strategies = decorator.defineNonWrapStrategies()

    const source = {
        _test: 'test',

        get test() {
            return source._test
        },

        set test(value) {
            source._test = value
        }
    }

    const destination = {}

    strategies[2]({ name: 'test', source, destination})

    test.equal(destination.test, 'test')
    test.done()
})


tap.test('defineNonWrapStrategies setter no descriptor', (test) => {

    const { decorator } = test.context
    const strategies = decorator.defineNonWrapStrategies()

    const source = {
        _test: 'test',

        get test() {
            return source._test
        },

        set test(value) {
            source._test = value
        }
    }

    const destination = {}

    strategies[3]({ name: 'test', source, destination })
    destination.test = '123'

    test.equal(source._test, '123')
    test.done()
})

tap.test('defineNonWrapStrategies full property no descriptor', (test) => {

    const { decorator } = test.context
    const strategies = decorator.defineNonWrapStrategies()

    const source = {
        _test: 'test',

        get test() {
            return source._test
        },

        set test(value) {
            source._test = value
        }
    }

    const destination = {}

    strategies[4]({name: 'test', source, destination })
    test.equal(destination.test, 'test')

    destination.test = '123'
    test.equal(source._test, '123')
    test.done()
})

tap.test('defineWrapStrategies getter no descriptor', (test) => {

    const { decorator } = test.context
    const strategies = decorator.defineWrapStrategies()

    const source = {
        _test: 'test',

        get test() {
            return source._test
        }
     }

    const destination = {}

    strategies[2]({
        name: 'test',
        source,
        destination,
        substitute: {
            method: 'test',
            type: 2,
            wrapper() {
                return 'fake test'
            }
        }
    })

    test.equal(destination.test, 'fake test')
    test.done()
})

tap.test('defineWrapStrategies setter no descriptor', (test) => {

    const { decorator } = test.context
    const strategies = decorator.defineWrapStrategies()

    const source = {
        _test: 'test',

        get test() {
            return source._test
        },

        set test(value) {
            source._test = value
        }
    }

    const destination = {}

    strategies[3]({
        name: 'test',
        source,
        destination,
        substitute: {
            method: 'test',
            type: 3,
            wrapper(callInfo) {
                callInfo.set(`fake ${callInfo.args[0]}`)
            }
        }
    })

    destination.test = '123'
    test.equal(source._test, 'fake 123')
    test.done()
})

tap.test('defineWrapStrategies full property no descriptor', (test) => {

    const { decorator } = test.context
    const strategies = decorator.defineWrapStrategies()

    const source = {
        _test: 'test',

        get test() {
            return source._test
        },

        set test(value) {
            source._test = value
        }
    }

    const destination = {}

    strategies[4]({
        name: 'test',
        source,
        destination,
        substitute: {
            method: 'test',
            type: 3,
            wrapper(callInfo) {
                callInfo.set(`fake ${callInfo.args[0]}`)
            }
        }
    })

    destination.test = '123'
    test.equal(destination.test, 'fake 123')
    test.done()
})
