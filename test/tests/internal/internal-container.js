const tap = require('tap')
const { ResolutionError } = require('@lib')
const { InternalContainer } = require('@lib/build')

tap.beforeEach((done, setUp) => {
    const registrationStorageService = { create: () => { }, };
    const disposeStorageService = { create: () => { }, };
    const invokerService = { create: () => { }, };
    const resolveCacheService = { create: () => ({ cache: {}, resolutionCache: {} }) }

    setUp.context.internalContainer = new InternalContainer(
        registrationStorageService,
        disposeStorageService,
        null,
        null,
        invokerService,
        resolveCacheService)

    done()
})

tap.test('test', (test) => {
    test.done()
})

tap.test('resolveAsync throws', (test) => {
    const { internalContainer } = test.context
    const delegate = () => internalContainer.resolveAsync()

    test.throws(delegate, new Error('Not implemented'))
    test.done()
})

tap.test('disposeAsync throws', (test) => {
    const { internalContainer } = test.context
    const delegate = () => internalContainer.disposeAsync()

    test.throws(delegate, new Error('Not implemented'))
    test.done()
})

tap.test('tryResolveAsync throws', (test) => {
    const { internalContainer } = test.context
    const delegate = () => internalContainer.tryResolveAsync()

    test.throws(delegate, new Error('Not implemented'))
    test.done()
})

tap.test('resolveNamedAsync throws', (test) => {
    const { internalContainer } = test.context
    const delegate = () => internalContainer.resolveNamedAsync();

    test.throws(delegate, new Error('Not implemented'))
    test.done()
})

tap.test('tryResolveNamedAsync throws', (test) => {
    const { internalContainer } = test.context
    const delegate = () => internalContainer.tryResolveNamedAsync();

    test.throws(delegate, new Error('Not implemented'))
    test.done()
})

tap.test('resolveWithDependencies async throws', (test) => {
    const { internalContainer } = test.context
    const delegate = () => internalContainer.resolveWithDependenciesAsync();

    test.throws(delegate, new Error('Not implemented'))
    test.done()
})

tap.test('createDependenciesRegistration throws when no service', (test) => {
    const { internalContainer } = test.context
    const dependency = {}
    const delegate = () => {
        internalContainer.createDependenciesRegistration({ dependenciesValue: [dependency] })
    }

    test.throws(delegate, new ResolutionError({ message: 'Service is not defined', data: dependency }))
    test.done()
})
