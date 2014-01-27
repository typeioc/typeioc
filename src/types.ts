

'use strict';

export class Scope {
    public static None = 1;
    public static Container = 2;
    public static Hierarchy = 3
}

export class Owner {
    public static Container = 1;
    public static Externals = 2
}

export class Defaults {
    public static Scope :number  = Scope.Hierarchy;
    public static Owner : number  = Owner.Externals;
}