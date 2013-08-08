/// <reference path="container.d.ts" />

declare module Typeioc {

    interface IInitializer<T> {
        (IContainer, item : T) : void;
    }


    interface IOwned {
        ownedBy : (owner : number) => void;
    }

    interface IReused {
        within : (scope: number) => IOwned;
    }

    interface IReusedOwned extends IReused, IOwned { }

    interface INamed {
        named : (name: string) => IReusedOwned;
    }

    interface INamedReusedOwned extends INamed, IReusedOwned {}


    interface IInitialized<T> {
        initializeBy : (action : IInitializer<T>) => INamedReusedOwned;
    }

    interface IInvoker {
        () : any;
    }

    interface IFactory<T> {
        (c: IContainer, ...args: any[]) : T;
    }

    interface IInitializedNamedReusedOwned<T> extends IInitialized<T>, INamedReusedOwned {

    }

    interface IAs<T> {
        as : (factory: IFactory<T>) => IInitializedNamedReusedOwned<T>;
    }

    interface IRegistrationBase {
        service : any;
        factory : IFactory<any>;
        name : string;
        scope : number;
        owner : number;
        initializer : IInitializer<any>;
        args : any[];
        container : IContainer;
        instance : any;
        invoker : IInvoker;
        toNamedKey : () => string;
        cloneFor : (container: IContainer) => IRegistrationBase;
    }

    interface IRegistration<T> extends IAs<T> { }

    interface IModuleReusedOwned extends IReusedOwned {
        for<R>(service: any, factory : IFactory<R>) : IModuleReusedOwned;
        forArgs(service: any, ...args:any[]) : IModuleReusedOwned;
        named(service: any, name : string) : IModuleReusedOwned;
    }

    interface IAsModuleRegistration {
        as : (asModule : Object) => IModuleReusedOwned;
    }

    interface IModuleRegistration {
        getAsModuleRegistration : () => IAsModuleRegistration;
        registrations : IRegistrationBase[];
    }

    interface IModuleItemRegistrationOptions {
        factory : IFactory<any>;
        name : string;
    }
}

