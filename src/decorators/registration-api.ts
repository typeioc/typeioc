import { checkNullArgument } from '../utils/index.js'
import { IDecoratorRegistrationApi } from './types'
import {
    IDecoratorRegistration,
    WithDecoratorRegister,
    WithDecoratorRegisterInitializeBy,
    WithDecoratorRegisterLazy,
    WithDecoratorRegisterName
} from './types/registration'
import { IInitializer, IDisposer } from '../registration'
import { scope, ScopeType } from '../common/index.js'

export class RegistrationApi<T> implements IDecoratorRegistrationApi<T> {

    private _service?: {}
    private _name?: string
    private _scope?: ScopeType
    private _initializedBy?: IInitializer<unknown>
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

    public get initializedBy(): IInitializer<T> | undefined {
        return this._initializedBy as IInitializer<T>
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
            register: this.register
        }
    }

    private initializeBy<K extends T>(action: IInitializer<K>):
    WithDecoratorRegisterInitializeBy<K> {

        checkNullArgument(action, 'action')

        this._initializedBy = action as IInitializer<unknown>

        return {
            lazy : this.lazy,
            dispose : this.dispose,
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
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
            register: this.register
        }
    }

    private dispose<K extends T>(action: IDisposer<K>): WithDecoratorRegisterLazy<K> {

        checkNullArgument(action, 'action')

        this._disposedBy = action as IDisposer<T>

        return {
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
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
            register: this.register
        }
    }

    private within(scope: ScopeType): WithDecoratorRegister<T> {

        checkNullArgument(scope, 'scope')

        this._scope = scope

        return {
            register: this.register
        }
    }

    private transient(): WithDecoratorRegister<T> {
        return this.within(scope.none)
    }

    private singleton(): WithDecoratorRegister<T> {
        return this.within(scope.hierarchy)
    }

    private instancePerContainer(): WithDecoratorRegister<T> {
        return this.within(scope.container)
    }

    private register(): ClassDecorator {
        return this._register(this)
    }
}
