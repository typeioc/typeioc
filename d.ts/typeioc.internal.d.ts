/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

///<reference path='typeioc.d.ts' />
///<reference path='typeioc.addons.d.ts' />

declare module Typeioc.Internal {

    module Reflection {

        const enum PropertyType {
            Method = 1,                 // method
            Getter = 2,                 // get
            Setter = 3,                 // set
            FullProperty = 4,           // get and set
            Field = 5                   // field
        }
    }

    module Interceptors {

        interface IProxy {
            byPrototype(parent : Function,
                          storage : Typeioc.Internal.Interceptors.IStorage) : Function;

            byInstance(parent : Object, storage : IStorage) : Object;
        }

        interface IDecorator {
            wrap(strategyInfo : IStrategyInfo);
        }

        interface IStorage {
            known : IIndexedCollection<IIndexedCollection<IList<Addons.Interceptors.ISubstitute>>>;
            unknown : IIndexedCollection<IList<Addons.Interceptors.ISubstitute>>;
            add(value : Addons.Interceptors.ISubstitute);
            getKnownTypes(name : string) : Array<Addons.Interceptors.CallInfoType>;
            getSubstitutes(name : string, types : Array<Addons.Interceptors.CallInfoType>) : Array<Addons.Interceptors.ISubstitute>;
        }

        interface IStrategyInfo {
            type : Typeioc.Internal.Reflection.PropertyType;
            descriptor : PropertyDescriptor;
            substitute : Addons.Interceptors.ISubstitute;
            name : string;
            source : Function | Object;
            destination : Function | Object;
            contextName? : string
        }
    }

    interface IList<T> {
        head : T;
        tail : T;
    }

    interface IImmutableArray {
        value : Array<any>;
    }

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
        create() : IConfigRegistration;
    }

    interface IRegistrationStorageService {
        create() : IRegistrationStorage;
    }

    interface IIDisposableStorageService {
        create() : IDisposableStorage;
    }

    interface IInternalStorageService<K, T> {
        create() : Typeioc.Internal.IInternalStorage<K, T>;
    }

    interface IContainerService {
        create(internalContainerService : IInternalContainerService, container? : Typeioc.Internal.IContainer)
            : Typeioc.IContainer;
    }

    interface IContainerApiService {
        create<R>(container : IImportApi<R>) : IContainerApi<R>;
    }

    interface IInternalContainerService {
        create() : IContainer;
    }

    interface IDecoratorApiService {
        createRegistration<R>(register : (api : IDecoratorRegistrationApi<R>) => Decorators.Register.IDecoratorRegisterResult)
            : IDecoratorRegistrationApi<R>;

        createResolution(register : (api : IDecoratorResolutionApi) => Decorators.Resolve.IDecoratorResolutionResult)
            : IDecoratorResolutionApi;
    }

    interface IDecoratorRegistrationApi<T> {
        service : any;
        initializedBy : Typeioc.IInitializer<any>;
        name : string;
        scope : Types.Scope;
        owner : Types.Owner
        builder : Typeioc.IContainerBuilder;
        provide(service: any) : Decorators.Register.IInitializedNamedReusedOwned<T>;
    }

    interface IDecoratorResolutionApi {
        service : any;
        args: Array<any>;
        attempt : boolean;
        name? : string;
        cache : Internal.IApiCache;
        container : Typeioc.IContainer;
        by(service? : any) : Decorators.Resolve.IArgsTryNamedCache;
    }

    interface IDecoratorResolutionCollection extends IIndex<IDecoratorResolutionParams> {}

    interface IDecoratorResolutionParams {
        value? : any;
        service? : any;
        args: Array<any>;
        name? : string;
        attempt? : boolean;
        cache? : Internal.IApiCache;
        container? : Typeioc.IContainer;
    }

    interface IContainerApi<T> {
        serviceValue : T;
        nameValue : string;
        cacheValue : IApiCache;
        dependenciesValue : Array<Typeioc.IDynamicDependency>;
        isDependenciesResolvable : boolean;
        attemptValue : boolean;
        throwResolveError : boolean;
        argsValue : Array<any>;
        service(value : any) : Typeioc.IResolveWith<T>;
    }

    interface IImportApi<T> {
        execute(api : IContainerApi<T>) : T;
    }

    interface IApiCache {
        use : boolean;
        name :string
    }

    interface IContainer extends Typeioc.IContainer {
        add(registrations : IRegistrationBase[]) : void;
    }


    interface IIndex<T> {
        [index: number]: T;
    }

    interface IIndexedCollection<T> extends IIndex<T> {
        [name: string]: T;
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
        forInstantiation : boolean;
        invoke() : any;
        cloneFor : (container: Typeioc.IContainer) => IRegistrationBase;
    }

    interface IConfigRegistration {
        scope : Typeioc.Types.Scope;
        owner : Typeioc.Types.Owner;
        registrations : IRegistrationBase[];
        apply(config : Typeioc.IConfig);
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