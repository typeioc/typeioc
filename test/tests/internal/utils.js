const tap = require('tap')
const { ArgumentError } = require('@lib')
const { setPrototypeOf, ImmutableArray } = require('@lib/utils')

tap.test('setPrototypeOf coverage else check', (test) => {

    const method = Object.setPrototypeOf
    Object.setPrototypeOf = undefined

    setPrototypeOf({}, Error.prototype)

    Object.setPrototypeOf = method

    test.done()
})

tap.test('ImmutableArray throws for non array', (test) => {

    const delegate = () => {
        new ImmutableArray('123')
    }

    test.throws(delegate, new ArgumentError('data', { message: 'should represent an array' }))
    test.done()
})

tap.test('ImmutableArray initialize freezes data', (test) => {

    const array = new ImmutableArray([ { test: 1 } ])
    array.value[0].test = 2

    test.equals(array.value[0].test, 1)
    test.done()
})

