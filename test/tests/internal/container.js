const sinon = require('sinon')
const tap = require('tap')
const { ArgumentError } = require('@lib')
const { container } = require('@lib/build')

tap.beforeEach((done, setUp) => {

    const internalContainer = {}
    setUp.context.internalContainer = internalContainer
    setUp.context.container = container(internalContainer)
    done()
})

tap.test('resolve throws when null|undefined service', (test) => {

    const container = test.context.container

    const delegate1 = function() {
        container.resolve(null)
    }

    const delegate2 = function() {
        container.resolve(undefined)
    }

    test.throws(delegate1, new ArgumentError("service"))
    test.throws(delegate2, new ArgumentError("service"))
    test.done()
})

tap.test('tryResolve throws when null|undefined service', (test) => {

    const container = test.context.container

    const delegate1 = function() {
        container.tryResolve(null)
    }

    const delegate2 = function() {
        container.tryResolve(undefined)
    }

    test.throws(delegate1, new ArgumentError("service"))
    test.throws(delegate2, new ArgumentError("service"))
    test.done()
})

tap.test('resolveNamed throws when null|undefined service', (test) => {

    const container = test.context.container

    const delegate1 = function() {
        container.resolveNamed(null)
    }

    const delegate2 = function() {
        container.resolveNamed(undefined)
    }

    test.throws(delegate1, new ArgumentError("service"))
    test.throws(delegate2, new ArgumentError("service"))
    test.done()
})

tap.test('tryResolveNamed throws when null|undefined service', (test) => {

    const container = test.context.container

    const delegate1 = function() {
        container.tryResolveNamed(null)
    }

    const delegate2 = function() {
        container.tryResolveNamed(undefined)
    }

    test.throws(delegate1, new ArgumentError("service"))
    test.throws(delegate2, new ArgumentError("service"))
    test.done()
})

tap.test('resolveWithDependencies throws when null|undefined service', (test) => {

    const container = test.context.container

    const delegate1 = function() {
        container.resolveWithDependencies(null)
    }

    const delegate2 = function() {
        container.resolveWithDependencies(undefined)
    }

    test.throws(delegate1, new ArgumentError("service"))
    test.throws(delegate2, new ArgumentError("service"))
    test.done()
})

tap.test('resolveWith throws when null|undefined service', (test) => {

    const container = test.context.container

    const delegate1 = function() {
        container.resolveWith(null)
    }

    const delegate2 = function() {
        container.resolveWith(undefined)
    }

    test.throws(delegate1, new ArgumentError("service"))
    test.throws(delegate2, new ArgumentError("service"))
    test.done()
})

tap.test('tryResolveNamed returns undefined', (test) => {

    const container = test.context.container
    const internalContainer = test.context.internalContainer

    internalContainer.tryResolveNamed = sinon.stub();
    internalContainer.tryResolveNamed.returns(null)

    const actual1 = container.tryResolveNamed('test', 'name');
    test.ok(actual1 === undefined)

    const actual2 = container.tryResolveNamed('test', 'name', 1, 2, 3);
    test.ok(actual2 === undefined)

    test.done()
})

tap.test('tryResolveNamedAsync returns undefined', (test) => {

    const container = test.context.container
    const internalContainer = test.context.internalContainer

    internalContainer.tryResolveNamed = sinon.stub();
    internalContainer.tryResolveNamed.returns(null)

    Promise.all([
        container.tryResolveNamedAsync('test', 'name'),
        container.tryResolveNamedAsync('test', 'name', 1, 2, 3)
    ])
    .then(([actual1, actual2]) => {
        test.ok(actual1 === undefined)
        test.ok(actual2 === undefined)

        test.done()
    })
})
