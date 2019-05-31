const sinon = require('sinon')
const tap = require('tap')
const { Invoker } = require('@lib/build')
const { RegistrationBase } = require('@lib/registration')

tap.test('invokes factory', (test) => {

    const factory = sinon.stub()
    const serviceEntry = new RegistrationBase(null)
    serviceEntry.factory = factory
    serviceEntry.container = {}
    const invoker = new Invoker(serviceEntry.container, {})

    invoker.invoke(serviceEntry, true, [])

    test.ok(factory.calledOnce)
    test.done()
})

tap.test('invokes factory with container as first parameter', (test) => {

    const container = {}
    const firstArg = 1
    const secondArg = 'a'
    const thirdArg = 'test'
    const factory = sinon.stub()

    const serviceEntry = new RegistrationBase(null)
    serviceEntry.factory = factory
    serviceEntry.container = container
    const invoker = new Invoker(container, {})

    invoker.invoke(serviceEntry, true, [firstArg, secondArg, thirdArg])

    test.ok(factory.withArgs(container, firstArg, secondArg, thirdArg).calledOnce)
    test.done()
})

tap.test('invoke does not mutate arguments', (test) => {

    const serviceEntry = new RegistrationBase(null)
    serviceEntry.factory = sinon.stub()
    serviceEntry.container = {}
    const args = [1, 2, '3']
    serviceEntry.args = args;
    const invoker = new Invoker(serviceEntry.container, {})

    invoker.invoke(serviceEntry, true, args)

    test.equal(args, serviceEntry.args)
    test.equal(serviceEntry.args[0], 1)
    test.equal(serviceEntry.args[1], 2)
    test.equal(serviceEntry.args[2], '3')

    invoker.invoke(serviceEntry, true, args)

    test.equal(args, serviceEntry.args)
    test.equal(serviceEntry.args[0], 1)
    test.equal(serviceEntry.args[1], 2)
    test.equal(serviceEntry.args[2], '3')

    test.done()
})

tap.test('instantiate creates by parameter', (test) => {

    const container = {
        tryResolve: sinon.stub()
    }
    const factory = sinon.stub()
    const service = {}
    const serviceEntry = new RegistrationBase(null)
    serviceEntry.isLazy = false
    serviceEntry.factoryType = factory
    serviceEntry.registrationType = 2
    serviceEntry.container = container
    serviceEntry.params = [service]
    serviceEntry.dependenciesValue = [{
        service
    }]

    const invoker = new Invoker(container, {})
    invoker.invoke(serviceEntry, false)

    test.ok(container.tryResolve.calledOnce)
    test.done()
})

tap.test('instantiate creates by named parameter', (test) => {

    const container = {
        tryResolveNamed: sinon.stub(),
    }
    const factory = sinon.stub()
    const service = {}
    const serviceEntry = new RegistrationBase(null)
    serviceEntry.isLazy = false
    serviceEntry.factoryType = factory
    serviceEntry.registrationType = 2
    serviceEntry.container = container
    serviceEntry.params = [service]
    serviceEntry.dependenciesValue = [{
        service,
        named: 'test'
    }]

    const invoker = new Invoker(container, {})
    invoker.invoke(serviceEntry, false)

    test.ok(container.tryResolveNamed.calledOnce)
    test.done()
})

tap.test('instantiate creates by dependency', (test) => {

    const container = {
        resolve: sinon.stub()
    }
    const factory = sinon.stub()
    const service = {}
    const serviceEntry = new RegistrationBase(null)
    serviceEntry.isLazy = false
    serviceEntry.factoryType = factory
    serviceEntry.registrationType = 2
    serviceEntry.container = container
    serviceEntry.params = []
    serviceEntry.dependenciesValue = [{
        service
    }]

    const invoker = new Invoker(container, null)
    invoker.getDependencies = () => [{}]
    invoker.invoke(serviceEntry, false)

    test.ok(container.resolve.calledOnce)
    test.done()
})

tap.test('instantiate creates by dependency, exec', (test) => {

    const resultStub = sinon.stub()

    const container = {
        resolveWith: () => ({ exec() { resultStub() } }),
        resolve: sinon.stub()
    }
    const factory = sinon.stub()
    const service = {}
    const serviceEntry = new RegistrationBase(null)
    serviceEntry.isLazy = false
    serviceEntry.factoryType = factory
    serviceEntry.registrationType = 2
    serviceEntry.container = container
    serviceEntry.params = []
    serviceEntry.dependenciesValue = [{
        service
    }]

    const invoker = new Invoker(container, { tryGet: () => [{}]})
    invoker.getDependencies = () => [{}]
    invoker.invoke(serviceEntry, false)

    test.ok(resultStub.calledOnce)
    test.done()
})
