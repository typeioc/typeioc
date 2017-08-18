/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class RegistrationApi {
    constructor(_register) {
        this._register = _register;
        this.initializeBy = this.initializeBy.bind(this);
        this.dispose = this.dispose.bind(this);
        this.named = this.named.bind(this);
        this.within = this.within.bind(this);
        this.transient = this.transient.bind(this);
        this.singleton = this.singleton.bind(this);
        this.instancePerContainer = this.instancePerContainer.bind(this);
        this.ownedBy = this.ownedBy.bind(this);
        this.ownedInternally = this.ownedInternally.bind(this);
        this.ownedExternally = this.ownedExternally.bind(this);
        this.register = this.register.bind(this);
    }
    get service() {
        return this._service;
    }
    get name() {
        return this._name;
    }
    get scope() {
        return this._scope;
    }
    get owner() {
        return this._owner;
    }
    get initializedBy() {
        return this._initializedBy;
    }
    get disposedBy() {
        return this._disposedBy;
    }
    provide(service) {
        utils_1.checkNullArgument(service, 'service');
        this._service = service;
        return {
            initializeBy: this.initializeBy,
            dispose: this.dispose,
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        };
    }
    initializeBy(action) {
        utils_1.checkNullArgument(action, 'action');
        this._initializedBy = action;
        return {
            dispose: this.dispose,
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        };
    }
    dispose(action) {
        utils_1.checkNullArgument(action, 'action');
        this._disposedBy = action;
        return {
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        };
    }
    named(name) {
        utils_1.checkNullArgument(name, 'name');
        this._name = name;
        return {
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        };
    }
    within(scope) {
        utils_1.checkNullArgument(scope, 'scope');
        this._scope = scope;
        return {
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        };
    }
    transient() {
        return this.within(1 /* None */);
    }
    singleton() {
        return this.within(3 /* Hierarchy */);
    }
    instancePerContainer() {
        return this.within(2 /* Container */);
    }
    ownedBy(owner) {
        utils_1.checkNullArgument(owner, 'owner');
        this._owner = owner;
        return {
            register: this.register
        };
    }
    ownedInternally() {
        return this.ownedBy(1 /* Container */);
    }
    ownedExternally() {
        return this.ownedBy(2 /* Externals */);
    }
    register() {
        return this._register(this);
    }
}
exports.RegistrationApi = RegistrationApi;
//# sourceMappingURL=registrationApi.js.map