
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

            var substitute = this.getSubstitute(p, source, substitutes);
            var decorator = new DecoratorModule.Decorator(p, source, destination, substitute, contextName);

            if(substitute) {

                this.checkProxyCompatibility(p, substitute, decorator.propertyType);

                decorator.wrap();

            } else {
                decorator.nonWrap();
            }
        }
    }

    private getSubstitute(name : string, source : Function, substitutes : Array<Typeioc.Internal.Interceptors.ICallSubstitute>)
               : Typeioc.Internal.Interceptors.ICallSubstitute {

        return substitutes.filter(item =>{

             var method : any = item.method;

             if(Utils.Reflection.isFunction(method)) {
                 return source[name] === item.method;
             }
             return method === name;
        })[0];
    }

    private checkProxyCompatibility(propertyName : string,
                                     substitute : Typeioc.Interceptors.ICallSubstitute,
                                     propertyType : Typeioc.Internal.Reflection.PropertyType) {
        if(propertyType === Typeioc.Internal.Reflection.PropertyType.Field)
            throw this.combineError('Unable to create proxy for a field', propertyName, substitute.type);

        if(Utils.Reflection.isFunction(substitute.wrapper)) {
            this.checkWrapperDelegate(propertyName, substitute, propertyType);

            return;
        }

        this.checkWrapperInstance(propertyName, substitute, propertyType);
    }

    private checkWrapperDelegate(propertyName : string,
                                 substitute : Typeioc.Interceptors.ICallSubstitute,
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

    private checkWrapperInstance(propertyName : string,
                                 substitute : Typeioc.Interceptors.ICallSubstitute,
                                 propertyType : Typeioc.Internal.Reflection.PropertyType) {

        var type = substitute.type;

        var wrapper = <Typeioc.Interceptors.IWrapper>substitute.wrapper;

        if(!wrapper.getter && !wrapper.setter)
            throw this.combineError('Substitute wrapper instance should have at least one of (getter, setter)', propertyName, type);

        if(wrapper.getter && wrapper.setter) {
            if(type != Typeioc.Interceptors.CallInfoType.Any && type != Typeioc.Interceptors.CallInfoType.GetterSetter) {
                throw this.combineError('When both getter and setter are specified, substitute type should be (undefined, Any or GetterSetter)', propertyName, type);
            }
        }

        if(wrapper.getter && !wrapper.setter) {
            if(type != Typeioc.Interceptors.CallInfoType.Any && type != Typeioc.Interceptors.CallInfoType.Getter) {
                throw this.combineError('When getter is specified, substitute type should be (undefined, Any or Getter)', propertyName, type);
            }
        }

        if(!wrapper.getter && wrapper.setter) {
            if(type != Typeioc.Interceptors.CallInfoType.Any && type != Typeioc.Interceptors.CallInfoType.Setter) {
                throw this.combineError('When setter is specified, substitute type should be (undefined, Any or Setter)', propertyName, type);
            }
        }
    }

    private combineError(message : string, propertyName : string, type : Typeioc.Interceptors.CallInfoType) {
        var error = new Exceptions.ProxyError(message);
        error.data = { method : propertyName, type : type };
        return error;
    }
 }