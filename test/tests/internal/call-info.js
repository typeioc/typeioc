const tap = require('tap')
const typeioc = require('@lib')

tap.test('CallInfo has all properties', (test) => {

    test.equals(typeioc.callInfo.method, 1)
    test.equals(typeioc.callInfo.getter, 2)
    test.equals(typeioc.callInfo.setter, 3)
    test.equals(typeioc.callInfo.getterSetter, 4)
    test.equals(typeioc.callInfo.any, 5)
    test.equals(typeioc.callInfo.field, 6)

    test.done()
})

tap.test('CallInfo has all no extra properties', (test) => {

    test.plan(6)

    for(let key in typeioc.callInfo) {
        test.ok(typeioc.callInfo[key])
    }

    test.done()
})
