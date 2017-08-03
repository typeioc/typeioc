/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class DisposableStorage {
    constructor() {
        this._disposables = [];
    }
    add(obj, disposer) {
        var item = this.createDisposableItem(obj, disposer);
        this._disposables.push(item);
    }
    disposeItems() {
        while (this._disposables.length > 0) {
            var item = this._disposables.pop();
            var obj = item.weakReference;
            item.disposer(obj);
        }
    }
    createDisposableItem(obj, disposer) {
        return {
            weakReference: obj,
            disposer: disposer
        };
    }
}
exports.DisposableStorage = DisposableStorage;
//# sourceMappingURL=disposableStorage.js.map