
/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

 import Utils = require('../utils/index');

 interface IStrategy {
    [index: number]: () => void;
 }

 export class Decorator {

     private _type : Typeioc.Internal.Reflection.PropertyType;
     private _descriptor : PropertyDescriptor;
     private _substitute : Typeioc.Interceptors.ISubstitute;

     private _wrapStrategies : IStrategy;
     private _nonWrapStrategies : IStrategy;

     public get propertyType() : Typeioc.Internal.Reflection.PropertyType {
         return this._type;
     }

     public set substitute(value : Typeioc.Interceptors.ISubstitute) {
         this._substitute = value;
     }

     constructor(private _name : string,
                 private _source : Function,
                 private _destination : Function,
                 private _contextName? : string) {

         this._descriptor = Utils.Reflection.getPropertyDescriptor(_source, _name);
         this._type = Utils.Reflection.getPropertyType(_name, _source, this._descriptor);
     }

     public wrap() : void
     {
         var strategyStore = this._substitute ? this.defineWrapStrategies() : this.defineNonWrapStrategies();
         var strategy = strategyStore[this._type];
         strategy();
     }

     private defineNonWrapStrategies() : IStrategy
     {
         if(this._nonWrapStrategies) return this._nonWrapStrategies;

         var result = <IStrategy>(this._nonWrapStrategies = {});

         var self = this;

         result[Typeioc.Internal.Reflection.PropertyType.Method] = function() {

             var value = self._source[self._name];

             self._destination[self._name] = function() {

                 var args  = Array.prototype.slice.call(arguments, 0);
                 return value.apply(this, args);
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
         if(this._wrapStrategies) return this._wrapStrategies;

         var result = <IStrategy>(this._wrapStrategies = {});

         var self = this;

         result[Typeioc.Internal.Reflection.PropertyType.Method] = () => {

             var value = self._source[self._name];

             self._destination[self._name] = function() {

                 var destination = this;
                 var args  = Array.prototype.slice.call(arguments, 0);
                 var delegate = args => value.apply(destination, args);

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
                          self._substitute.type === Typeioc.Interceptors.CallInfoType.Getter  ||
                          self._substitute.type === Typeioc.Interceptors.CallInfoType.Field ?
                            self.defineWrapGetter() : self.defineGetter();

             var setter = self._substitute.type === Typeioc.Interceptors.CallInfoType.Any ||
                          self._substitute.type === Typeioc.Interceptors.CallInfoType.GetterSetter ||
                          self._substitute.type === Typeioc.Interceptors.CallInfoType.Setter ||
                          self._substitute.type === Typeioc.Interceptors.CallInfoType.Field ?
                            self.defineWrapSetter() : self.defineSetter();

             Object.defineProperty(self._destination, self._name, {
                 get : getter,
                 set : setter,
                 configurable : self._descriptor.configurable,
                 enumerable : self._descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.Field] = result[Typeioc.Internal.Reflection.PropertyType.FullProperty];

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
         this.createCallAction(mainCallInfo, args, delegate, wrapperContext, this._substitute.next, callType);

         return this._substitute.wrapper.call(wrapperContext, mainCallInfo);

     }

     private createCallAction(callInfo : Typeioc.Interceptors.ICallInfo,
                              args : Typeioc.Internal.IImmutableArray,
                              delegate : (args? : Array<any>) => any,
                              wrapperContext : Object,
                              substitute : Typeioc.Interceptors.ISubstitute,
                              callType? : Typeioc.Interceptors.CallInfoType) {

        if(!substitute) return;

        var self = this;
        var childCallInfo = this.createCallInfo(args.value, delegate, callType);

         callInfo.next = result => {
             childCallInfo.result = result;

             self.createCallAction(callInfo, args, delegate, wrapperContext, substitute.next, callType);

             return substitute.wrapper.call(wrapperContext, childCallInfo);
         };
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