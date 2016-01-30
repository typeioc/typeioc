/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/


'use strict';

export class Scope {
    public static None = 1;
    public static Container = 2;
    public static Hierarchy = 3
}