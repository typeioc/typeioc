import { IRegistration, IRegistrationBase } from '../registration'
import {
    IRegistrationBaseService,
    IInstanceRegistrationService,
    IInternalContainerService,
    IContainerService,
    IContainer,
    IContainerBuilder
} from './types'
import { defaults } from '../common'
import { checkNullArgument }  from '../utils'

export class ContainerBuilder implements IContainerBuilder {
    private _registrations: IRegistrationBase[]

    constructor(private _registrationBaseService: IRegistrationBaseService,
                private _instanceRegistrationService: IInstanceRegistrationService,
                private _internalContainerService : IInternalContainerService,
                private _containerService: IContainerService) {

        this._registrations = []
    }

    public register<R>(service: {}): IRegistration<R> {

        checkNullArgument(service, 'service')

        const registrationBase = this._registrationBaseService.create(service)
        const registration = this._instanceRegistrationService.create<R>(registrationBase)

        setDefaults(registrationBase)

        this._registrations.push(registrationBase)

        return registration
    }

    public build(): IContainer {

        const registrations = this._registrations.slice(0)

        const internalContainer = this._internalContainerService.create()
        const container = this._containerService.create(internalContainer)
        internalContainer.add(registrations)

        return {
            cache: container.cache,
            resolve: container.resolve.bind(container),
            resolveAsync: container.resolveAsync.bind(container),
            tryResolve: container.tryResolve.bind(container),
            tryResolveAsync: container.tryResolveAsync.bind(container),
            resolveNamed: container.resolveNamed.bind(container),
            resolveNamedAsync: container.resolveNamedAsync.bind(container),
            tryResolveNamed: container.tryResolveNamed.bind(container),
            tryResolveNamedAsync: container.tryResolveNamedAsync.bind(container),
            resolveWithDependencies: container.resolveWithDependencies.bind(container),
            resolveWithDependenciesAsync: container.resolveWithDependenciesAsync.bind(container),
            resolveWith: container.resolveWith.bind(container),
            createChild: container.createChild.bind(container),
            dispose: container.dispose.bind(container),
            disposeAsync: container.disposeAsync.bind(container)
        }
    }

    public copy(builder: IContainerBuilder): void {
        (<{_registrations: IRegistrationBase[]}>(<{}>builder))
        ._registrations
        .forEach((item) => {
            const clone = item.clone()
            const index = this._registrations
            .findIndex((registration) => registration.service === item.service)

            if (index < 0) {
                this._registrations.push(clone)
            } else {
                this._registrations[index] = clone
            }
        })
    }
}

function setDefaults(registration: IRegistrationBase) {

    registration.scope = defaults.scope
    registration.owner = defaults.owner
}
