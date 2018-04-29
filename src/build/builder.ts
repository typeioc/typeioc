'use strict';

import { Defaults } from '../types';
import { checkNullArgument }  from '../utils';
import Internal = Typeioc.Internal;


export class ContainerBuilder implements Typeioc.IContainerBuilder {
    private _registrations : Internal.IRegistrationBase[];
    
    constructor(private _registrationBaseService : Internal.IRegistrationBaseService,
                private _instanceRegistrationService : Internal.IInstanceRegistrationService,
                private _internalContainerService : Internal.IInternalContainerService,
                private _containerService : Internal.IContainerService) {

        this._registrations = [];
    }

    public register<R>(service : any) : Typeioc.IRegistration<R> {

        checkNullArgument(service, 'service');

        var regoBase = this._registrationBaseService.create(service);
        var registration = this._instanceRegistrationService.create<R>(regoBase);

        setDefaults(regoBase);

        this._registrations.push(regoBase);

        return registration;
    }

    public build() : Typeioc.IContainer {

        var regoes = this._registrations.slice(0);

        var internalContainer = this._internalContainerService.create();
        var container = this._containerService.create(internalContainer);
        internalContainer.add(regoes);

        return {
            cache : container.cache,
            resolve : container.resolve.bind(container),
            resolveAsync : container.resolveAsync.bind(container),
            tryResolve: container.tryResolve.bind(container),
            tryResolveAsync : container.tryResolveAsync.bind(container),
            resolveNamed : container.resolveNamed.bind(container),
            resolveNamedAsync : container.resolveNamedAsync.bind(container),
            tryResolveNamed : container.tryResolveNamed.bind(container),
            tryResolveNamedAsync : container.tryResolveNamedAsync.bind(container), 
            resolveWithDependencies : container.resolveWithDependencies.bind(container),
            resolveWithDependenciesAsync : container.resolveWithDependenciesAsync.bind(container),
            resolveWith : container.resolveWith.bind(container),
            createChild : container.createChild.bind(container),
            dispose: container.dispose.bind(container),
            disposeAsync : container.disposeAsync.bind(container)
        };
    }

    public copy(builder: Typeioc.IContainerBuilder): void {
        (<{_registrations: Array<Internal.IRegistrationBase>}>(<any>builder))
        ._registrations
        .forEach((item) => {
            const clone = item.clone();
            const index = this._registrations
            .findIndex((rego) => rego.service === item.service);

            if(index < 0) {
                this._registrations.push(clone);
            } else {
                this._registrations[index] = clone;
            }
        });
    }
}

function setDefaults(rego : Internal.IRegistrationBase) {

    rego.scope = Defaults.Scope;
    rego.owner = Defaults.Owner;
}