
/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

 import Utils = require('../utils/index');

 interface IStrategy {
    [index: number]: () => void;
 }

 export class Decorator {

     private _type : Typeioc.Internal.Reflection.PropertyType;
     private _descriptor : PropertyDescriptor;

     public get propertyType() : Typeioc.Internal.Reflection.PropertyType {
         return this._type;
     }

     constructor(private _name : string,
                 private _source : Function,
                 private _destination : Function,
                 private _substitute : Typeioc.Internal.Interceptors.ICallSubstitute,
                 private _contextName? : string) {

         this._descriptor = Object.getOwnPropertyDescriptor(_source, _name);
         this._type = Utils.Reflection.getPropertyType(_name, _source, this._descriptor);
     }

     public wrap() : void
     {
         var strategyStore = this.defineWrapStrategies();
         var strategy = strategyStore[this._type];
         strategy();
     }

     public nonWrap() : void
     {
         var strategyStore = this.defineNonWrapStrategies();
         var strategy = strategyStore[this._type];
         strategy();
     }

     private defineNonWrapStrategies() : IStrategy
     {
         var result : IStrategy = {};
         var self = this;

         result[Typeioc.Internal.Reflection.PropertyType.Method] = function() {

             var value = self._source[self._name];

             self._destination[self._name] = function() {

                 var args  = Array.prototype.slice.call(arguments, 0);
                 var delegate = self._contextName ? value.bind(this[self._contextName]) : value.bind(self._source);

                 return delegate.apply(this, args);
             };
         };

         result[Typeioc.Internal.Reflection.PropertyType.Getter] = function() {

             Object.defineProperty(self._destination, self._name, {
                 get : self.defineGetter(),
                 configurable : self._descriptor.configurable,
                 enumerable : self._descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.Setter] = function() {

             Object.defineProperty(self._destination, self._name, {
                 set : self.defineSetter(),
                 configurable : self._descriptor.configurable,
                 enumerable : self._descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.FullProperty] = function() {

             Object.defineProperty(self._destination, self._name, {
                 get : self.defineGetter(),
                 set : self.defineSetter(),
                 configurable : self._descriptor.configurable,
                 enumerable : self._descriptor.enumerable
              });
         };

         result[Typeioc.Internal.Reflection.PropertyType.Field] = result[Typeioc.Internal.Reflection.PropertyType.FullProperty];

         return result;
     }


     private defineWrapStrategies() : IStrategy
     {
         var result : IStrategy = {};
         var self = this;

         result[Typeioc.Internal.Reflection.PropertyType.Method] = () => {

             var value = self._source[self._name];

             self._destination[self._name] = function() {

                 var args  = Array.prototype.slice.call(arguments, 0);
                 var delegate = args => self._contextName ? value.apply(this[self._contextName], args) : value.apply(self._source, args);

                 return self.createCallChainFromList(Utils.createImmutable(args), delegate, this);
             };
         };

         result[Typeioc.Internal.Reflection.PropertyType.Getter] = () => {

             Object.defineProperty(self._destination, self._name, {
                 get : self.defineWrapGetter(),
                 configurable : self._descriptor.configurable,
                 enumerable : self._descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.Setter] = () => {

               Object.defineProperty(self._destination, self._name, {
                 set : self.defineWrapSetter(),
                 configurable : self._descriptor.configurable,
                 enumerable : self._descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.FullProperty] = () => {

             var getter = self._substitute.type === Typeioc.Interceptors.CallInfoType.Any ||
                          self._substitute.type === Typeioc.Interceptors.CallInfoType.GetterSetter ||
                          self._substitute.type === Typeioc.Interceptors.CallInfoType.Getter ?
                            self.defineWrapGetter() : self.defineGetter();

             var setter = self._substitute.type === Typeioc.Interceptors.CallInfoType.Any ||
                          self._substitute.type === Typeioc.Interceptors.CallInfoType.GetterSetter ||
                          self._substitute.type === Typeioc.Interceptors.CallInfoType.Setter ?
                            self.defineWrapSetter() : self.defineSetter();

             Object.defineProperty(self._destination, self._name, {
                 get : getter,
                 set : setter,
                 configurable : self._descriptor.configurable,
                 enumerable : self._descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.Field] = () => {

             self._destination[self._name] = self._contextName ? this[self._contextName][name] : self._source[name];
         };

         return result;
     }

     private defineWrapSetter() {

         var self = this;

         return function (value) {
             var delegate = self.defineSetter().bind(this);

             return self.createCallChainFromList(Utils.createImmutable([value]), delegate, this, Typeioc.Interceptors.CallInfoType.Setter);
         };
     }

     private defineWrapGetter() {

         var self = this;

         return function() {

             var delegate = self.defineGetter().bind(this);

             return self.createCallChainFromList(Utils.createImmutable([]), delegate, this, Typeioc.Interceptors.CallInfoType.Getter);
         };
     }

     private defineGetter()
     {
         var self = this;
         return function() {
           return self._contextName ? this[self._contextName][self._name] : self._source[self._name];
         };
     }

     private defineSetter()
     {
         var self = this;

         return function(argValue) {
             if(self._contextName) {
                 this[self._contextName][self._name] = argValue;
             } else {
                 self._source[self._name] = argValue;
             }
         };
     }

     private createCallChainFromList(
         args : Typeioc.Internal.IImmutableArray,
         delegate : (args? : Array<any>) => any,
         wrapperContext : Object,
         callType? : Typeioc.Interceptors.CallInfoType) {

         var mainCallInfo = this.createCallInfo(args.value, delegate, callType);
         var currentCallInfo = mainCallInfo;
         var nextWrapper = this._substitute.next;

         while(nextWrapper) {

             var childCallInfo = this.createCallInfo(args.value, delegate, callType);
             var wrapper = nextWrapper.wrapper;
             currentCallInfo.next = result => {
                 childCallInfo.result = result;
                 return wrapper.call(wrapperContext, childCallInfo);
             };
             currentCallInfo = childCallInfo;
             nextWrapper = nextWrapper.next;
         }

         return this._substitute.wrapper.call(wrapperContext, mainCallInfo);
     }

     private createCallInfo(
         args : Array<any>,
         delegate : (args? : Array<any>) => any,
         callType? : Typeioc.Interceptors.CallInfoType) : Typeioc.Interceptors.ICallInfo {

         var getter = <() => any>delegate;
         var setter = <(any) => void>delegate;

         return {
             name : this._name,
             args : args,
             type : callType || this._substitute.type,
             invoke: delegate,
             get : callType === Typeioc.Interceptors.CallInfoType.Getter ?  getter : null,
             set : callType === Typeioc.Interceptors.CallInfoType.Setter ?  setter : null
         };
     }
 }