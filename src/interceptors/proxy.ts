/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/


/// <reference path="../../d.ts/typeioc.internal.d.ts" />
/// <reference path="../../d.ts/typeioc.addons.d.ts" />

 'use strict';

import Utils = require('../utils/index');
import Exceptions = require('../exceptions/index');
import IStorage = Typeioc.Internal.Interceptors.IStorage;
import IProxy  = Typeioc.Internal.Interceptors.IProxy;
import ISubstitute = Addons.Interceptors.ISubstitute;
import IStrategyInfo = Typeioc.Internal.Interceptors.IStrategyInfo;

interface IPropertyPredicate {
    (name : string) : boolean;
}

export class Proxy implements IProxy {

    private restrictedProperties;

    constructor(private _decorator : Typeioc.Internal.Interceptors.IDecorator) {

        this.restrictedProperties = Utils.Reflection.getAllPropertyNames(Function);
    }

    public byPrototype(parent : Function,
                       storage? : IStorage) : Function {

        var self = this;

        function Proxy() {
            this._parent = Utils.Reflection.construct(parent, arguments);


            Object.getOwnPropertyNames(this._parent)
                .filter(name => name !== 'constructor' &&
                                name !== 'prototype' &&
                                (name in this) === false &&
                                (name in Proxy.prototype) === false)
                .map(p => self.createStrategyInfo(this._parent, this, p))
                .forEach(s => self.decorateProperty(s, storage));
        }

        var source = parent.prototype;
        Utils.Reflection.getAllPropertyNames(source)
                        .filter(name => name !== 'constructor' && name !== 'prototype')
                        .map(p => self.createStrategyInfo(source, Proxy.prototype, p, '_parent'))
                        .forEach(s => self.decorateProperty(s, storage));

        Object.getOwnPropertyNames(parent)
                        .filter(name =>  self.restrictedProperties.indexOf(name) === -1)
                        .map(p => self.createStrategyInfo(parent, Proxy, p))
                        .forEach(s => self.decorateProperty(s, storage));

        return Proxy;
    }

    public byInstance(parent : Object, storage : IStorage) : Object {

        var result = Object.create({});

        Utils.Reflection.getAllPropertyNames(parent)
            .filter(name => name !== 'constructor')
            .map(p => this.createStrategyInfo(parent, result, p))
            .forEach(s => this.decorateProperty(s, storage));

        return result;
    }

    private decorateProperty(strategyInfo : IStrategyInfo, storage? : IStorage) {

        var substitutes = [];

        if(storage) {
            var types = storage.getKnownTypes(strategyInfo.name);
            substitutes = storage.getSubstitutes(strategyInfo.name, types);
        }

        if(substitutes.length) {

            this.checkProxyCompatibility(strategyInfo.name, types, strategyInfo.type);

            substitutes.forEach(item => {

                strategyInfo.substitute = item;
                this._decorator.wrap(strategyInfo);
            });
        } else {
            this._decorator.wrap(strategyInfo);
        }
    }

    private hasProperType(types: Array<Addons.Interceptors.CallInfoType>, type : Addons.Interceptors.CallInfoType) : boolean {

        var hasAny = types.indexOf(Addons.Interceptors.CallInfoType.Any) >= 0;
        var hasType = types.indexOf(type) >= 0;

        if((types.length == 1 && hasAny) ||
           (types.length == 2 && hasAny  && hasType) ||
           (types.length == 1 && hasType)) return true;

        return false;
    }

    private checkProxyCompatibility(propertyName : string,
                                    types: Array<Addons.Interceptors.CallInfoType>,
                                    propertyType : Typeioc.Internal.Reflection.PropertyType) {

        switch (propertyType) {
            case Typeioc.Internal.Reflection.PropertyType.Method:

                if(this.hasProperType(types, Addons.Interceptors.CallInfoType.Method) === false)
                    throw this.combineError(propertyName, 'Method', types);

                break;

            case Typeioc.Internal.Reflection.PropertyType.Getter:

                if(this.hasProperType(types, Addons.Interceptors.CallInfoType.Getter) === false)
                    throw this.combineError(propertyName, 'Getter', types);

                break;

            case Typeioc.Internal.Reflection.PropertyType.Setter:
                if(this.hasProperType(types, Addons.Interceptors.CallInfoType.Setter) === false)
                    throw this.combineError(propertyName, 'Setter', types);

                break;
            case Typeioc.Internal.Reflection.PropertyType.FullProperty:

                if(this.hasProperType(types, Addons.Interceptors.CallInfoType.GetterSetter) === false &&
                   this.hasProperType(types, Addons.Interceptors.CallInfoType.Getter) === false &&
                   this.hasProperType(types, Addons.Interceptors.CallInfoType.Setter)=== false)
                    throw this.combineError(propertyName, 'GetterSetter', types);

                break;

            case Typeioc.Internal.Reflection.PropertyType.Field:

                if(this.hasProperType(types, Addons.Interceptors.CallInfoType.Field) === false)
                    throw this.combineError(propertyName, 'Field', types);

                break;
        }
    }

    private createStrategyInfo(source : Function | Object,
                               destination : Function,
                               name : string,
                               contextName? : string) : IStrategyInfo {

        var descriptor = Utils.Reflection.getPropertyDescriptor(source, name);
        var propertyType = Utils.Reflection.getPropertyType(name, descriptor);

        return {
            type : propertyType,
            descriptor : descriptor,
            substitute : null,
            name : name,
            source : source,
            destination : destination,
            contextName : contextName
        };
    }

    private combineError(propertyName : string, nativeTypeName: string, types : Array<Addons.Interceptors.CallInfoType>) {

        var type = types.filter(t => t !== Addons.Interceptors.CallInfoType.Any)[0];

        var allTypes = {};
        allTypes[Addons.Interceptors.CallInfoType.Field] = 'Field';
        allTypes[Addons.Interceptors.CallInfoType.Getter] = 'Getter';
        allTypes[Addons.Interceptors.CallInfoType.Setter] = 'Setter';
        allTypes[Addons.Interceptors.CallInfoType.Method] = 'Method';
        allTypes[Addons.Interceptors.CallInfoType.GetterSetter] = 'GetterSetter';

        var typeName = allTypes[type];

        var message = ['Could not match proxy type and property type. Expected: "', nativeTypeName, '", Actual: "', typeName, '"'].join('');
        var error = new Exceptions.ProxyError(message);
        error.data = { method : propertyName, expected : nativeTypeName, actual : typeName };
        return error;
    }
 }