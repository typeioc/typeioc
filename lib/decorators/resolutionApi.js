/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResolutionApi {
    constructor(_resolve) {
        this._resolve = _resolve;
        this._args = [];
        this._cache = {
            use: false,
            name: undefined
        };
    }
    get service() {
        return this._service;
    }
    set service(value) {
        this._service = value;
    }
    get args() {
        return this._args;
    }
    get name() {
        return this._name;
    }
    get attempt() {
        return this._attempt;
    }
    get cache() {
        return this._cache;
    }
    by(service) {
        this._service = service;
        return {
            args: this.argsAction.bind(this),
            attempt: this.attemptAction.bind(this),
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    }
    argsAction(...value) {
        this._args = value;
        return {
            attempt: this.attemptAction.bind(this),
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    }
    attemptAction() {
        this._attempt = true;
        return {
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    }
    nameAction(value) {
        this._name = value;
        return {
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    }
    cacheAction(name) {
        this._cache = {
            use: true,
            name: name
        };
        return {
            resolve: this.resolveAction.bind(this)
        };
    }
    resolveAction() {
        return this._resolve(this);
    }
}
exports.ResolutionApi = ResolutionApi;
//# sourceMappingURL=resolutionApi.js.map