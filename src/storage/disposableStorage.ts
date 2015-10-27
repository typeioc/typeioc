/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () - 
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/node.d.ts" />
/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

export class DisposableStorage implements  Typeioc.Internal.IDisposableStorage {
    private _disposables : Typeioc.Internal.IDisposableItem[] = [];

    public add(obj : any, disposer : Typeioc.IDisposer<any>) {

        var item = this.createDisposableItem(obj, disposer);

        this._disposables.push(item);
    }

    public disposeItems() {

        while(this._disposables.length > 0) {
            var item = this._disposables.pop();

            var obj = item.weakReference;
            item.disposer(obj);
        }
    }

    private createDisposableItem(obj : any, disposer : Typeioc.IDisposer<any>) : Typeioc.Internal.IDisposableItem {

        return {
            weakReference : obj,    // TODO: change this for ES6 weak-map
            disposer : disposer
        };
    }
}
