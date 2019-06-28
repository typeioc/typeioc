import { checkNullArgument } from '../utils'
import { IDecoratorRegistrationApi } from './types'
import {
    IDecoratorRegistration,
    WithDecoratorRegister,
    WithDecoratorRegisterInitializeBy,
    WithDecoratorRegisterLazy,
    WithDecoratorRegisterName,
    WithDecoratorRegisterScope
} from './types/registration'
import { IInitializer, IDisposer } from '../registration'
import { owner, OwnerType, scope, ScopeType } from '../common'

export class RegistrationApi<T> implements IDecoratorRegistrationApi<T> {

    private _service?: {}
    private _name?: string
    private _scope?: ScopeType
    private _owner?: OwnerType
    private _initializedBy?: IInitializer<T>
    private _disposedBy?: IDisposer<T>
    private _isLazy: boolean

    public get service(): {} | undefined {
        return this._service
    }

    public get name(): string | undefined {
        return this._name
    }

    public get scope(): ScopeType | undefined {
        return this._scope
    }

    public get owner(): OwnerType  | undefined {
        return this._owner
    }

    public get initializedBy(): IInitializer<T> | undefined {
        return this._initializedBy
    }

    public get isLazy(): boolean {
        return this._isLazy
    }

    public get disposedBy(): IDisposer<T> | undefined {
        return this._disposedBy
    }

    constructor(private _register: (api: IDecoratorRegistrationApi<T>) => ClassDecorator) {
        this.initializeBy = this.initializeBy.bind(this)
        this.lazy = this.lazy.bind(this)
        this.dispose = this.dispose.bind(this)
        this.named = this.named.bind(this)
        this.within = this.within.bind(this)
        this.transient = this.transient.bind(this)
        this.singleton = this.singleton.bind(this)
        this.instancePerContainer = this.instancePerContainer.bind(this)
        this.ownedBy = this.ownedBy.bind(this)
        this.ownedInternally = this.ownedInternally.bind(this)
        this.ownedExternally = this.ownedExternally.bind(this)
        this.register = this.register.bind(this)

        this._isLazy = false
    }

    public provide(service: {}): IDecoratorRegistration<T> {

        checkNullArgument(service, 'service')

        const result = this.provideUndefined()
        this._service = service

        return result
    }

    public provideUndefined(): IDecoratorRegistration<T> {

        this._service = undefined

        return {
            initializeBy : this.initializeBy,
            lazy : this.lazy,
            dispose : this.dispose,
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        }
    }

    private initializeBy(action: IInitializer<T>): WithDecoratorRegisterInitializeBy<T> {

        checkNullArgument(action, 'action')

        this._initializedBy = action

        return {
            lazy : this.lazy,
            dispose : this.dispose,
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        }
    }

    private lazy(): WithDecoratorRegisterLazy<T> {
        this._isLazy = true

        return {
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        }
    }

    private dispose(action: IDisposer<T>): WithDecoratorRegisterLazy<T> {

        checkNullArgument(action, 'action')

        this._disposedBy = action

        return {
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        }
    }

    private named(name: string): WithDecoratorRegisterName<T> {

        checkNullArgument(name, 'name')

        this._name = name

        return {
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        }
    }

    private within(scope: ScopeType): WithDecoratorRegisterScope<T> {

        checkNullArgument(scope, 'scope')

        this._scope = scope

        return {
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        }
    }

    private transient(): WithDecoratorRegisterScope<T> {
        return this.within(scope.none)
    }

    private singleton(): WithDecoratorRegisterScope<T> {
        return this.within(scope.hierarchy)
    }

    private instancePerContainer(): WithDecoratorRegisterScope<T> {
        return this.within(scope.container)
    }

    private ownedBy(owner: OwnerType): WithDecoratorRegister<T> {

        checkNullArgument(owner, 'owner')

        this._owner = owner

        return {
            register: this.register
        }
    }

    private ownedInternally(): WithDecoratorRegister<T> {
        return this.ownedBy(owner.container)
    }

    private ownedExternally(): WithDecoratorRegister<T> {
        return this.ownedBy(owner.externals)
    }

    private register(): ClassDecorator {
        return this._register(this)
    }
}
