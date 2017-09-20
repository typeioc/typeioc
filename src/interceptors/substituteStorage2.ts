'use strict';

import IIndex = Typeioc.Internal.IIndexedCollection;
import ISubstitute = Addons.Interceptors.ISubstitute;
import CallInfoType = Addons.Interceptors.CallInfoType;
import IList = Typeioc.Internal.IList;


export class SubstituteStorage2 implements Typeioc.Internal.Interceptors.IStorage {
    private _known: IIndex<IList<ISubstitute>>;
    private _unknown: IList<ISubstitute>;
    
    constructor() {
        this._known = Object.create(null);
        this._unknown = { head: null, tail: null };
    }

    public get known() : IIndex<IIndex<IList<ISubstitute>>> {
        return null;
    }

    public add(value: ISubstitute) {
        if(value.method) {
            this.addKnownSubstitute(value);    
        } else {
            this.addUnknownSubstitute(value);
        }
    }

    public getSubstitutes(name: string, types: Addons.Interceptors.CallInfoType[]): ISubstitute[] {
        
        return null;
    }

    getSubstitutes2(name : string, types: CallInfoType[]): ISubstitute | null {
        
        const unknown = this._unknown.head ? 
            this.copyList(
                this._unknown,
                (value) => types.indexOf(value.type) >=0 )
            :
            null;

        const bucket = this._known[name];

        if(!bucket) {
            return unknown ? unknown.head : null;
        }

        const result = this.copyList(bucket, (value) => {
            if(types.indexOf(value.type) >= 0) {
                return true;
            }
            
            throw 'Incompatible type';
         });

        result.tail.next = unknown ? unknown.head : result.tail.next;

        return result.head;
    }

    public getKnownTypes(name: string): Addons.Interceptors.CallInfoType[] {
        return null;
    }

    private addKnownSubstitute(value: ISubstitute) {
        const method = value.method;
        const bucket = this._known[method] || { head: null, tail: null };

        this.addToList(value, bucket);
        this._known[method] = bucket;
    }

    private addUnknownSubstitute(value: ISubstitute) {
        this.addToList(value, this._unknown);
    }

    private addToList(value: ISubstitute, list: IList<ISubstitute>) {
        if(!list.head) {
            list.head = value;
            list.tail = value;
        } else {
            list.tail.next = value;
            list.tail = value;
        }
    }

    private copyList(list: IList<ISubstitute>, predicate: (value: ISubstitute) => boolean): IList<ISubstitute> {
        
        const result = {
            head: null,
            tail: null
        };

        let current = list.head;

        while(current) {
            if(predicate(current)) {
                
                const substitute = {
                    method : current.method,
                    type : current.type,
                    wrapper : current.wrapper
                };

                this.addToList(substitute, result);
            }

            current = current.next;
        }

        return result;
    }
}