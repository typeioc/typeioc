const tap = require('tap')
const { RegistrationBase } = require('@lib/registration')

tap.beforeEach((done, setUp) => {
    const service = {}
    setUp.context.registration = new RegistrationBase(service)

    done()
})

tap.test('dependenciesValue sets empty array', (test) => {
    const { registration } = test.context

    registration.dependenciesValue = null
    test.same(registration.dependenciesValue, [])

    registration.dependenciesValue = undefined
    test.same(registration.dependenciesValue, [])

    test.done()
})
