const tap = require('tap')
const { ArgumentError, CircularDependencyError, ResolutionError } = require('@lib')
const { setPrototypeOf } = require('@lib/exceptions/common')

tap.test('setPrototypeOf coverage else check', (test) => {

    const method = Object.setPrototypeOf
    Object.setPrototypeOf = undefined

    setPrototypeOf({}, Error.prototype)

    Object.setPrototypeOf = method

    test.done()
})

tap.test('ArgumentError returns argument name', (test) => {
    const argumentName = 'argument name'
    const error = new ArgumentError(argumentName)

    test.equal(error.argumentName, argumentName)
    test.done()
})

tap.test('CircularDependencyError returns service name', (test) => {
    const serviceName = 'service name'
    const error = new CircularDependencyError(serviceName)

    test.equal(error.serviceName, serviceName)
    test.done()
})

tap.test('ResolutionError undefined inner error', (test) => {

    const error = new ResolutionError()

    test.ok(error.innerError === undefined)
    test.done()
})
