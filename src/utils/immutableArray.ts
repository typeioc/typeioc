/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.3
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

 'use strict';

 import { Reflection, checkNullArgument} from './index';
 import {  ArgumentError } from '../exceptions';

 export default class ImmutableArray implements Typeioc.Internal.IImmutableArray  {

     private _data : Array<any>;

     public get value() : Array<any>{
         return this._data.slice(0);
     }

     constructor(data : Array<any>) {

         checkNullArgument(data, 'data');

         if(Reflection.isArray(data) !== true)
            throw new ArgumentError('data', 'should represent an array');

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