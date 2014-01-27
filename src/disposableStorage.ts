/// <reference path="../d.ts/node.d.ts" />
/// <reference path="../d.ts/typeioc.d.ts" />


'use strict';

var weak = require('weak');

interface IDisposableItem {
    weakReference : any;
    disposer : Typeioc.IDisposer<any>;
}


export class DisposableStorage implements  Typeioc.IDisposableStorage {
    private disposables : IDisposableItem[] = [];
    private weakRef = weak;

    public add(obj : any, disposer : Typeioc.IDisposer<any>) {

        var item = this.createDisposableItem(obj, disposer);

        this.disposables.push(item);
    }

    public disposeItems() {
        while(this.disposables.length > 0) {
            var item = this.disposables.pop();

            if(!this.weakRef.isDead(item.weakReference)) {
                var obj = this.weakRef.get(item.weakReference);
                item.disposer(obj);
            }
        }
    }

    private createDisposableItem(obj : any, disposer : Typeioc.IDisposer<any>) : IDisposableItem {
        var weakReference = this.weakRef(obj, () => {
            cleanUp(disposer);
        });

        return {
            weakReference : weakReference,
            disposer : disposer
        };
    }
}

function cleanUp(disposer : Typeioc.IDisposer<any>) {
    return function() {
        disposer(this);
    }
}
