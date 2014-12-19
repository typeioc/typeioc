/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2014 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

///<reference path='typeioc.d.ts' />

declare module Typeioc.Internal {

    interface IRegistrationBaseService {
        create(service : any) : IRegistrationBase;
    }

    interface IInstanceRegistrationService {
        create<R>(baseRegistration : IRegistrationBase) : Typeioc.IRegistration<R>;
    }

    interface IModuleRegistrationService {
        create(baseRegistration : IRegistrationBase) : IModuleRegistration;
    }

    interface IConfigRegistrationService {
        create(config : Typeioc.IConfig) : IConfigRegistration;
    }

    interface IRegistrationStorageService {
        create () : IRegistrationStorage;
    }

    interface IIDisposableStorageService {
        create() : IDisposableStorage;
    }

    interface IInternalStorageService<K, T> {
        create() : Typeioc.Internal.IInternalStorage<K, T>;
    }

    interface IContainerService {
        create() : IContainer;
    }

    interface IContainer extends Typeioc.IContainer {
        import(registrations : IRegistrationBase[]) : void;
    }


    interface IIndex {
        [index: number]: any;
    }

    interface IIndexedCollection extends IIndex {
        [name: string]: any;
    }

    interface IInternalStorage<K, T> {
        add(key : K, value : T) : void;
        get(key : K) : T;
        tryGet(key : K) : T;
        register(key: K, defaultValue: () => T) : T;
        contains (key : K) : boolean;
    }

    interface IDisposableItem {
        weakReference : any;
        disposer : Typeioc.IDisposer<any>;
    }

    interface IDisposableStorage {
        add(obj : any, disposer : Typeioc.IDisposer<any>);
        disposeItems();
    }

    interface IRegistrationStorage {
        addEntry(registration : IRegistrationBase) : void;
        getEntry(registration : IRegistrationBase) : IRegistrationBase;
    }

    interface IRegistrationBase {
        service : any;
        factory : Typeioc.IFactory<any>;
        name : string;
        scope : Typeioc.Types.Scope;
        owner : Typeioc.Types.Owner;
        initializer : Typeioc.IInitializer<any>;
        disposer : Typeioc.IDisposer<any>;
        args : any[];
        container : Typeioc.IContainer;
        instance : any;
        invoker : Typeioc.IInvoker;
        cloneFor : (container: Typeioc.IContainer) => IRegistrationBase;
    }

    interface IConfigRegistration {
        scope : Typeioc.Types.Scope;
        owner : Typeioc.Types.Owner;
        registrations : IRegistrationBase[];
    }

    interface IModuleRegistration {
        getAsModuleRegistration : () => Typeioc.IAsModuleRegistration;
        registrations : IRegistrationBase[];
    }

    interface IModuleItemRegistrationOptions {
        factory : Typeioc.IFactory<any>;
        name : string;
    }

}