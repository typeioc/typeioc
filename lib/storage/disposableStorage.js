/*---------------------------------------------------------------------------------------------------
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.5
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE,
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/node.d.ts" />
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var weak = require('weak');
var DisposableStorage = (function () {
    function DisposableStorage() {
        this._disposables = [];
        this.weakRef = weak;
    }
    DisposableStorage.prototype.add = function (obj, disposer) {
        var item = this.createDisposableItem(obj, disposer);
        this._disposables.push(item);
    };
    DisposableStorage.prototype.disposeItems = function () {
        while (this._disposables.length > 0) {
            var item = this._disposables.pop();
            if (!this.weakRef.isDead(item.weakReference)) {
                var obj = this.weakRef.get(item.weakReference);
                item.disposer(obj);
            }
        }
    };
    DisposableStorage.prototype.createDisposableItem = function (obj, disposer) {
        var weakReference = this.weakRef(obj, function () {
            disposer(obj);
        });
        return {
            weakReference: weakReference,
            disposer: disposer
        };
    };
    return DisposableStorage;
})();
exports.DisposableStorage = DisposableStorage;
//# sourceMappingURL=disposableStorage.js.map