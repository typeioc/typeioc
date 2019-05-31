const tap = require('tap')
const { getPropertyType } = require('@lib/interceptors/common')
const { SubstituteStorage } = require('@lib/interceptors/substitute-storage')

tap.test('getPropertyType returns Field when no descriptor', (test) => {
    const actual = getPropertyType(undefined)
    test.equal(actual, 5)
    test.done()
})

tap.test('SubstituteStorage.copyList copies list', (test) => {
    const list = {
        head: {
            method: 'method',
            type: 'type',
            wrapper: () => {},
            next: {
                method: 'method 2',
                type: 'type',
                wrapper: () => {}
            }
        },

        tail:null
    }

    const storage = new SubstituteStorage()
    const actual = storage.copyList(list, (item) => item.method === 'method 2')

    const item = {
        method: 'method 2',
        type: 'type',
        wrapper: () => {}
    }

    test.same(actual, {
        head: item,
        tail: item
    })
    test.done()
})

