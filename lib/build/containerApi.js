/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Api {
    constructor(_container) {
        this._container = _container;
        this._cache = {
            use: false,
            name: undefined
        };
        this._dependencies = [];
        this._attempt = false;
        this._args = [];
    }
    get serviceValue() {
        return this._service;
    }
    get nameValue() {
        return this._name;
    }
    get cacheValue() {
        return this._cache;
    }
    get dependenciesValue() {
        return this._dependencies;
    }
    get isDependenciesResolvable() {
        return this._dependencies && this._dependencies.length > 0;
    }
    get attemptValue() {
        return this._attempt;
    }
    get throwResolveError() {
        return !this.attemptValue;
    }
    get argsValue() {
        return this._args;
    }
    service(value) {
        utils_1.checkNullArgument(value, 'value');
        this._service = value;
        return {
            args: this.args.bind(this),
            attempt: this.attempt.bind(this),
            name: this.name.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this),
            execAsync: this.execAsync.bind(this)
        };
    }
    args(...args) {
        this._args = args;
        return {
            attempt: this.attempt.bind(this),
            name: this.name.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this),
            execAsync: this.execAsync.bind(this)
        };
    }
    attempt() {
        this._attempt = true;
        return {
            name: this.name.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this),
            execAsync: this.execAsync.bind(this)
        };
    }
    name(value) {
        utils_1.checkNullArgument(value, 'value');
        this._name = value;
        return {
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this),
            execAsync: this.execAsync.bind(this)
        };
    }
    dependencies(data) {
        utils_1.checkNullArgument(data, 'data');
        var item = data;
        if (Array.isArray(item)) {
            this._dependencies.push.apply(this._dependencies, item);
        }
        else {
            this._dependencies.push(item);
        }
        return {
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this),
            execAsync: this.execAsync.bind(this)
        };
    }
    cache(name) {
        this._cache.use = true;
        this._cache.name = name;
        return {
            exec: this.exec.bind(this),
            execAsync: this.execAsync.bind(this)
        };
    }
    exec() {
        return this._container.execute(this);
    }
    execAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                resolve(this.exec());
            });
        });
    }
}
exports.Api = Api;
//# sourceMappingURL=containerApi.js.map