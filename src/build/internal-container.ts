import { IRegistrationBase, IDynamicDependency } from '../registration'
import { ResolutionError, CircularDependencyError } from '../exceptions'
import { owner, scope } from '../common'
import {
    IRegistrationStorageService,
    IDisposableStorageService,
    IRegistrationBaseService,
    IContainerApiService,
    IInvokerService,
    IResolutionCacheService,
    IContainer,
    IInternalContainer,
    IContainerApi, ImportApi,
    IInvoker
} from './types'
import { IDecoratorResolutionParamsData } from '../decorators'
import { IDisposableStorage, IRegistrationStorage, IResolutionCache } from '../storage'
import { IndexedCollection, ICache } from '../types'
import { IResolveWith } from './types/resolution'

export class InternalContainer implements IInternalContainer {

    private parent: InternalContainer | undefined
    private children: InternalContainer [] = []
    private _pendingResolutions: IndexedCollection<boolean>
    private _disposableStorage: IDisposableStorage
    private _collection: IRegistrationStorage
    private _invoker: IInvoker
    private _dependencyScope = scope.none
    private _dependencyOwner = owner.externals
    private _cache: ICache
    private _resolutionCache: IResolutionCache

    constructor(private _registrationStorageService: IRegistrationStorageService,
                private _disposableStorageService: IDisposableStorageService,
                private _registrationBaseService: IRegistrationBaseService,
                private _containerApiService: IContainerApiService,
                private _invokerService: IInvokerService,
                private _resolutionCacheService: IResolutionCacheService,
                private _resolutionDetails?: IDecoratorResolutionParamsData) {

        this._collection = this._registrationStorageService.create()
        this._disposableStorage = this._disposableStorageService.create()
        this._invoker = this._invokerService.create(this, _resolutionDetails)
        this._pendingResolutions = {}

        this.registerImpl = this.registerImpl.bind(this)
        this._resolutionCache = _resolutionCacheService.create()
        this._cache = this.createCache(this._resolutionCache)
    }

    public get cache(): ICache {
        return this._cache
    }

    public add(registrations : IRegistrationBase[]) {
        registrations.forEach(this.registerImpl)
    }

    public createChild(): IContainer {

        const child = new InternalContainer(
            this._registrationStorageService,
            this._disposableStorageService,
            this._registrationBaseService,
            this._containerApiService,
            this._invokerService,
            this._resolutionCacheService,
            this._resolutionDetails)

        child.parent = this
        this.children.push(child)
        return child
    }

    public dispose(): void {
        this._disposableStorage.disposeItems()

        while (this.children.length > 0) {
            const item = this.children.pop()!
            item.dispose()
        }

        this._collection.clear()
        this._resolutionCache.clear()
    }

    public disposeAsync(): never {
        throw new Error('Not implemented')
    }

    public resolve<R>(service: {}, ...args: {}[]): R {
        const registration = this.createRegistration(service)
        registration.args = args

        return this.resolveBase(registration, true) as R
    }

    public resolveAsync(_service: {}, ..._args: {}[]): never {
        throw new Error('Not implemented')
    }

    public tryResolve<R>(service: {}, ...args: {}[]): R | undefined {
        const registration = this.createRegistration(service)
        registration.args = args

        return this.resolveBase(registration, false) as (R | undefined)
    }

    public tryResolveAsync(_service: {}, ..._args: {}[]): never {
        throw new Error('Not implemented')
    }

    public resolveNamed<R>(service: {}, name: string, ...args:{}[]): R {
        const registration = this.createRegistration(service)
        registration.name = name
        registration.args = args

        return this.resolveBase(registration, true) as R
    }

    public resolveNamedAsync<R>(_service: R, _name: string, ..._args: {}[]): never {
        throw new Error('Not implemented')
    }

    public tryResolveNamed<R>(service: {}, name: string, ...args: {}[]): R | undefined {
        const registration = this.createRegistration(service)
        registration.name = name
        registration.args = args

        return this.resolveBase(registration, false) as (R | undefined)
    }

    public tryResolveNamedAsync<R>(_service: R, _name: string, ..._args: {}[]): never {
        throw new Error('Not implemented')
    }

    public resolveWithDependencies<R>(
        service: {}, dependencies: IDynamicDependency[]): R {

        // Import API container is passed as undefined because we only
        // care about carrying the dependencies
        const api = this._containerApiService.create<R>(undefined)
        api.service(service)
            .dependencies(dependencies)

        return this.resolveWithDepBase<R>(api) as R
    }

    public resolveWithDependenciesAsync<R>(
        _service: R, _dependencies: IDynamicDependency[]): never {
        throw new Error('Not implemented')
    }

    public resolveWith<R>(service: {}): IResolveWith<R> | never {
        const importApi: ImportApi<R> = {
            execute: (api: IContainerApi<R>): R => {

                let result:R

                if (api.isDependenciesResolvable) {
                    result = this.resolveWithDepBase(api) as R
                } else {
                    const registration = this.createRegistration(api.serviceValue)
                    registration.name = api.nameValue
                    registration.args = api.argsValue

                    result = this.resolveBase(registration, api.throwResolveError) as R
                }

                if (result && api.cacheValue.use) {
                    this.addToCache(result, api)
                }

                return result
            }
        }

        const api = this._containerApiService.create<R>(importApi)
        return api.service(service)
    }

    private registerImpl(registration: IRegistrationBase) : void {

        registration.checkRegistrationType()
        registration.container = this

        this._collection.addEntry(registration)
    }

    private resolveBase(registration: IRegistrationBase, throwIfNotFound: boolean)
        : {} | undefined |never {
        const entry = this.resolveImpl(registration, throwIfNotFound)

        if (!entry && !throwIfNotFound) {
            return undefined
        }

        if (this._pendingResolutions[entry.id]) {
            throw new CircularDependencyError(`Circular dependency for service: ${entry.service}`)
        }

        try {
            this._pendingResolutions[entry.id] = true

            // ------------ with args always returns new instance ...
            if (registration.args && registration.args.length) {
                return this.createTrackable(entry, throwIfNotFound, registration.args)
            }

            return this.resolveScope(entry, throwIfNotFound)

        } finally {
            delete this._pendingResolutions[entry.id]
        }
    }

    private resolveImpl(
        registration: IRegistrationBase, throwIfNotFound: boolean): IRegistrationBase {

        const serviceEntry = this._collection.getEntry(registration)

        if (!serviceEntry && this.parent) {
            return this.parent.resolveImpl(registration, throwIfNotFound)
        }

        if (!serviceEntry  && throwIfNotFound) {
            throw new ResolutionError({
                message: 'Could not resolve service',
                data: registration.service
            })
        }

        return serviceEntry!
    }

    private resolveScope(registration: IRegistrationBase,
                         throwIfNotFound: boolean): {} {

        switch (registration.scope) {
            case scope.none:
                return this.createTrackable(registration, throwIfNotFound)

            case scope.container:
                return this.resolveContainerScope(registration, throwIfNotFound)

            case scope.hierarchy:
                return this.resolveHierarchyScope(registration, throwIfNotFound)

            default:
                throw new ResolutionError({ message: 'Unknown scoping' })
        }
    }

    private resolveContainerScope(
        registration: IRegistrationBase, throwIfNotFound: boolean): {} {
        let entry: IRegistrationBase

        if (registration.container !== this) {
            entry = registration.cloneFor(this)
            this._collection.addEntry(entry)
        } else {
            entry = registration
        }

        if (!entry.instance) {
            entry.instance = this.createTrackable(entry, throwIfNotFound)
        }

        return entry.instance!
    }

    private resolveHierarchyScope(
        registration: IRegistrationBase, throwIfNotFound: boolean): {} {
        if (registration.container &&
            registration.container !== this) {

            const container = <InternalContainer>registration.container

            return container.resolveBase(registration, throwIfNotFound) as {}
        }

        if (!registration.instance) {
            registration.instance = this.createTrackable(registration, throwIfNotFound)
        }

        return registration.instance as {}
    }

    private createTrackable(
        registration: IRegistrationBase, throwIfNotFound : boolean, args?: {}[]): {} {

        try {
            let instance = this._invoker.invoke(registration, throwIfNotFound, args) as {}

            if (registration.initializer) {
                instance = registration.initializer(this, instance)
            }

            if (registration.owner === owner.container &&
                !registration.isLazy &&
                registration.disposer) {
                this._disposableStorage.add(instance, registration.disposer)
            }

            return instance

        } catch (error) {

            if (error instanceof CircularDependencyError) {
                throw error
            }

            let message = 'Could not instantiate service'
            if (error instanceof ResolutionError) {
                message += `. ${error.message}`
            }

            throw new ResolutionError({ message, data: registration.service, error })
        }
    }

    private createRegistration(service: {}): IRegistrationBase {
        return this._registrationBaseService.create(service)
    }

    private createDependenciesRegistration<R>(api: IContainerApi<R>): IRegistrationBase[] {

        const items = api.dependenciesValue.map(dependency => {

            if (!dependency.service) {
                throw new ResolutionError({ message: 'Service is not defined', data: dependency })
            }

            const registration = this.createRegistration(dependency.service)
            registration.copyDependency(dependency)
            registration.checkRegistrationType()

            const throwOnError = dependency.required !== false && api.throwResolveError

            return {
                implementation : this.resolveImpl(registration, throwOnError),
                dependency
            }
        })
        .filter(item => item.implementation ||
                        item.dependency.required === false ? true : false)

        if (items.length !== api.dependenciesValue.length) return []

        return items.map(item => {
            const baseRegistration = item.dependency.required === false ?
                this.createRegistration(item.dependency.service)
                : item.implementation.cloneFor(this)

            baseRegistration.copyDependency(item.dependency)
            baseRegistration.disposer = undefined
            baseRegistration.scope = this._dependencyScope
            baseRegistration.owner = this._dependencyOwner

            return baseRegistration
        })
    }

    private resolveWithDepBase<R>(api: IContainerApi<R>): R | undefined {
        const child = <InternalContainer>this.createChild()

        const registration = this.createRegistration(api.serviceValue)
        registration.args = api.argsValue
        registration.name = api.nameValue

        const implementation = this.resolveImpl(registration, api.throwResolveError)
        if (!implementation && !api.throwResolveError) {
            return undefined
        }

        const baseRegistration = implementation.cloneFor(child)
        baseRegistration.args = api.argsValue
        baseRegistration.name = api.nameValue
        baseRegistration.disposer = undefined
        baseRegistration.dependenciesValue = api.dependenciesValue
        baseRegistration.scope = this._dependencyScope
        baseRegistration.owner = this._dependencyOwner

        const registrations = this.createDependenciesRegistration(api)

        if (registrations.length <= 0) {
            return undefined
        }

        registrations.push(baseRegistration)

        child.add(registrations)

        return <R>child.resolveBase(baseRegistration, api.throwResolveError)
    }

    private createCache(resolutionCache: IResolutionCache): ICache {
        return {
            get instance() {
                return resolutionCache.instance
            },

            resolve(name: string) {
                return resolutionCache.resolve(name)
            }
        }
    }

    private addToCache(value: {}, api: IContainerApi<{}>) : void {
        let name: string

        if (api.cacheValue.name) {
            name = api.cacheValue.name
        } else
        if (api.nameValue) {
            name = api.nameValue
        } else
        if ((<{name : string}>api.serviceValue).name) {
            name = (<{name : string}>api.serviceValue).name
        } else
        if (typeof api.serviceValue === 'string') {
            name = api.serviceValue
        } else {
            throw new ResolutionError({ message: 'Missing cache name' })
        }

        this._resolutionCache.add(name, value)
    }
}
