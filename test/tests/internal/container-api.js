const tap = require('tap')
const { ApplicationError } = require('@lib')
const { Api } = require('@lib/build')

tap.beforeEach((done, setUp) => {

    const container = {}
    const api = new Api(container)
    setUp.context.api = api

    done()
})

tap.test('serviceValue throws when no service', (test) => {
    const { api } = test.context

    const delegate = () => {
        return api.serviceValue
    }

    test.throws(delegate, new ApplicationError({ message: 'Service was not initialized' }))
    test.done()
})
