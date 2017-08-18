/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const types_1 = require("../types");
class Decorator {
    constructor(_builderService, _internalContainerService, _decoratorRegistrationApiService, _internalStorageService) {
        this._builderService = _builderService;
        this._internalContainerService = _internalContainerService;
        this._decoratorRegistrationApiService = _decoratorRegistrationApiService;
        this._internalStorageService = _internalStorageService;
        this._internalStorage = this._internalStorageService.create();
        _internalContainerService.resolutionDetails = this._internalStorage;
        this._builder = _builderService.create(_internalContainerService);
    }
    build() {
        return this._builder.build();
    }
    provide(service) {
        const register = (api) => (target) => {
            if (!utils_1.Reflection.isPrototype(target)) {
                const error = new exceptions_1.DecoratorError("Decorator target not supported, not a prototype");
                error.data = { target };
                throw error;
            }
            const registration = this._builder
                .register(api.service)
                .asType(target);
            const initializer = api.initializedBy;
            if (initializer)
                registration.initializeBy(initializer);
            const disposer = api.disposedBy;
            if (disposer)
                registration.dispose(disposer);
            const name = api.name;
            if (name)
                registration.named(name);
            const scope = api.scope || types_1.Defaults.Scope;
            registration.within(scope);
            const owner = api.owner || types_1.Defaults.Owner;
            registration.ownedBy(owner);
            return target;
        };
        const api = this._decoratorRegistrationApiService.createRegistration(register);
        return api.provide(service);
    }
    by(service) {
        const resolve = (api) => (target, key, index) => {
            if (!api.service) {
                var dependencies = utils_1.Reflection.getMetadata(Reflect, target);
                api.service = dependencies[index];
            }
            const bucket = this._internalStorage.register(target, () => ({}));
            bucket[index] = {
                service: api.service,
                args: api.args,
                attempt: api.attempt,
                name: api.name,
                cache: api.cache
            };
        };
        const api = this._decoratorRegistrationApiService.createResolution(resolve);
        return api.by(service);
    }
    resolveValue(value) {
        return (target, key, index) => {
            const bucket = this._internalStorage.register(target, () => ({}));
            bucket[index] = {
                value
            };
        };
    }
}
exports.Decorator = Decorator;
//# sourceMappingURL=decorator.js.map