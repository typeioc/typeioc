import { IRegistrationBase, IRegistration } from '../../registration'
import {
    IRegistrationStorage,
    IDisposableStorage,
    InternalStorage,
    IResolutionCache
} from '../../storage'
import {
    IInternalContainer, IContainer, IContainerApi, ImportApi, IInvoker, IContainerBuilder
} from './common'
import {
    IDecoratorResolutionParamsData,
    IDecoratorRegistrationApi,
    IDecoratorResolutionApi
} from '../../decorators'

export interface IRegistrationBaseService {
    create(service: {}): IRegistrationBase
}

export interface IInstanceRegistrationService {
    create<R>(baseRegistration: IRegistrationBase): IRegistration<R>
}

export interface IRegistrationStorageService {
    create(): IRegistrationStorage
}

export interface IDisposableStorageService {
    create(): IDisposableStorage
}

export interface IInternalStorageService<K, T> {
    create(): InternalStorage<K, T>
}

export interface IInlineInternalStorageService {
    create<R1, R2>(): InternalStorage<R1, R2>
}

export interface IResolutionCacheService {
    create(): IResolutionCache
}

export interface IContainerService {
    create(container: IInternalContainer): IContainer
}

export interface IContainerApiService {
    create<R>(container: ImportApi<R> | undefined): IContainerApi<R>
}

export interface IInternalContainerService {
    resolutionDetails?: IDecoratorResolutionParamsData
    create(): IInternalContainer
}

export interface IDecoratorApiService {
    createRegistration<R>(register: (api: IDecoratorRegistrationApi<R>) => ClassDecorator)
        : IDecoratorRegistrationApi<R>

    createResolution(register: (api: IDecoratorResolutionApi) => ParameterDecorator)
        : IDecoratorResolutionApi
}

export interface IContainerBuilderService {
    create(internalContainerService: IInternalContainerService): IContainerBuilder
}

export interface IInvokerService {
    create(container: IContainer, resolutionDetails?: IDecoratorResolutionParamsData): IInvoker
}
