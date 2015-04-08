
/// <reference path="../../d.ts/typeioc.d.ts" />

 'use strict';

import Utils = require('../utils/index');
import Exceptions = require('../exceptions/index');
import IStorage = Typeioc.Internal.Interceptors.IStorage;
import IProxy  = Typeioc.Internal.Interceptors.IProxy;
import ISubstitute= Typeioc.Interceptors.ISubstitute;

 export class Proxy implements IProxy {

    constructor(private _decoratorService : Typeioc.Internal.IDecoratorService) {}

    public fromPrototype(parent : Function,
                         storage? : IStorage) : Function {

        function Proxy() {
            this._parent = Utils.Reflection.construct(parent, arguments);

            for(var p in this._parent) {
                if((p in this) == false) {
                    this[p] = this._parent[p];
                }
            }
        }

        this.decorate(parent.prototype, Proxy.prototype, storage, '_parent');

        this.decorate(parent, Proxy, storage);

        return Proxy;
    }

    private decorate(source : Function,
                     destination : Function,
                     storage? : IStorage,
                     contextName? : string) {

        for(var p in source) {

            if(p === 'constructor') continue;

            var decorator = this._decoratorService.create(p, source, destination, contextName);

            if(storage)
            {
                var types = storage.getKnownTypes(p);
                this.checkProxyCompatibility(p, types, decorator.propertyType);

                storage.getSubstitutes(p, types)
                .forEach(item => {
                        decorator.substitute = item;
                        decorator.wrap();
                    });
            } else {
                decorator.wrap();
            }
        }
    }

    private hasProperType(types: Array<Typeioc.Interceptors.CallInfoType>, type : Typeioc.Interceptors.CallInfoType) : boolean {

        if(!types.length) return true;

        var hasAny = types.indexOf(Typeioc.Interceptors.CallInfoType.Any) >= 0;
        var hasType = types.indexOf(type) >= 0;

        if((types.length == 1 && hasAny) ||
           (types.length == 2 && hasAny  && hasType) ||
           (types.length == 1 && hasType)) return true;

        return false;
    }

    private checkProxyCompatibility(propertyName : string,
                                    types: Array<Typeioc.Interceptors.CallInfoType>,
                                    propertyType : Typeioc.Internal.Reflection.PropertyType) {

        switch (propertyType) {
            case Typeioc.Internal.Reflection.PropertyType.Method:

                if(this.hasProperType(types, Typeioc.Interceptors.CallInfoType.Method) === false)
                    throw this.combineError('Could not match proxy type and property type for method',
                        propertyName, Typeioc.Interceptors.CallInfoType.Method);

                break;

            case Typeioc.Internal.Reflection.PropertyType.Getter:

                if(this.hasProperType(types, Typeioc.Interceptors.CallInfoType.Getter) === false)
                    throw this.combineError('Could not match proxy type and property type for getter',
                        propertyName, Typeioc.Interceptors.CallInfoType.Getter);

                break;

            case Typeioc.Internal.Reflection.PropertyType.Setter:
                if(this.hasProperType(types, Typeioc.Interceptors.CallInfoType.Setter) === false)
                    throw this.combineError('Could not match proxy type and property type for setter',
                        propertyName, Typeioc.Interceptors.CallInfoType.Setter);

                break;
            case Typeioc.Internal.Reflection.PropertyType.FullProperty:

                if(this.hasProperType(types, Typeioc.Interceptors.CallInfoType.GetterSetter) === false &&
                    this.hasProperType(types, Typeioc.Interceptors.CallInfoType.Getter) === false &&
                    this.hasProperType(types, Typeioc.Interceptors.CallInfoType.Setter)=== false)
                    throw this.combineError('Could not match proxy type and property type for getter-setter',
                        propertyName, Typeioc.Interceptors.CallInfoType.GetterSetter);

                break;

            case Typeioc.Internal.Reflection.PropertyType.Field:

                if(this.hasProperType(types, Typeioc.Interceptors.CallInfoType.Field) === false)
                    throw this.combineError('Could not match proxy type and property type for field',
                        propertyName, Typeioc.Interceptors.CallInfoType.Field);

                break;
        }
    }

    private combineError(message : string, propertyName : string, type : Typeioc.Interceptors.CallInfoType) {
        var error = new Exceptions.ProxyError(message);
        error.data = { method : propertyName, type : type };
        return error;
    }
 }