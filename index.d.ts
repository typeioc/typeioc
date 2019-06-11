
declare module Typeioc {

    function createBuilder() : IContainerBuilder;

    function createDecorator() : Decorators.IDecorator;
    
    module Types {
        const enum Scope  {
            None = 1,
            Container = 2,
            Hierarchy = 3
        }

        const enum Owner {
            Container = 1,
            Externals = 2
        }

        interface IDefaults {
            Scope : Types.Scope,
            Owner : Types.Owner
        }
    }

    module Exceptions {
        class BaseError implements Error {

            public stack;
            public message : string;
            public name : string;
            public data : any;
            public innerError : BaseError;
        }

        class ApplicationError extends BaseError { }

        class ArgumentError extends ApplicationError {
            public argumentName: string;
        }

        class ArgumentNullError extends ArgumentError { }

        class ResolutionError extends ApplicationError { }

        class StorageKeyNotFoundError extends ApplicationError { }

        class NullReferenceError extends ApplicationError { }

        class ProxyError extends ApplicationError { }
    }
    
    module Decorators {

        interface IDecorator {
            build() : Typeioc.IContainer;
            provide<R>(service: any) : Register.IInitializedLazyDisposedNamedReusedOwned<R>;
            provideSelf<R>() : Register.IInitializedLazyDisposedNamedReusedOwned<R>;
            by(service? : any) : Decorators.Resolve.IArgsTryNamedCache;
            resolveValue(value: any | Function) : ParameterDecorator;
            register<R>(service: any): Typeioc.IRegistration<R>;
            import(builder: Typeioc.IContainerBuilder): void;
        }

        module Register {
            interface IRegister {
                register() : ClassDecorator;
            }

            interface IOwned extends Register.IRegister {
                ownedBy : (owner : Types.Owner) => Register.IRegister;
                ownedInternally: () => Register.IRegister;
                ownedExternally: () => Register.IRegister;
            }

            interface IReused extends Register.IRegister {
                within : (scope: Types.Scope) => Register.IOwned;
                transient: () => Register.IOwned;
                singleton: () => Register.IOwned;
                instancePerContainer: () => Register.IOwned;
            }

            interface IReusedOwned extends Register.IReused, Register.IOwned { }

            interface INamed extends Register.IRegister {
                named : (name: string) => Register.IReusedOwned;
            }

            interface INamedReusedOwned extends Register.INamed, Register.IReusedOwned { }

            interface IDisposable<T> {
                dispose : (action : IDisposer<T>) =>  Register.INamedReusedOwned;
            }

            interface ILazyNamedReusedOwnedDisposed<T> extends ILazy, Register.IDisposable<T>, Register.INamedReusedOwned {}

            interface ILazy {
                lazy: () => INamedReusedOwned;
            }
            
            interface IInitialized<T> {
                initializeBy : (action : IInitializer<T>) =>  Register.ILazyNamedReusedOwnedDisposed<T>;
            }

            interface IInitializedLazyDisposedNamedReusedOwned<T>
                extends Register.IInitialized<T>, Register.ILazy, Register.IDisposable<T>, Register.INamedReusedOwned { }
        }

        module Resolve {

            interface IResolve {
                resolve() : ParameterDecorator;
            }

            interface ICache extends Resolve.IResolve {
                cache(name? : string) : Resolve.IResolve;
            }

            interface INamed extends Resolve.IResolve {
                name(value : string) : Resolve.ICache;
            }

            interface INamedCache extends Resolve.INamed, Resolve.ICache, Resolve.IResolve {}

            interface ITry extends Resolve.IResolve {
                attempt() : Resolve.INamedCache;
            }

            interface ITryNamedCache extends Resolve.ITry, Resolve.INamedCache { }

            interface IArgsTryNamedCache extends Resolve.ITryNamedCache, Resolve.IResolve {
                args(...value: Array<any>) : Resolve.ITryNamedCache;
            }
        }
    }
    
    interface IContainerBuilder {
        register<R>(service : any) : IRegistration<R>;
        build() : IContainer;
        copy(builder: Typeioc.IContainerBuilder): void;
    }

    interface IContainer {
        cache : any;
        
        resolve<R>(service: any, ...args:any[]) : R;
        resolveAsync<R>(service: any, ...args:any[]) : Promise<R>;
        
        tryResolve<R>(service: any, ...args:any[]) : R;
        tryResolveAsync<R>(service: any, ...args:any[]) : Promise<R>;
        
        resolveNamed<R>(service: any, name : string, ...args:any[]) : R;
        resolveNamedAsync<R>(service: any, name : string, ...args:any[]) : Promise<R>;
        
        tryResolveNamed<R>(service: any, name : string, ...args:any[]): R;
        tryResolveNamedAsync<R>(service: any, name : string, ...args:any[]) : Promise<R>;
        
        resolveWithDependencies<R>(service: any, dependencies : IDynamicDependency[]) : R;
        resolveWithDependenciesAsync<R>(service: any, dependencies : Typeioc.IDynamicDependency[]) : Promise<R>;
        
        resolveWith<R>(service : any) : IResolveWith<R>;

        createChild : () => IContainer;
        
        dispose: () =>  void;
        disposeAsync() : Promise<void>;
    }

    interface IResolveWith<T>  extends IResolveTryNamedDepCache<T> {
        args(...args:any[]) : IResolveTryNamedDepCache<T>;
    }

    interface IResolveTryNamedDepCache<T> extends IResolveTry<T>, IResolveNamedDepCache<T> { }

    interface IResolveNamedDepCache<T> extends IResolveNamed<T>, IResolveDepCache<T> { }

    interface IResolveDepCache<T> extends IResolveDependencies<T>, IResolveCacheReturn<T> { }

    interface IResolveCacheReturn<T> extends IResolveCache<T>, IResolveReturn<T> { }

    interface IResolveNamed<T> {
        name(value : string) : IResolveDepCache<T>;
    }

    interface IResolveTry<T> {
        attempt() : IResolveNamedDepCache<T>;
    }

    interface IResolveDependencies<T> {
        dependencies(dependencies : Typeioc.IDynamicDependency | Array<Typeioc.IDynamicDependency>) : IResolveDepCache<T>;
    }

    interface IResolveCache<T> {
        cache(name? : string) : IResolveReturn<T>
    }

    interface IResolveReturn<T> {
        exec(): T;
        execAsync(): Promise<T>;
    }

    interface IInitializer<T> {
        (c:IContainer, item: T) : T;
    }

    interface IDisposer<T> {
        (item : T) : void;
    }

    interface IOwned {
        ownedBy: (owner : Types.Owner) => void;
        ownedInternally: () => void;
        ownedExternally: () => void;
    }

    interface IReused {
        within: (scope: Types.Scope) => IOwned;
        transient: () => IOwned;
        singleton: () => IOwned;
        instancePerContainer: () => IOwned;
    }

    interface IReusedOwned extends IReused, IOwned { }

    interface IName {
        named : (name: string) => void;
    }
    
    interface INamed {
        named : (name: string) => IReusedOwned;
    }

    interface INamedReusedOwned extends INamed, IReusedOwned {}

    interface IDisposable<T> {
        dispose : (action : IDisposer<T>) =>  INamedReusedOwned;
    }

    interface INamedReusedOwnedDisposed<T> extends IDisposable<T>, INamedReusedOwned {}

    interface ILazy {
        lazy: () => INamedReusedOwned;
    }

    interface ILazyNamedReusedOwnedDisposed<T> extends ILazy, INamedReusedOwnedDisposed<T> {}

    interface IInitialized<T> {
        initializeBy : (action : IInitializer<T>) => ILazyNamedReusedOwnedDisposed<T>;
    }

    interface IFactory<T> {
        (c: IContainer, ...args: Array<any>) : T;
    }

    interface IInitializedLazyDisposedNamedReusedOwned<T>
        extends IInitialized<T>, ILazy, IDisposable<T>, INamedReusedOwned { }

    interface IAs<T> {
        as(factory: IFactory<T>): IInitializedLazyDisposedNamedReusedOwned<T>;
        asType(type: T, ...params : Array<any>): IInitializedLazyDisposedNamedReusedOwned<T>;
        asSelf(...params : Array<any>): IInitializedLazyDisposedNamedReusedOwned<T>;
        asValue(value): IName;
    }

    interface IRegistration<T> extends IAs<T> { }

    interface IDynamicDependency {
        service : any;
        factory?: IFactory<any>;
        factoryType? : any;
        factoryValue? : any;
        named? : string;
        initializer? : IInitializer<any>;
        required? : boolean;
    }
}

declare module Addons {

    module Interceptors {

        function create() : IInterceptor;

        const enum CallInfoType {
            Method = 1,
            Getter = 2,
            Setter = 3,
            GetterSetter = 4,
            Any = 5,
            Field = 6
        }

        interface IWithSubstituteResult {
            withSubstitute: (substitute: ISubstituteInfo) => IWithSubstituteResult;
            interceptInstance: <R extends Object>(subject: R) => R;
            interceptPrototype: <R extends Function>(subject: R) => R;
            intercept: <R extends (Function | Object)>(subject: R) => R;
        }

        interface IInterceptor {
            interceptPrototype<R extends Function>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R;
            interceptInstance<R extends Object>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R;
            intercept<R extends Function | Object>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R;
            withSubstitute: (substitute: ISubstituteInfo) => IWithSubstituteResult;
        }

        interface ICallInfo {
            source: Object;
            name : string;
            args : Array<any>;
            invoke: (args? : Array<any>) => any;
            type : CallInfoType;
            get? : () => any;
            set? : (any) => void;
            next? : (result? : any)=> any;
            result? : any;
        }

        interface ISubstituteInfo {
            method? : string;
            type? : CallInfoType;
            wrapper : (callInfo: ICallInfo) => any;
        }

        interface ISubstitute extends ISubstituteInfo {
            method? : string;
            type : CallInfoType;
            next? : ISubstitute;
        }
    }
}

declare module "typeioc" {
    export = Typeioc;
}

declare module "typeioc/addons" {
    export = Addons;
}