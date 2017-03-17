/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
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
const exceptions_1 = require("../exceptions");
class Container {
    constructor(_container) {
        this._container = _container;
    }
    get cache() {
        return this._container.cache;
    }
    createChild() {
        return new Container(this._container.createChild());
    }
    dispose() {
        this._container.dispose();
    }
    disposeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this._container.dispose();
                resolve();
            });
        });
    }
    resolve(service, ...args) {
        utils_1.checkNullArgument(service, 'service');
        args = utils_1.concat([service], args);
        return this._container.resolve.apply(this._container, args);
    }
    resolveAsync(service, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                resolve(this.resolve(service, ...args));
            });
        });
    }
    tryResolve(service, ...args) {
        utils_1.checkNullArgument(service, 'service');
        args = utils_1.concat([service], args);
        return this._container.tryResolve.apply(this._container, args);
    }
    tryResolveAsync(service, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                resolve(this.tryResolve(service, ...args));
            });
        });
    }
    resolveNamed(service, name, ...args) {
        utils_1.checkNullArgument(service, 'service');
        args = utils_1.concat([service, name], args);
        return this._container.resolveNamed.apply(this._container, args);
    }
    resolveNamedAsync(service, name, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                resolve(this.resolveNamed(service, name, ...args));
            });
        });
    }
    tryResolveNamed(service, name, ...args) {
        utils_1.checkNullArgument(service, 'service');
        args = utils_1.concat([service, name], args);
        return this._container.tryResolveNamed.apply(this._container, args);
    }
    tryResolveNamedAsync(service, name, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                resolve(this.tryResolveNamed(service, name, ...args));
            });
        });
    }
    resolveWithDependencies(service, dependencies) {
        utils_1.checkNullArgument(service, 'service');
        if (!dependencies || dependencies.length <= 0)
            throw new exceptions_1.ResolutionError('No dependencies provided');
        return this._container.resolveWithDependencies(service, dependencies);
    }
    resolveWithDependenciesAsync(service, dependencies) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                resolve(this.resolveWithDependencies(service, dependencies));
            });
        });
    }
    resolveWith(service) {
        utils_1.checkNullArgument(service, 'service');
        return this._container.resolveWith(service);
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map