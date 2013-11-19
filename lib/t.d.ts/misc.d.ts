/// <reference path="registration.d.ts" />


declare module Typeioc {

    interface ICollection {
        [name: string]: any;
    }

    interface IResolveOptions {
        throwIfNotFound : boolean;
        registration : IRegistrationBase;
    }
}