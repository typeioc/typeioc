
/// <reference path="../../d.ts/typeioc.d.ts" />

 'use strict';

 import Utils = require('../utils/index');
 import Exceptions = require('../exceptions/index');
 import DecoratorModule = require('./decorator');


 export class Proxy {

    public fromPrototype(parent : Function,
                         substitutes? : Array<Typeioc.Internal.Interceptors.ICallSubstitute>) : Function {

        Utils.checkNullArgument(parent, 'parent');

        substitutes = substitutes || [];

        function Proxy() {
             this._parent = Utils.Reflection.construct(parent, arguments);
        }

        this.decorate(parent.prototype, Proxy.prototype, substitutes, '_parent');

        this.decorate(parent, Proxy, substitutes);

        return Proxy;
    }

    private decorate(source : Function,
                     destination : Function,
                     substitutes : Array<Typeioc.Internal.Interceptors.ICallSubstitute>,
                     contextName? : string) {

        for(var p in source) {

            var name = p;
            var substitute = substitutes.filter(item =>{

                var method : any = item.method;

                if(Utils.Reflection.isFunction(method)) {
                    return source[name] === item.method;
                }
                return method === name;
            })[0];

            var decorator = new DecoratorModule.Decorator(name, source, destination, substitute, contextName);

            if(substitute) {
                this.checkProxyCompatibility(name, substitute.type, decorator.propertyType);

                decorator.wrap();

            } else {
                decorator.nonWrap();
            }
        }
    }

    private checkProxyCompatibility(propertyName : string,
                                    type : Typeioc.Interceptors.CallInfoType,
                                    propertyType : Typeioc.Internal.Reflection.PropertyType) {

        if(propertyType === Typeioc.Internal.Reflection.PropertyType.Field) {
            var error = new Exceptions.ProxyError('Unable to create proxy for a field');
            error.data = {method : propertyName, type : type };
            throw error;
        }

        if((type === Typeioc.Interceptors.CallInfoType.Method &&
            propertyType !== Typeioc.Internal.Reflection.PropertyType.Method) ||
            (type === Typeioc.Interceptors.CallInfoType.Getter &&
            propertyType !== Typeioc.Internal.Reflection.PropertyType.Getter) ||
            (type === Typeioc.Interceptors.CallInfoType.Setter &&
            propertyType !== Typeioc.Internal.Reflection.PropertyType.Setter) ||
            (type === Typeioc.Interceptors.CallInfoType.GetterSetter &&
            propertyType !== Typeioc.Internal.Reflection.PropertyType.FullProperty)) {

            var error = new Exceptions.ProxyError('Could not match proxy type and property type');
            error.data = { method : propertyName, propertyType : propertyType, type : type };
            throw error;
        }
    }
 }