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
            initializeBy: this.initializeBy.bind(this),
            dispose: this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    }
    initializeBy(action) {
        utils_1.checkNullArgument(action, 'action');
        this._initializedBy = action;
        return {
            dispose: this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    }
    dispose(action) {
        utils_1.checkNullArgument(action, 'action');
        this._disposedBy = action;
        return {
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    }
    named(name) {
        utils_1.checkNullArgument(name, 'name');
        this._name = name;
        return {
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    }
    within(scope) {
        utils_1.checkNullArgument(scope, 'scope');
        this._scope = scope;
        return {
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    }
    ownedBy(owner) {
        utils_1.checkNullArgument(owner, 'owner');
        this._owner = owner;
        return {
            register: this.register.bind(this)
        };
    }
    register() {
        return this._register(this);
    }
}
exports.RegistrationApi = RegistrationApi;
//# sourceMappingURL=registrationApi.js.map