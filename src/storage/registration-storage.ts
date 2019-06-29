import { registrationType, IFactory, IRegistrationBase } from '../registration'
import {
    Store,
    FactoryStore,
    FactoryTypeStore,
    FactoryValueStore,
    AddStrategy,
    GetStrategy,
    IRegistrationStorage
} from './types'
import { empty } from './store'
import { IInternalStorage } from '../storage'
import { IInlineInternalStorageService } from '../build'

export class RegistrationStorage implements IRegistrationStorage {

    private _internalStorage: IInternalStorage<{}, Store>
    private _addStrategy: AddStrategy[] = []
    private _getStrategy: GetStrategy[] = []

    constructor(storageService: IInlineInternalStorageService) {
        this._internalStorage = storageService.create<{}, Store>()

        this._addStrategy[registrationType.factoryType] = this.addForFactoryType.bind(this)
        this._addStrategy[registrationType.factory] = this.addForFactory.bind(this)
        this._addStrategy[registrationType.factoryValue] = this.addForFactoryValue.bind(this)

        this._getStrategy[registrationType.factoryType] =
            this.getForFactoryType.bind(this) as GetStrategy
        this._getStrategy[registrationType.factory] =
            this.getForFactory.bind(this) as GetStrategy
        this._getStrategy[registrationType.factoryValue] =
            this.getForFactoryValue.bind(this) as GetStrategy
    }

    public addEntry(registration: IRegistrationBase) : void {

        const strategy = this._addStrategy[registration.registrationType!]
        strategy(registration)
    }

    public getEntry(registration: IRegistrationBase): IRegistrationBase | undefined {

        const storage = this._internalStorage.tryGet(registration.service)

        if (!storage) return undefined

        return this._getStrategy[storage.type](registration, storage)
    }

    public clear() {
        this._internalStorage.clear()
    }

    private addForFactoryType(registration: IRegistrationBase) {

        const storage = this._internalStorage.register(
            registration.service, empty.typeFactoryBucket
        )

        if (!registration.name) {
            storage.factory.noName = registration
        } else {
            storage.factory.names[registration.name] = registration
        }
    }

    private addForFactory(registration: IRegistrationBase) {

        const storage = this._internalStorage.register(
            registration.service, empty.factoryBucket
        ) as FactoryStore

        const argsCount = this.getArgumentsCount(registration)

        if (!registration.name) {
            storage.factory.noName[argsCount] = registration
        } else {
            const bucket = storage.factory.names[registration.name] || {}
            bucket[argsCount] = registration
            storage.factory!.names[registration.name] = bucket
        }
    }

    private addForFactoryValue(registration: IRegistrationBase) {
        const storage = this._internalStorage.register(
            registration.service, empty.valueFactoryBucket
        )
        storage.type = registrationType.factoryValue

        if (!registration.name) {
            storage.factory.noName = registration
        } else {
            storage.factory.names[registration.name] = registration
        }
    }

    private getForFactoryType(registration: IRegistrationBase, storage: FactoryTypeStore):
        IRegistrationBase |undefined {

        return !registration.name ? storage.factory.noName :
            storage.factory.names[registration.name]
    }

    private getForFactory(registration: IRegistrationBase, storage: FactoryStore):
        IRegistrationBase | undefined {

        const argsCount = this.getArgumentsCount(registration)
        const name = registration.name ? storage.factory.names[registration.name] : undefined

        return registration.name ?
            (name ? name[argsCount] : undefined) :
            storage.factory.noName[argsCount]
    }

    private getForFactoryValue(registration: IRegistrationBase, storage: FactoryValueStore):
        IRegistrationBase | undefined {

        return !registration.name ? storage.factory.noName :
            storage.factory.names[registration.name]
    }

    private getArgumentsCount(registration: IRegistrationBase) : number {

        return registration.factory ?
            this.getFactoryArgsCount(registration.factory) :
            registration.args.length
    }

    private getFactoryArgsCount(factory: IFactory<{}>): number {

        const paramsCount = (<Function>factory).length
        return Math.max(paramsCount - 1, 0)
    }
}
