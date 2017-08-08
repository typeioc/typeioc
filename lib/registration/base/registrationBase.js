/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../../exceptions");
class RegistrationBase {
    constructor(_service) {
        this._service = _service;
        this._factory = null;
        this._name = null;
        this._initializer = null;
        this._disposer = null;
        this._instance = null;
        this._factoryType = null;
        this._dependenciesValue = [];
        this.args = [];
        this.params = [];
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get service() {
        return this._service;
    }
    get scope() {
        return this._scope;
    }
    set scope(value) {
        this._scope = value;
    }
    get owner() {
        return this._owner;
    }
    set owner(value) {
        this._owner = value;
    }
    get initializer() {
        return this._initializer;
    }
    set initializer(value) {
        this._initializer = value;
    }
    get disposer() {
        return this._disposer;
    }
    set disposer(value) {
        this._disposer = value;
    }
    get args() {
        return this._args;
    }
    set args(value) {
        this._args = value;
    }
    get params() {
        return this._params;
    }
    set params(value) {
        this._params = value;
    }
    get container() {
        return this._container;
    }
    set container(value) {
        this._container = value;
    }
    get instance() {
        return this._instance;
    }
    set instance(value) {
        this._instance = value;
    }
    get factoryType() {
        return this._factoryType;
    }
    set factoryType(value) {
        this._factoryType = value;
    }
    get registrationType() {
        if (!!this._factoryType && !this._factory) {
            return 1 /* factoryType */;
        }
        if (!this._factoryType && !!this._factory) {
            return 0 /* factory */;
        }
        throw new exceptions_1.ApplicationError('Unknow registration type');
    }
    get dependenciesValue() {
        return this._dependenciesValue;
    }
    set dependenciesValue(value) {
        this._dependenciesValue = value || [];
    }
    cloneFor(container) {
        var result = new RegistrationBase(this._service);
        result.factory = this._factory;
        result.container = container;
        result.owner = this._owner;
        result.scope = this._scope;
        result.initializer = this._initializer;
        result.factoryType = this._factoryType;
        result.params = this._params;
        return result;
    }
    get factory() {
        return this._factory;
    }
    set factory(value) {
        this._factory = value;
    }
}
exports.RegistrationBase = RegistrationBase;
//# sourceMappingURL=registrationBase.js.map