const sinon = require('sinon')
const tap = require('tap')
const { ArgumentError, callInfo } = require('@lib')
const { Interceptor } = require('@lib/interceptors')

tap.beforeEach((done, setUp) => {
    const proxy = {
        byPrototype: sinon.stub(),
        byInstance: sinon.stub()
    }

    const interceptor = new Interceptor(proxy)

    setUp.context = {
        proxy,
        interceptor
    }

    done()
})

tap.test('intercept throws when no function no object', (test) => {

    const { interceptor } = test.context

    const delegate = () => {
        interceptor.intercept(1, []);
    }

    test.throws(delegate, new ArgumentError('subject', {
        message: 'Subject should be a prototype function or an object'
    }))

    test.done()
})

tap.test('intercept throws when no wrapper', (test) => {

    const { interceptor } = test.context

    const substitute = {
        method: 'test',
        type: callInfo.method
    };

    const delegate = function () {
        interceptor.intercept(function foo() { }, [substitute]);
    };

    test.throws(delegate, new ArgumentError('wrapper', {
        message: 'Missing interceptor wrapper',
        data: substitute
    }))

    test.done()
})

tap.test('interceptor should throw when null| undefined subject', (test) => {
    const { interceptor } = test.context

    const delegate1 = function () { interceptor.intercept(null) }
    const delegate2 = function () { interceptor.intercept(undefined) }

    test.throws(delegate1, new ArgumentError('subject'))
    test.throws(delegate2, new ArgumentError('subject'))
    test.done()
})

tap.test('interceptPrototype throws when no prototype', (test) => {

    const { interceptor } = test.context

    const delegate = () => {
        interceptor.interceptPrototype(1, []);
    }

    test.throws(delegate, new ArgumentError('subject', {
        message: 'Subject should be a prototype function'
    }))

    test.done()
})

tap.test('interceptInstance throws when no object', (test) => {

    const { interceptor } = test.context

    class TestSubject { }

    function testSubject() { }

    const delegate1 = () => {
        interceptor.interceptInstance(TestSubject, []);
    }

    const delegate2 = () => {
        interceptor.interceptInstance(testSubject, []);
    }

    test.throws(delegate1, new ArgumentError('subject', {
        message: 'Subject should be an object'
    }))

    test.throws(delegate2, new ArgumentError('subject', {
        message: 'Subject should be an object'
    }))

    test.done()
})
