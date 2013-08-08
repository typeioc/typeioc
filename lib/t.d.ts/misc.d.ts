/// <reference path="registration.d.ts" />


declare function require(path : string) : any;

declare module Typeioc {

    interface ICollection {
        [name: string]: any;
    }

    interface IResolveOptions {
        throwIfNotFound : boolean;
        registration : IRegistrationBase;
    }
}