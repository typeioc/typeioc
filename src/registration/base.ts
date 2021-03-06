import {
    registrationType,
    RegistrationType,
    IDynamicDependency,
    Factory,
    Initializer,
    Disposer,
    IRegistrationBase
} from './types/index.js'

import { IContainer } from '../build'
import { OwnerType, owner, ScopeType } from '../common/index.js'
import { ApplicationError } from '../exceptions/index.js'
import { uuid, factoryValueKey, isArray } from '../utils/index.js'

export class RegistrationBase implements IRegistrationBase {
    private _id: string
    private _factory?: Factory<{}>
    private _factoryType?: {}
    private _factoryValue?: {}
    private _name?: string
    private _scope?: ScopeType
    private _owner: OwnerType = owner.externals
    private _initializer?: Initializer<{}>
    private _disposer?: Disposer<{}>
    private _args: {}[] = []
    private _params: {}[] = []
    private _container?: IContainer
    private _instance?: {}
    private _dependenciesValue: IDynamicDependency[] = []
    private _registrationType?: RegistrationType
    private _isLazy: boolean = false

    public get name(): string | undefined {
        return this._name
    }

    public set name(value: string | undefined) {
        this._name = value
    }

    public get service(): {} {
        return this._service
    }

    public get scope(): ScopeType | undefined {
        return this._scope
    }

    public set scope(value: ScopeType | undefined) {
        this._scope = value
    }

    public get owner(): OwnerType {
        return this._owner
    }

    public set owner(value: OwnerType) {
        this._owner = value
    }

    public get initializer(): Initializer<{}> | undefined {
        return this._initializer
    }

    public set initializer(value: Initializer<{}> | undefined) {
        this._initializer = value
    }

    public get disposer(): Disposer<{}> | undefined {
        return this._disposer
    }

    public set disposer(value: Disposer<{}> | undefined) {
        this._disposer = value
    }

    public get args(): any[] {
        return this._args
    }

    public set args(value: any[]) {
        this._args = value
    }

    public get params(): {}[] {
        return this._params
    }

    public set params(value: {}[]) {
        this._params = value
    }

    public get container(): IContainer | undefined {
        return this._container
    }

    public set container(value: IContainer | undefined) {
        this._container = value
    }

    public get instance(): {} | undefined {
        return this._instance
    }

    public set instance(value: {} | undefined) {
        this._instance = value
    }

    public get registrationType(): RegistrationType | undefined {
        if (!this._registrationType) {
            throw new ApplicationError({
                message: 'Unknown registration type',
                data: this._registrationType
            })
        }

        return this._registrationType
    }

    public get dependenciesValue(): IDynamicDependency[] {
        return this._dependenciesValue
    }

    public set dependenciesValue(value: IDynamicDependency[]) {
        this._dependenciesValue = isArray(value) ? value : []
    }

    public get factory(): Factory<{}> | undefined {
        return this._factory
    }

    public set factory(value: Factory<{}> | undefined) {
        this._factory = value
        this._registrationType = registrationType.factory
    }

    public get factoryType(): {} | undefined {
        return this._factoryType
    }

    public set factoryType(value: {} | undefined) {
        this._factoryType = value
        this._registrationType = registrationType.factoryType
    }

    public get factoryValue(): {} | undefined {
        return this._factoryValue
    }

    public set factoryValue(value) {
        this._factoryValue = value
        this._registrationType = registrationType.factoryValue
    }

    public get id(): string {
        return this._id
    }

    public get isLazy() : boolean {
        return this._isLazy
    }

    public set isLazy(value: boolean) {
        this._isLazy = value
    }

    constructor(private _service: {}, id?: string) {
        this.args = []
        this.params = []

        this._id = id || uuid()
    }

    public cloneFor(container: IContainer): IRegistrationBase {
        const result = this.clone()
        result.container = container
        return result
    }

    public clone(): IRegistrationBase {
        const result = new RegistrationBase(this._service, this._id)
        result._factory = this._factory
        result._factoryType = this._factoryType
        result._factoryValue = this._factoryValue
        result._registrationType = this._registrationType
        result.owner = this._owner
        result.scope = this._scope
        result.initializer = this._initializer
        result.isLazy = this._isLazy
        result.params = this._params
        result.dependenciesValue = this._dependenciesValue

        return result
    }

    public copyDependency(dependency: IDynamicDependency) {
        this.name = dependency.named
        this.initializer = dependency.initializer

        if (dependency.factory) {
            this.factory = dependency.factory
        }

        if (dependency.factoryType) {
            this.factoryType = dependency.factoryType
        }

        if (factoryValueKey in dependency) {
            this.factoryValue = dependency.factoryValue
        }
    }

    public checkRegistrationType() {
        /// throws exception when no type
        this.registrationType
    }
}
