/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
///<reference path="../../d.ts/typeioc.d.ts" />
///<reference path="../../d.ts/typeioc.internal.d.ts" />
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
        var register = (api) => (target) => {
            if (!utils_1.Reflection.isPrototype(target)) {
                let error = new exceptions_1.DecoratorError("Decorator target not supported, not a prototype");
                error.data = { target: target };
                throw error;
            }
            let registration = this._builder
                .register(api.service)
                .asType(target);
            var initializer = api.initializedBy;
            if (initializer)
                registration.initializeBy(initializer);
            var disposer = api.disposedBy;
            if (disposer)
                registration.dispose(disposer);
            var name = api.name;
            if (name)
                registration.named(name);
            var scope = api.scope || types_1.Defaults.Scope;
            registration.within(scope);
            var owner = api.owner || types_1.Defaults.Owner;
            registration.ownedBy(owner);
            return target;
        };
        var api = this._decoratorRegistrationApiService.createRegistration(register);
        return api.provide(service);
    }
    by(service) {
        var resolve = (api) => (target, key, index) => {
            if (!api.service) {
                var dependencies = utils_1.Reflection.getMetadata(Reflect, target);
                api.service = dependencies[index];
            }
            var bucket = this._internalStorage.register(target, () => ({}));
            bucket[index] = {
                service: api.service,
                args: api.args,
                attempt: api.attempt,
                name: api.name,
                cache: api.cache
            };
        };
        var api = this._decoratorRegistrationApiService.createResolution(resolve);
        return api.by(service);
    }
    resolveValue(value) {
        return (target, key, index) => {
            var bucket = this._internalStorage.register(target, () => ({}));
            bucket[index] = {
                value: value
            };
        };
    }
}
exports.Decorator = Decorator;
//# sourceMappingURL=decorator.js.map