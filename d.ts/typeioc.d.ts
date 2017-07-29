/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/


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

        class ConfigurationError extends ApplicationError { }

        class NullReferenceError extends ApplicationError { }

        class ProxyError extends ApplicationError { }
    }
    
    module Decorators {

        interface IDecorator {
            build() : Typeioc.IContainer;
            provide<R>(service: any) : Register.IInitializedDisposedNamedReusedOwned<R>;
            by(service? : any) : Decorators.Resolve.IArgsTryNamedCache;
            resolveValue(value: any) : ParameterDecorator;
        }

        module Register {
            interface IRegister {
                register() : ClassDecorator;
            }

            interface IOwned extends Register.IRegister {
                ownedBy : (owner : Types.Owner) => Register.IRegister;
            }

            interface IReused extends Register.IRegister {
                within : (scope: Types.Scope) => Register.IOwned;
            }

            interface IReusedOwned extends Register.IReused, Register.IOwned { }

            interface INamed extends Register.IRegister {
                named : (name: string) => Register.IReusedOwned;
            }

            interface INamedReusedOwned extends Register.INamed, Register.IReusedOwned { }

            interface IDisposable<T> {
                dispose : (action : IDisposer<T>) =>  Register.INamedReusedOwned;
            }

            interface INamedReusedOwnedDisposed<T> extends Register.IDisposable<T>, Register.INamedReusedOwned {}

            interface IInitialized<T> {
                initializeBy : (action : IInitializer<T>) =>  Register.INamedReusedOwnedDisposed<T>;
            }

            interface IInitializedDisposedNamedReusedOwned<T>
                extends Register.IInitialized<T>, Register.IDisposable<T>, Register.INamedReusedOwned { }
        }

        module Resolve {

            interface IResolveExact {
                resolve() : ParameterDecorator;
            }

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
    
    module Extensions {
        
        interface IPromiseExensions {
            promiseLike<R, T extends PromiseLike<R>>(execute : () => R) : T;
        }
    }
    
    interface IContainerBuilder {
        register<R>(service : any) : IRegistration<R>;
        registerModule(serviceModule : Object) : Typeioc.IAsModuleRegistration;
        build() : IContainer
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
        execAsync() : Promise<T>;
    }

    interface IInitializer<T> {
        (IContainer, item : T) : T;
    }

    interface IDisposer<T> {
        (item : T) : void;
    }

    interface IOwned {
        ownedBy : (owner : Types.Owner) => void;
    }

    interface IReused {
        within : (scope: Types.Scope) => IOwned;
    }

    interface IReusedOwned extends IReused, IOwned { }

    interface INamed {
        named : (name: string) => IReusedOwned;
    }

    interface INamedReusedOwned extends INamed, IReusedOwned {}

    interface IDisposable<T> {
        dispose : (action : IDisposer<T>) =>  INamedReusedOwned;
    }

    interface INamedReusedOwnedDisposed<T> extends IDisposable<T>, INamedReusedOwned {}

    interface IInitialized<T> {
        initializeBy : (action : IInitializer<T>) => INamedReusedOwnedDisposed<T>;
    }

    interface IFactory<T> {
        (c: IContainer, arg1 : any, arg2 : any, arg3 : any, arg4 : any, arg5 : any, arg6 : any, arg7 : any) : T;
    }

    interface IInitializedDisposedNamedReusedOwned<T> extends IInitialized<T>, IDisposable<T>, INamedReusedOwned { }

    interface IAs<T> {
        as(factory: IFactory<T>) : IInitializedDisposedNamedReusedOwned<T>;
        asType(type : T, ...params : Array<any>) : IInitializedDisposedNamedReusedOwned<T>;
    }

    interface IRegistration<T> extends IAs<T> { }

    interface IModuleReusedOwned extends IReusedOwned {
        forService<R>(service: any, factory : IFactory<R>) : IModuleReusedOwned;
        forArgs(service: any, ...args:any[]) : IModuleReusedOwned;
        named(service: any, name : string) : IModuleReusedOwned;
    }

    interface IAsModuleRegistration {
        as : (asModule : Object) => IModuleReusedOwned;
    }

    interface IDynamicDependency {
        service : any;
        factory?: IFactory<any>;
        factoryType? : any;
        named? : string;
        initializer? : IInitializer<any>;
        required? : boolean;
    }
}

declare module "typeioc" {
    export = Typeioc;
}