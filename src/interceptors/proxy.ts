/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.2
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

 'use strict';

import { Reflection } from '../utils';
import { ProxyError } from '../exceptions';
import IStorage = Typeioc.Internal.Interceptors.IStorage;
import IProxy  = Typeioc.Internal.Interceptors.IProxy;
import ISubstitute = Addons.Interceptors.ISubstitute;
import IStrategyInfo = Typeioc.Internal.Interceptors.IStrategyInfo;
import CallInfoType = Addons.Interceptors.CallInfoType;
import PropertyType = Typeioc.Internal.Reflection.PropertyType;

interface IPropertyPredicate {
    (name : string) : boolean;
}

export class Proxy implements IProxy {

    private restrictedProperties;

    private propTypeToDescriptor = {
        [PropertyType.Method]: [CallInfoType.Any, CallInfoType.Method],
        [PropertyType.Getter]: [CallInfoType.Any, CallInfoType.Getter],
        [PropertyType.Setter]: [CallInfoType.Any, CallInfoType.Setter],
        [PropertyType.FullProperty]: [
                CallInfoType.Any,
                CallInfoType.Getter,
                CallInfoType.Setter,
                CallInfoType.GetterSetter
        ],
        [PropertyType.Field]: [
            CallInfoType.Any,
            CallInfoType.Getter,
            CallInfoType.Setter,
            CallInfoType.GetterSetter,
            CallInfoType.Field
        ]
    };

    constructor(private _decorator : Typeioc.Internal.Interceptors.IDecorator) {

        this.restrictedProperties = Reflection.getAllPropertyNames(Function);
    }

    public byPrototype(parent : Function,
                       storage? : IStorage) : Function {

        var self = this;

        function Proxy() {
            this._parent = Reflection.construct(parent, arguments);

            Object.getOwnPropertyNames(this._parent)
            .filter(name => !isBlackListProperty(name))    
            .filter(name => (name in this) === false &&
                    (name in Proxy.prototype) === false)
            .map(p => self.createStrategyInfo(this._parent, this, p))
            .forEach(s => self.decorateProperty(s, storage));
        }

        const source = parent.prototype;
        Reflection.getAllPropertyNames(source)
            .filter(name => !isBlackListProperty(name))
            .map(p => self.createStrategyInfo(source, Proxy.prototype, p, '_parent'))
            .forEach(s => self.decorateProperty(s, storage));

        Object.getOwnPropertyNames(parent)
            .filter(name =>  self.restrictedProperties.indexOf(name) === -1)
            .map(p => self.createStrategyInfo(parent, Proxy, p))
            .forEach(s => self.decorateProperty(s, storage));

        return Proxy;
    }

    public byInstance(parent : Object, storage? : IStorage) : Object {

        const result = Object.create({});

        Reflection.getAllPropertyNames(parent)
            .filter(name => !isBlackListProperty(name))
            .map(p => this.createStrategyInfo(parent, result, p))
            .forEach(s => this.decorateProperty(s, storage));

        return result;
    }

    private decorateProperty(strategyInfo : IStrategyInfo, storage? : IStorage) {
        
        if(storage) {
            const types = this.propTypeToDescriptor[strategyInfo.type];
            const substitute = storage.getSubstitutes(strategyInfo.name, types);

            strategyInfo.substitute = substitute;
            this._decorator.wrap(strategyInfo);

            return;
        }

        this._decorator.wrap(strategyInfo);
    }

    private createStrategyInfo(source : Function | Object,
                               destination : Function | Object,
                               name : string,
                               contextName? : string) : IStrategyInfo {

        const descriptor = Reflection.getPropertyDescriptor(source, name);
        const propertyType = Reflection.getPropertyType(name, descriptor);

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
 }

 const blackListProperties = [
   '__lookupGetter__',
   '__lookupSetter__',
   '__proto__',
   '__defineGetter__',
   '__defineSetter__',
   'hasOwnProperty',
   'propertyIsEnumerable',
   'constructor'            
 ];

 const isBlackListProperty = (property: string) => {
     return blackListProperties.indexOf(property) >= 0;
 }