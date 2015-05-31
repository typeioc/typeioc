
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
/// <reference path="../../d.ts/typeioc.addons.d.ts" />

'use strict';

import Utils = require('../utils/index');
import ISubstitute = Addons.Interceptors.ISubstitute;
import IImmutableArray = Typeioc.Internal.IImmutableArray;
import IStrategyInfo = Typeioc.Internal.Interceptors.IStrategyInfo;

interface ICallChainParams {
    args : IImmutableArray;
    delegate : (args? : Array<any>) => any;
    wrapperContext : Object;
    callType? : Addons.Interceptors.CallInfoType;
    strategyInfo : IStrategyInfo
}

interface IStrategy extends Typeioc.Internal.IIndex<(item : IStrategyInfo) => void> {}


export class Decorator implements Typeioc.Internal.Interceptors.IDecorator {

     private _wrapStrategies : IStrategy;
     private _nonWrapStrategies : IStrategy;

     constructor() {
         this._wrapStrategies = this.defineWrapStrategies();
         this._nonWrapStrategies = this.defineNonWrapStrategies();
     }

     public wrap(strategyInfo : IStrategyInfo) : void
     {
         strategyInfo = this.copyStrategy(strategyInfo);
         var strategyStore = strategyInfo.substitute ? this.defineWrapStrategies() : this.defineNonWrapStrategies();
         var strategy = strategyStore[strategyInfo.type];
         strategy(strategyInfo);
     }

     private defineNonWrapStrategies() : IStrategy
     {
         var result = <IStrategy>{};

         var self = this;

         result[Typeioc.Internal.Reflection.PropertyType.Method] = (strategyInfo : IStrategyInfo) => {

             var value = strategyInfo.source[strategyInfo.name];

             strategyInfo.destination[strategyInfo.name] = function() {

                 var args  = Array.prototype.slice.call(arguments, 0);
                 return value.apply(this, args);
             };
         };

         result[Typeioc.Internal.Reflection.PropertyType.Getter] = (strategyInfo : IStrategyInfo) => {

             Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                 get : self.defineGetter(strategyInfo),
                 configurable : strategyInfo.descriptor.configurable,
                 enumerable : strategyInfo.descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.Setter] = (strategyInfo : IStrategyInfo) => {

             Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                 set : self.defineSetter(strategyInfo),
                 configurable : strategyInfo.descriptor.configurable,
                 enumerable : strategyInfo.descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.FullProperty] = (strategyInfo : IStrategyInfo) => {

             Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                 get : self.defineGetter(strategyInfo),
                 set : self.defineSetter(strategyInfo),
                 configurable : strategyInfo.descriptor.configurable,
                 enumerable : strategyInfo.descriptor.enumerable
              });
         };

         result[Typeioc.Internal.Reflection.PropertyType.Field] = result[Typeioc.Internal.Reflection.PropertyType.FullProperty];

         return result;
     }

     private defineWrapStrategies() : IStrategy
     {
         var result = <IStrategy>{};

         var self = this;

         result[Typeioc.Internal.Reflection.PropertyType.Method] = (strategyInfo : IStrategyInfo) => {

             var value = strategyInfo.source[strategyInfo.name];

             strategyInfo.destination[strategyInfo.name] = function() {

                 var destination = this;
                 var args  = Array.prototype.slice.call(arguments, 0);

                 var delegate = args => {

                     if(!args || !Utils.Reflection.isArray(args)) {
                         args = [ args ];
                     }

                     return value.apply(destination, args);
                 };

                 return self.createCallChainFromList({
                         args : Utils.createImmutable(args),
                         delegate : delegate,
                         wrapperContext : destination,
                         strategyInfo : strategyInfo
                     });
               };
         };

         result[Typeioc.Internal.Reflection.PropertyType.Getter] = (strategyInfo : IStrategyInfo) => {

             Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                 get : self.defineWrapGetter(strategyInfo),
                 configurable : true,
                 enumerable : strategyInfo.descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.Setter] = (strategyInfo : IStrategyInfo) => {

               Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                 set : self.defineWrapSetter(strategyInfo),
                 configurable :true,
                 enumerable : strategyInfo.descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.FullProperty] = (strategyInfo : IStrategyInfo) => {

             var getter = strategyInfo.substitute.type === Addons.Interceptors.CallInfoType.Any ||
                          strategyInfo.substitute.type === Addons.Interceptors.CallInfoType.GetterSetter ||
                          strategyInfo.substitute.type === Addons.Interceptors.CallInfoType.Getter  ||
                          strategyInfo.substitute.type === Addons.Interceptors.CallInfoType.Field ?
                            self.defineWrapGetter(strategyInfo) : self.defineGetter(strategyInfo);

             var setter = strategyInfo.substitute.type === Addons.Interceptors.CallInfoType.Any ||
                          strategyInfo.substitute.type === Addons.Interceptors.CallInfoType.GetterSetter ||
                          strategyInfo.substitute.type === Addons.Interceptors.CallInfoType.Setter ||
                          strategyInfo.substitute.type === Addons.Interceptors.CallInfoType.Field ?
                            self.defineWrapSetter(strategyInfo) : self.defineSetter(strategyInfo);

             Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                 get : getter,
                 set : setter,
                 configurable : true,
                 enumerable : strategyInfo.descriptor.enumerable
             });
         };

         result[Typeioc.Internal.Reflection.PropertyType.Field] = result[Typeioc.Internal.Reflection.PropertyType.FullProperty];

         return result;
     }

     private defineWrapSetter(strategyInfo : IStrategyInfo) {

         var self = this;

         return function (value) {

             var destination = this;
             var delegate = self.defineSetter(strategyInfo).bind(this);

             return self.createCallChainFromList({
                 args : Utils.createImmutable([value]),
                 delegate : delegate,
                 wrapperContext : destination,
                 callType : Addons.Interceptors.CallInfoType.Setter,
                 strategyInfo : strategyInfo
             });
          };
     }

     private defineWrapGetter(strategyInfo : IStrategyInfo) {

         var self = this;

         return function() {

             var destination = this;
             var delegate = self.defineGetter(strategyInfo).bind(this);

             return self.createCallChainFromList({
                 args : Utils.createImmutable([]),
                 delegate : delegate,
                 wrapperContext : destination,
                 callType : Addons.Interceptors.CallInfoType.Getter,
                 strategyInfo : strategyInfo
             });
          };
     }

     private defineGetter(strategyInfo : IStrategyInfo)
     {
         var self = this;
         return function() {
           return strategyInfo.contextName ? this[strategyInfo.contextName][strategyInfo.name]
                : strategyInfo.source[strategyInfo.name];
         };
     }

     private defineSetter(strategyInfo : IStrategyInfo)
     {
         var self = this;

         return function(argValue) {
             if(strategyInfo.contextName) {
                 this[strategyInfo.contextName][strategyInfo.name] = argValue;
             } else {
                 strategyInfo.source[strategyInfo.name] = argValue;
             }
         };
     }

     private createCallChainFromList(info : ICallChainParams) {

         var mainCallInfo = this.createCallInfo(info);
         this.createCallAction(mainCallInfo, info.strategyInfo.substitute.next, info);

         return info.strategyInfo.substitute.wrapper.call(info.wrapperContext, mainCallInfo);

     }

     private createCallAction(callInfo : Addons.Interceptors.ICallInfo,
                              substitute : ISubstitute,
                              info : ICallChainParams) {

        if(!substitute) return;

        var self = this;
        var childCallInfo = this.createCallInfo(info);

         callInfo.next = result => {
             childCallInfo.result = result;

             self.createCallAction(childCallInfo, substitute.next, info);

             return substitute.wrapper.call(info.wrapperContext, childCallInfo);
         };
     }

     private createCallInfo(info : ICallChainParams) : Addons.Interceptors.ICallInfo {

         var getter = <() => any>info.delegate;
         var setter = <(any) => void>info.delegate;

         return {
             name : info.strategyInfo.name,
             args : info.args.value,
             type : info.callType || info.strategyInfo.substitute.type,
             invoke: info.delegate,
             get : info.callType === Addons.Interceptors.CallInfoType.Getter ?  getter : null,
             set : info.callType === Addons.Interceptors.CallInfoType.Setter ?  setter : null
         };
     }

     private copyStrategy(strategyInfo : IStrategyInfo) : IStrategyInfo {
         return {
             type : strategyInfo.type,
             descriptor : strategyInfo.descriptor,
             substitute : strategyInfo.substitute,
             name : strategyInfo.name,
             source : strategyInfo.source,
             destination : strategyInfo.destination,
             contextName : strategyInfo.contextName
         }
     }
 }