/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2014 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/node.d.ts" />
/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

var weak = require('weak');

export class DisposableStorage implements  Typeioc.Internal.IDisposableStorage {
    private _disposables : Typeioc.Internal.IDisposableItem[] = [];
    private weakRef = weak;

    public add(obj : any, disposer : Typeioc.IDisposer<any>) {

        var item = this.createDisposableItem(obj, disposer);

        this._disposables.push(item);
    }

    public disposeItems() {
        while(this._disposables.length > 0) {
            var item = this._disposables.pop();

            if(!this.weakRef.isDead(item.weakReference)) {
                var obj = this.weakRef.get(item.weakReference);
                item.disposer(obj);
            }
        }
    }

    private createDisposableItem(obj : any, disposer : Typeioc.IDisposer<any>) : Typeioc.Internal.IDisposableItem {

        var weakReference = this.weakRef(obj, () => {

            disposer(obj);
        });

        return {
            weakReference : weakReference,
            disposer : disposer
        };
    }
}
