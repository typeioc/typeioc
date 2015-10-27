/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () - 
 * --------------------------------------------------------------------------------------------------*/


'use strict';

export class Scope {
    public static None = 1;
    public static Container = 2;
    public static Hierarchy = 3
}