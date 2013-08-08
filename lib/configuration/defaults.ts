/// <reference path="../t.d.ts/enums.d.ts" />

"use strict";

export enum Scope {
    None = 1,
    Container = 2,
    Hierarchy = 3
}

export enum Owner {
    Container = 1,
    Externals = 2
}

export class Defaults {
    public static Scope  = Scope.Hierarchy;
    public static Owner  = Owner.Externals;
}
