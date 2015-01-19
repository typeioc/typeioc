/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.d.ts" />

'use strict';

export class Defaults {
    public static Scope : number =  Typeioc.Types.Scope.Hierarchy;
    public static Owner : number = Typeioc.Types.Owner.Externals;
}