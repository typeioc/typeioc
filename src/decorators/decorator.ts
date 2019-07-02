import { DecoratorError } from '../exceptions/index.js'
import {
    IDecorator,
    IDecoratorResolutionCollection,
    IDecoratorResolutionApi,
    IDecoratorResolutionParams,
    decoratorResolutionParameter,
    IDecoratorRegistrationApi
} from './types/index.js'
import { IInternalStorage } from '../storage'
import {
    IContainerBuilderService,
    IDecoratorApiService,
    IInternalStorageService,
    IInternalContainerService,
    IContainerBuilder,
    IContainer
} from '../build'
import { IRegistration } from '../registration'
import { IDecoratorRegistration } from './types/registration'
import { IDecoratorResolution } from './types/resolution'
import { defaults } from '../common/index.js'
import { getMetadata, isPrototype, isFunction } from '../utils/index.js'

export class Decorator implements IDecorator {

    private _builder: IContainerBuilder
    private _internalStorage: IInternalStorage<{}, IDecoratorResolutionCollection>

    constructor(
        builderService: IContainerBuilderService,
        internalContainerService: IInternalContainerService,
        private _decoratorRegistrationApiService: IDecoratorApiService,
        private _internalStorageService:
            IInternalStorageService<{}, IDecoratorResolutionCollection>) {

        this._internalStorage = this._internalStorageService.create()

        internalContainerService.resolutionDetails = this._internalStorage
        this._builder = builderService.create(internalContainerService)
    }

    public build(): IContainer {
        return this._builder.build()
    }

    public provide<R>(service: {}): IDecoratorRegistration<R> {
        const register = createRegister<R>(this._builder)
        const api = this._decoratorRegistrationApiService.createRegistration<R>(register)
        return api.provide(service)
    }

    public provideSelf<R>(): IDecoratorRegistration<R> {
        const register = createRegister<R>(this._builder, true)
        const api = this._decoratorRegistrationApiService.createRegistration<R>(register)
        return api.provideUndefined()
    }

    public by(service?: {}): IDecoratorResolution {

        const resolve =
            (api: IDecoratorResolutionApi): ParameterDecorator =>
                (target, _key, index) => {

                    if (!api.service) {
                        const dependencies = getMetadata(target)
                        api.service = dependencies[index]
                    }

                    const bucket = this._internalStorage.register(target,
                        () => <IDecoratorResolutionCollection>{})

                    bucket[index] = <IDecoratorResolutionParams> {
                        service: api.service,
                        args: api.args,
                        attempt: api.attempt,
                        name: api.name,
                        cache: api.cache,
                        type: decoratorResolutionParameter.service
                    }
                }

        const api = this._decoratorRegistrationApiService.createResolution(resolve)

        return api.by(service)
    }

    public resolveValue(value: {} | Function) : ParameterDecorator {

        return (target, _key, index) => {

            const bucket = this._internalStorage.register(
                target,
                () => <IDecoratorResolutionCollection>{})

            const type = isFunction(value) ?
                decoratorResolutionParameter.functionValue :
                decoratorResolutionParameter.value

            bucket[index] = <IDecoratorResolutionParams> {
                value,
                type
            }
        }
    }

    public register<R>(service: {}): IRegistration<R> {
        return this._builder.register<R>(service)
    }

    public import(builder: IContainerBuilder): void {
        this._builder.copy(builder)
    }
}

function createRegister<R>(builder: IContainerBuilder, isSelf = false) {
    return (api: IDecoratorRegistrationApi<R>): ClassDecorator => (target) => {

        if (!isPrototype(target)) {
            throw new DecoratorError(
                { message: 'Decorator target not supported, not a prototype', data: { target } })
        }

        const registration = isSelf ?
            builder.register<R>(target).asSelf() :
            builder.register<R>(api.service!).asType(target as unknown as R)

        const initializer = api.initializedBy
        if (initializer) {
            registration.initializeBy(initializer)
        }

        const isLazy = api.isLazy
        if (isLazy) {
            registration.lazy()
        }

        const disposer = api.disposedBy
        if (disposer) {
            registration.dispose(disposer)
        }

        const name = api.name
        if (name) {
            registration.named(name)
        }

        const scope = api.scope || defaults.scope
        registration.within(scope)

        const owner = api.owner || defaults.owner
        registration.ownedBy(owner)

        return target
    }
}
