const tap = require('tap')
const { Registration } = require('@lib/registration')
const { ArgumentError } = require('@lib')

tap.beforeEach((done, setUp) => {
    const registrationBase = {}
    setUp.context.registration = new Registration(registrationBase)
    setUp.context.registrationBase = registrationBase

    done()
})

tap.test('\"as\" throws when null|undefined factory', (test) => {
    const { registration } = test.context

    const delegate1 = () => {
        registration.as(null)
    }

    const delegate2 = () => {
        registration.as(undefined)
    }

    test.throws(delegate1, new ArgumentError('factory'))
    test.throws(delegate2, new ArgumentError('factory'))
    test.done()
})

tap.test('\"asType\" throws when null|undefined type', (test) => {
    const { registration } = test.context

    const delegate1 = () => {
        registration.asType(null)
    }

    const delegate2 = () => {
        registration.asType(undefined)
    }

    test.throws(delegate1, new ArgumentError('type'))
    test.throws(delegate2, new ArgumentError('type'))
    test.done()
})

tap.test('\"asValue\" throws when null|undefined value', (test) => {
    const { registration } = test.context

    const delegate1 = () => {
        registration.asValue(null)
    }

    const delegate2 = () => {
        registration.asValue(undefined)
    }

    test.throws(delegate1, new ArgumentError('value'))
    test.throws(delegate2, new ArgumentError('value'))
    test.done()
})

tap.test('\"named\" throws when null|undefined name', (test) => {
    const { registration } = test.context

    const delegate1 = () => {
        registration.named(null)
    }

    const delegate2 = () => {
        registration.named(undefined)
    }

    test.throws(delegate1, new ArgumentError('value'))
    test.throws(delegate2, new ArgumentError('value'))
    test.done()
})

tap.test('\"within\" throws when null|undefined scope', (test) => {
    const { registration } = test.context

    const delegate1 = () => {
        registration.within(null)
    }

    const delegate2 = () => {
        registration.within(undefined)
    }

    test.throws(delegate1, new ArgumentError('scope'))
    test.throws(delegate2, new ArgumentError('scope'))
    test.done()
})

tap.test('\"ownedBy\" throws when null|undefined owner', (test) => {
    const { registration } = test.context

    const delegate1 = () => {
        registration.ownedBy(null)
    }

    const delegate2 = () => {
        registration.ownedBy(undefined)
    }

    test.throws(delegate1, new ArgumentError('owner'))
    test.throws(delegate2, new ArgumentError('owner'))
    test.done()
})

tap.test('\"initializeBy\" throws when null|undefined action', (test) => {
    const { registration } = test.context

    const delegate1 = () => {
        registration.initializeBy(null)
    }

    const delegate2 = () => {
        registration.initializeBy(undefined)
    }

    test.throws(delegate1, new ArgumentError('action'))
    test.throws(delegate2, new ArgumentError('action'))
    test.done()
})

tap.test('\"dispose\" throws when null|undefined action', (test) => {
    const { registration } = test.context

    const delegate1 = () => {
        registration.dispose(null)
    }

    const delegate2 = () => {
        registration.dispose(undefined)
    }

    test.throws(delegate1, new ArgumentError('action'))
    test.throws(delegate2, new ArgumentError('action'))
    test.done()
})

tap.test('setting dispose actions sets container ownership', (test) => {
    const { registration, registrationBase } = test.context

    test.notOk(registrationBase.owner)
    registration.dispose(() => {})
    test.equals(registrationBase.owner, 1)
    test.done()
})
