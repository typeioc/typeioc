/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/node.d.ts" />
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var DisposableStorage = (function () {
    function DisposableStorage() {
        this._disposables = [];
    }
    DisposableStorage.prototype.add = function (obj, disposer) {
        var item = this.createDisposableItem(obj, disposer);
        this._disposables.push(item);
    };
    DisposableStorage.prototype.disposeItems = function () {
        while (this._disposables.length > 0) {
            var item = this._disposables.pop();
            var obj = item.weakReference;
            item.disposer(obj);
        }
    };
    DisposableStorage.prototype.createDisposableItem = function (obj, disposer) {
        return {
            weakReference: obj,
            disposer: disposer
        };
    };
    return DisposableStorage;
})();
exports.DisposableStorage = DisposableStorage;
//# sourceMappingURL=disposableStorage.js.map