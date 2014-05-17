/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';


export class ContainerBuilder implements Typeioc.IContainerBuilder{
    private registrations : Typeioc.Internal.IRegistrationBase[];
    private moduleRegistrations : Typeioc.Internal.IModuleRegistration[];

    public DefaultScope = Typeioc.Types.Scope.None;
    public DefaultOwner = Typeioc.Types.Owner.Container;

    constructor(private _configRegistrationService : Typeioc.Internal.IConfigRegistrationService,
                private _registrationBaseService : Typeioc.Internal.IRegistrationBaseService,
                private _instanceRegistrationService : Typeioc.Internal.IInstanceRegistrationService,
                private _moduleRegistrationService : Typeioc.Internal.IModuleRegistrationService,
                private _containerService : Typeioc.Internal.IContainerService) {
        this.registrations = [];
        this.moduleRegistrations = [];
    }

    public register<R>(service : any) : Typeioc.IRegistration<R> {

        var regoBase = this._registrationBaseService.create(service);
        var registration = this._instanceRegistrationService.create<R>(regoBase);

        regoBase.scope = this.DefaultScope;
        regoBase.owner = this.DefaultOwner;

        this.registrations.push(regoBase);

        return registration;
    }

    public registerModule(serviceModule : Object) : Typeioc.IAsModuleRegistration {

        var regoBase = this._registrationBaseService.create(serviceModule);
        var moduleRegistration = this._moduleRegistrationService.create(regoBase);

        regoBase.scope = this.DefaultScope;
        regoBase.owner = this.DefaultOwner;

        this.moduleRegistrations.push(moduleRegistration);

        return moduleRegistration.getAsModuleRegistration();
    }

    public registerConfig(config : Typeioc.IConfig) : void {
        var configRego = this._configRegistrationService.create(config);
        configRego.scope = this.DefaultScope;
        configRego.owner = this.DefaultOwner;

        var regoes = configRego.registrations;

        this.registrations.push.apply(this.registrations, regoes);
    }

    public build() : Typeioc.IContainer {

        var regoes = this.registrations.slice(0);

        this.moduleRegistrations.forEach(item => {

            regoes.push.apply(regoes, item.registrations);
        });

        var container = this._containerService.create();
        container.import(regoes);

        return {
            resolve : container.resolve.bind(container),
            tryResolve: container.tryResolve.bind(container),
            resolveNamed : container.resolveNamed.bind(container),
            tryResolveNamed : container.tryResolveNamed.bind(container),
            createChild : container.createChild.bind(container),
            dispose: container.dispose.bind(container)
        };
    }
}