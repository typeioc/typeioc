/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () - 
 * --------------------------------------------------------------------------------------------------*/


/// <reference path="../../d.ts/typeioc.internal.d.ts" />


 'use strict';

 import Utils = require('./index');
 import Exceptions = require('../exceptions/index');

 export class ImmutableArray implements Typeioc.Internal.IImmutableArray  {

     private _data : Array<any>;

     public get value() : Array<any>{
         return this._data.slice(0);
     }

     constructor(data : Array<any>) {

         Utils.checkNullArgument(data, 'data');

         if(Utils.Reflection.isArray(data) !== true)
            throw new Exceptions.ArgumentError('data', 'should represent an array');

         this._data = this.initialize(data);
     }

     private initialize(data : Array<any>) : Array<any> {

         return data.map(item => {

             var type = typeof (item);

             return type === 'object' ||
                    type === 'function' ? Object.freeze(item) : item;
         });
     }
 }