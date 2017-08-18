/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class SubstituteStorage {
    get known() {
        return this._known;
    }
    get unknown() {
        return this._unknown;
    }
    constructor() {
        this._known = Object.create(null);
        this._unknown = Object.create(null);
    }
    add(value) {
        var key = value.method;
        if (!key) {
            this.addToTypedStorage(this._unknown, value);
            return;
        }
        var item = this._known[key];
        if (!item) {
            item = {};
            this._known[key] = item;
        }
        this.addToTypedStorage(item, value);
    }
    getKnownTypes(name) {
        var item = this._known[name];
        if (!item)
            return [];
        return Object.getOwnPropertyNames(item).map(item => ~~item);
    }
    getSubstitutes(name, types) {
        var item = this._known[name];
        if (!item)
            return [];
        var anySubstitute = item[5 /* Any */];
        if (anySubstitute) {
            anySubstitute = this.copySubstitute(anySubstitute, name);
        }
        var items = types.filter(type => type !== 5 /* Any */)
            .map(type => {
            var result = this.copySubstitute(item[type], name);
            if (anySubstitute) {
                anySubstitute.tail.next = result.head;
                anySubstitute.tail = result.tail;
                result = anySubstitute;
            }
            var unknownSubstitute = this.getUnknownSubstitute(type, name);
            if (unknownSubstitute) {
                unknownSubstitute.tail.next = result.head;
                unknownSubstitute.tail = result.tail;
                result = unknownSubstitute;
            }
            return result.head;
        });
        return items.length > 0 ? items : [anySubstitute.head];
    }
    getUnknownSubstitute(type, name) {
        var typedSubstitute = this.unknown[type];
        if (typedSubstitute)
            typedSubstitute = this.copySubstitute(typedSubstitute, name);
        var anySubstitute = this.unknown[5 /* Any */];
        if (!anySubstitute)
            return typedSubstitute;
        anySubstitute = this.copySubstitute(anySubstitute, name);
        if (!typedSubstitute)
            return anySubstitute;
        anySubstitute.tail.next = typedSubstitute.head;
        anySubstitute.tail = typedSubstitute.tail;
        return anySubstitute;
    }
    copySubstitute(list, name) {
        var result = {
            head: undefined,
            tail: undefined
        };
        var head = list.head;
        while (head) {
            var substitute = {
                method: head.method || name,
                type: head.type,
                wrapper: head.wrapper
            };
            if (!result.head) {
                result.head = substitute;
                result.tail = substitute;
            }
            else {
                result.tail.next = substitute;
                result.tail = result.tail.next;
            }
            head = head.next;
        }
        return result;
    }
    addToTypedStorage(storage, substitute) {
        var item = storage[substitute.type];
        if (!item) {
            item = {
                head: substitute,
                tail: substitute
            };
            storage[substitute.type] = item;
        }
        else {
            item.tail.next = substitute;
            item.tail = item.tail.next;
        }
    }
}
exports.SubstituteStorage = SubstituteStorage;
//# sourceMappingURL=substituteStorage.js.map