/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class Registration {
    constructor(_base) {
        this._base = _base;
        this.initializeBy = this.initializeBy.bind(this),
            this.dispose = this.dispose.bind(this),
            this.named = this.named.bind(this),
            this.name = this.name.bind(this),
            this.within = this.within.bind(this),
            this.ownedBy = this.ownedBy.bind(this),
            this.ownedInternally = this.ownedInternally.bind(this),
            this.ownedExternally = this.ownedExternally.bind(this),
            this.transient = this.transient.bind(this),
            this.singleton = this.singleton.bind(this),
            this.instancePerContainer = this.instancePerContainer.bind(this);
    }
    as(factory) {
        this._base.factory = factory;
        return {
            initializeBy: this.initializeBy,
            dispose: this.dispose,
            named: this.named,
            within: this.within,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        };
    }
    asType(type, ...params) {
        this._base.factoryType = type;
        this._base.params = params;
        return {
            initializeBy: this.initializeBy,
            dispose: this.dispose,
            named: this.named,
            within: this.within,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        };
    }
    asSelf(...params) {
        return this.asType(this._base.service, ...params);
    }
    asValue(value) {
        this._base.factoryValue = value;
        this._base.owner = 2 /* Externals */;
        this._base.scope = 1 /* None */;
        return {
            named: this.name
        };
    }
    name(value) {
        this.named(value);
    }
    named(value) {
        this._base.name = value;
        return {
            within: this.within,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        };
    }
    within(scope) {
        this._base.scope = scope;
        return {
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally
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
        this._base.owner = owner;
    }
    ownedInternally() {
        this.ownedBy(1 /* Container */);
    }
    ownedExternally() {
        this.ownedBy(2 /* Externals */);
    }
    initializeBy(action) {
        this._base.initializer = action;
        return {
            dispose: this.dispose,
            named: this.named,
            within: this.within,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        };
    }
    dispose(action) {
        this._base.disposer = action;
        return {
            named: this.named,
            within: this.within,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        };
    }
}
exports.Registration = Registration;
//# sourceMappingURL=registration.js.map