import {
    IFactory,
    IName,
    IInitializer,
    IDisposer,
    IRegisterWithAs, RegisterWithInitializeBy, RegisterWithLazy, RegisterWithName,
    IRegistrationBase,
    IRegistration
} from './types'
import { scope, owner, ScopeType, OwnerType } from '../common/index.js'
import { checkNullArgument } from '../utils/index.js'

export class Registration<T> implements IRegistration<T> {

    constructor(private _base: IRegistrationBase) {
        this.initializeBy = this.initializeBy.bind(this)
        this.dispose = this.dispose.bind(this)
        this.named = this.named.bind(this)
        this.name = this.name.bind(this)
        this.within = this.within.bind(this)
        this.ownedBy = this.ownedBy.bind(this)
        this.transient = this.transient.bind(this)
        this.singleton = this.singleton.bind(this)
        this.instancePerContainer = this.instancePerContainer.bind(this)
        this.lazy = this.lazy.bind(this)
    }

    public as(factory: IFactory<T>): IRegisterWithAs<T> {
        checkNullArgument(factory, 'factory')

        this._base.factory = factory

        return {
            initializeBy: this.initializeBy,
            lazy: this.lazy,
            dispose: this.dispose,
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        }
    }

    public asType(type: T, ...params: any[]): IRegisterWithAs<T> {
        checkNullArgument(type, 'type')

        this._base.factoryType = type
        this._base.params = params

        return {
            initializeBy: this.initializeBy,
            lazy: this.lazy,
            dispose: this.dispose,
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        }
    }

    public asSelf(...params: any[]): IRegisterWithAs<T> {
        return this.asType(this._base.service as T, ...params)
    }

    public asValue(value: {}): IName {
        checkNullArgument(value, 'value')

        this._base.factoryValue = value
        this._base.owner = owner.externals
        this._base.scope = scope.none

        return {
            named: this.name
        }
    }

    private name(value: string): void {
        this.named(value)
    }

    private named(value: string): RegisterWithName<T> {
        checkNullArgument(value, 'value')

        this._base.name = value

        return {
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        }
    }

    private within(scope: ScopeType): void {
        checkNullArgument(scope, 'scope')

        this._base.scope = scope
    }

    private transient(): void {
        return this.within(scope.none)
    }

    private singleton(): void {
        return this.within(scope.hierarchy)
    }

    private instancePerContainer(): void {
        return this.within(scope.container)
    }

    private ownedBy(owner: OwnerType): void {
        checkNullArgument(owner, 'owner')

        this._base.owner = owner
    }

    private initializeBy<K extends T>(action: IInitializer<K>): RegisterWithInitializeBy<K> {
        checkNullArgument(action, 'action');

        (this._base.initializer as IInitializer<K> | undefined) = action

        return {
            lazy: this.lazy,
            dispose: this.dispose,
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        }
    }

    private dispose<K extends T>(action: IDisposer<K>): RegisterWithLazy<K> {
        checkNullArgument(action, 'action');

        (this._base.disposer as IDisposer<K> | undefined) = action
        this.ownedBy(owner.container)

        return {
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        }
    }

    private lazy(): RegisterWithLazy<T> {
        this._base.isLazy = true

        return {
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        }
    }
}
