
/// <reference path="../../d.ts/typeioc.d.ts" />

 'use strict';

 import Utils = require('../utils/index');
 import Exceptions = require('../exceptions/index');
 import DecoratorModule = require('./decorator');


 export class Proxy implements Typeioc.Internal.Interceptors.IProxy {

    public fromPrototype(parent : Function,
                         storage : Typeioc.Internal.Interceptors.IStorage) : Function {

        Utils.checkNullArgument(parent, 'parent');

        //substitutes = substitutes || [];

        function Proxy() {
            this._parent = Utils.Reflection.construct(parent, arguments);

            for(var p in this._parent) {
                if((p in this) == false) {
                    this[p] = this._parent[p];
                }
            }
        }

        //this.decorate(parent.prototype, Proxy.prototype, substitutes, '_parent');
        //
        //this.decorate(parent, Proxy, substitutes);

        return Proxy;
    }

    private decorate(source : Function,
                     destination : Function,
                     substitutes : Array<Typeioc.Interceptors.ISubstitute>,
                     contextName? : string) {

        for(var p in source) {

            var substitute = this.getSubstitute(p, source, substitutes);
            var decorator = new DecoratorModule.Decorator(p, source, destination, contextName);

            if(substitute) {

                this.checkProxyCompatibility(p, substitute, decorator.propertyType);
                decorator.substitute = substitute;
            }

            decorator.wrap();
        }
    }

    private getSubstitute(name : string, source : Function, substitutes : Array<Typeioc.Interceptors.ISubstitute>)
               : Typeioc.Interceptors.ISubstitute {
        return substitutes.filter(item =>{ return item.method === name; })[0];
    }

    private checkProxyCompatibility(propertyName : string,
                                     substitute : Typeioc.Interceptors.ISubstitute,
                                     propertyType : Typeioc.Internal.Reflection.PropertyType) {

        var type = substitute.type;

        if(type === Typeioc.Interceptors.CallInfoType.Any) return;

        if((propertyType === Typeioc.Internal.Reflection.PropertyType.Method &&
            type !== Typeioc.Interceptors.CallInfoType.Method) ||

            (propertyType === Typeioc.Internal.Reflection.PropertyType.Getter &&
            type !== Typeioc.Interceptors.CallInfoType.Getter) ||

            (propertyType === Typeioc.Internal.Reflection.PropertyType.Setter &&
            type !== Typeioc.Interceptors.CallInfoType.Setter) ||

            (propertyType === Typeioc.Internal.Reflection.PropertyType.FullProperty &&
            type !== Typeioc.Interceptors.CallInfoType.Getter &&
            type !== Typeioc.Interceptors.CallInfoType.Setter &&
            type !== Typeioc.Interceptors.CallInfoType.GetterSetter)) {

            throw this.combineError('Could not match proxy type and property type', propertyName, type);
        }
    }

    private combineError(message : string, propertyName : string, type : Typeioc.Interceptors.CallInfoType) {
        var error = new Exceptions.ProxyError(message);
        error.data = { method : propertyName, type : type };
        return error;
    }
 }