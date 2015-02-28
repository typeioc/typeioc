
/// <reference path="../../d.ts/typeioc.d.ts" />

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
                 var delegate = self._contextName ? value.bind(this[self._contextName]) : value.bind(self._source);

                 return self.createCallChainFromList(args, delegate, this);
             };
         };

         result[Typeioc.Internal.Reflection.PropertyType.Getter] = () => {

             Object.defineProperty(self._destination, self._name, {
                 get : self.defineWrapGetter(),
                 configurable : self._descriptor.configurable,
                 enumerable : self._descriptor.enumerable,
                 value : self._descriptor.value,
                 writable : self._descriptor.writable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.Setter] = () => {

             Object.defineProperty(self._destination, self._name, {
                 set : self.defineWrapSetter(),
                 configurable : self._descriptor.configurable,
                 enumerable : self._descriptor.enumerable,
                 value : self._descriptor.value,
                 writable : self._descriptor.writable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.FullProperty] = () => {

             Object.defineProperty(self._destination, self._name, {
                 get : self.defineWrapGetter(),
                 set : self.defineWrapSetter(),
                 configurable : self._descriptor.configurable,
                 enumerable : self._descriptor.enumerable,
                 value : self._descriptor.value,
                 writable : self._descriptor.writable
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
             var delegate = self.defineGetter();

             return self.createCallChainFromList([value], delegate, this);
         };
     }

     private defineWrapGetter() {

         var self = this;

         return function() {
             var delegate = self.defineGetter();

             return self.createCallChainFromList([], delegate, this);
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


     private createCallChainFromList(args : Array<any>, delegate : Function,  wrapperContext : Object) {

         var callInfo = this.createCallInfo(args, delegate);

         this.createNextInChain(callInfo, delegate, wrapperContext, this._substitute.next);

         return this._substitute.wrapper.call(wrapperContext, callInfo);
     }

     private createNextInChain(parent : Typeioc.Interceptors.ICallInfo,
                               delegate : Function,
                               wrapperContext : Object,
                               parentSubstitute : Typeioc.Internal.Interceptors.ICallSubstitute) {

         if(!parentSubstitute) return undefined;

         parent.next = () => {
             var callInfo = this.createCallInfo(parent.args, delegate);

             this.createNextInChain(callInfo, delegate, wrapperContext, parentSubstitute.next);

             return parentSubstitute.wrapper.call(wrapperContext, callInfo);
         };
     }

     private createCallInfo(args : Array<any>, delegate : Function) : Typeioc.Interceptors.ICallInfo {

         var getter = <() => any>delegate;
         var setter = <(any) => void>delegate;

         return {
             name : this._name,
             args : args,
             type : this._substitute.type,
             invoke: delegate,
             get : this._substitute.type === Typeioc.Interceptors.CallInfoType.Getter ?  getter : null,
             set : this._substitute.type === Typeioc.Interceptors.CallInfoType.Setter ?  setter : null
         };
     }
 }