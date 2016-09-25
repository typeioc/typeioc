/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../../d.ts/typeioc.internal.d.ts" />
'use strict';
class Registration {
    constructor(_base) {
        this._base = _base;
    }
    as(factory) {
        this._base.factory = factory;
        return {
            initializeBy: this.initializeBy.bind(this),
            dispose: this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this)
        };
    }
    asType(type, ...params) {
        this._base.factoryType = type;
        this._base.params = params;
        return {
            initializeBy: this.initializeBy.bind(this),
            dispose: this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this)
        };
    }
    named(value) {
        this._base.name = value;
        return {
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this)
        };
    }
    within(scope) {
        this._base.scope = scope;
        return {
            ownedBy: this.ownedBy.bind(this)
        };
    }
    ownedBy(owner) {
        this._base.owner = owner;
    }
    initializeBy(action) {
        this._base.initializer = action;
        return {
            dispose: this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this)
        };
    }
    dispose(action) {
        this._base.disposer = action;
        return {
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this)
        };
    }
}
exports.Registration = Registration;
//# sourceMappingURL=registration.js.map