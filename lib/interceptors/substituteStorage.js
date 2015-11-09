/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
/// <reference path="../../d.ts/typeioc.addons.d.ts" />
'use strict';
var SubstituteStorage = (function () {
    function SubstituteStorage() {
        this._known = Object.create(null);
        this._unknown = Object.create(null);
    }
    Object.defineProperty(SubstituteStorage.prototype, "known", {
        get: function () {
            return this._known;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubstituteStorage.prototype, "unknown", {
        get: function () {
            return this._unknown;
        },
        enumerable: true,
        configurable: true
    });
    SubstituteStorage.prototype.add = function (value) {
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
    };
    SubstituteStorage.prototype.getKnownTypes = function (name) {
        var item = this._known[name];
        if (!item)
            return [];
        return Object.getOwnPropertyNames(item).map(function (item) { return ~~item; });
    };
    SubstituteStorage.prototype.getSubstitutes = function (name, types) {
        var _this = this;
        var item = this._known[name];
        if (!item)
            return [];
        var anySubstitute = item[5 /* Any */];
        if (anySubstitute) {
            anySubstitute = this.copySubstitute(anySubstitute, name);
        }
        var items = types.filter(function (type) { return type !== 5 /* Any */; })
            .map(function (type) {
            var result = _this.copySubstitute(item[type], name);
            if (anySubstitute) {
                anySubstitute.tail.next = result.head;
                anySubstitute.tail = result.tail;
                result = anySubstitute;
            }
            var unknownSubstitute = _this.getUnknownSubstitute(type, name);
            if (unknownSubstitute) {
                unknownSubstitute.tail.next = result.head;
                unknownSubstitute.tail = result.tail;
                result = unknownSubstitute;
            }
            return result.head;
        });
        return items.length > 0 ? items : [anySubstitute.head];
    };
    SubstituteStorage.prototype.getUnknownSubstitute = function (type, name) {
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
    };
    SubstituteStorage.prototype.copySubstitute = function (list, name) {
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
    };
    SubstituteStorage.prototype.addToTypedStorage = function (storage, substitute) {
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
    };
    return SubstituteStorage;
})();
exports.SubstituteStorage = SubstituteStorage;
//# sourceMappingURL=substituteStorage.js.map