import { IRegistration, IRegistrationBase } from '../registration'
import {
    IRegistrationBaseService,
    IInstanceRegistrationService,
    IInternalContainerService,
    IContainerService,
    IContainer,
    IContainerBuilder
} from './types'
import { defaults } from '../common/index.js'
import { checkNullArgument }  from '../utils/index.js'

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

        return container
    }

    public copy(builder: IContainerBuilder): void {
        checkNullArgument(builder, 'builder');

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
