/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.3
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

///<reference path='typeioc.d.ts' />
///<reference path='typeioc.addons.d.ts' />

declare module Typeioc.Internal {

    const enum RegistrationType {
        Factory = 1,
        FactoryType = 2,
        FactoryValue = 3
    }

    const enum DecoratorResolutionParameterType {
        Service = 1,
        Value = 2,
        FunctionValue = 3
    }
    
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
                        storage? : Typeioc.Internal.Interceptors.IStorage) : Function;

            byInstance(parent : Object, storage? : IStorage) : Object;
        }

        interface IDecorator {
            wrap(strategyInfo : IStrategyInfo);
        }

        interface IStorage {
            add(value : Addons.Interceptors.ISubstitute);
            getSubstitutes(name : string, types: Array<Addons.Interceptors.CallInfoType>) : Addons.Interceptors.ISubstitute | null;
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

    interface IRegistrationStorageService {
        create() : IRegistrationStorage;
    }

    interface IIDisposableStorageService {
        create() : IDisposableStorage;
    }

    interface IInternalStorageService<K, T> {
        create() : Typeioc.Internal.IInternalStorage<K, T>;
    }

    interface IInlineInternalStorageService {
        create<R1, R2>() : Typeioc.Internal.IInternalStorage<R1, R2>;
    }

    interface IContainerService {
        create(container : Typeioc.Internal.IContainer): Typeioc.IContainer;
    }

    interface IContainerApiService {
        create<R>(container : IImportApi<R>) : IContainerApi<R>;
    }

    interface IInternalContainerService {
        resolutionDetails? : Internal.IDecoratorResolutionParamsData;
        create() : Internal.IContainer;
    }

    interface IDecoratorApiService {
        createRegistration<R>(register : (api : IDecoratorRegistrationApi<R>) => ClassDecorator)
            : IDecoratorRegistrationApi<R>;

        createResolution(register : (api : IDecoratorResolutionApi) => ParameterDecorator)
            : IDecoratorResolutionApi;
    }

    interface IContainerBuilderService {
        create(internalContainerService : Internal.IInternalContainerService) : Typeioc.IContainerBuilder;
    }

    interface IInvokerService {
        create(container: IContainer, resolutionDetails: IDecoratorResolutionParamsData): IInvoker;
    }

    interface IDecoratorRegistrationApi<T> {
        service : any;
        initializedBy : Typeioc.IInitializer<T>;
        disposedBy : Typeioc.IDisposer<T>;
        name : string;
        scope : Types.Scope;
        owner : Types.Owner
        provide(service: any) : Decorators.Register.IInitializedDisposedNamedReusedOwned<T>;
        provideUndefined() : Decorators.Register.IInitializedDisposedNamedReusedOwned<T>;
    }

    interface IDecoratorResolutionApi {
        service : any;
        args: Array<any>;
        attempt : boolean;
        name? : string;
        cache : Internal.IApiCache;
        by(service? : any) : Decorators.Resolve.IArgsTryNamedCache;
    }

    interface IDecoratorResolutionCollection extends IIndex<IDecoratorResolutionParams> {}

    interface IDecoratorResolutionParams {
        value? : any;
        service? : any;
        args?: Array<any>;
        name? : string;
        attempt? : boolean;
        cache? : Internal.IApiCache;
        type: DecoratorResolutionParameterType;
    }

    interface IDecoratorResolutionParamsData
        extends Internal.IInternalStorage<any, Internal.IDecoratorResolutionCollection> { }

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
        clear(): void;
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
        clear(): void;
    }

    interface IRegistrationBase {
        id: string;
        service : any;
        factory : Typeioc.IFactory<any>;
        factoryType : any;
        factoryValue : any;
        name : string;
        scope : Typeioc.Types.Scope;
        owner : Typeioc.Types.Owner;
        initializer : Typeioc.IInitializer<any>;
        disposer : Typeioc.IDisposer<any>;
        args : any[];
        params : any[];
        container : Typeioc.IContainer;
        instance : any;
        registrationType : RegistrationType;
        dependenciesValue : Array<Typeioc.IDynamicDependency>;
        cloneFor : (container: Typeioc.IContainer) => IRegistrationBase;
        clone : () => IRegistrationBase;
        copyDependency : (dependency: Typeioc.IDynamicDependency) => void;
        checkRegistrationType: () => void;
    }

    interface IInvoker {
        invoke<R>(registration : Internal.IRegistrationBase,
            throwIfNotFound : boolean,
            args?: Array<any>) : R;
    }
}