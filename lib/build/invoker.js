"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
class Invoker {
    constructor(_container, _resolutionDetails) {
        this._container = _container;
        this._resolutionDetails = _resolutionDetails;
    }
    invoke(registration, throwIfNotFound, args) {
        if (registration.factoryType) {
            return this.instantiate(registration.factoryType, registration, throwIfNotFound, args);
        }
        return this.createByFactory(registration, args);
    }
    createByFactory(registration, args = []) {
        args = [registration.container].concat(args.slice(0));
        return registration.factory.apply(registration.factory, args);
    }
    instantiate(type, registration, throwIfNotFound, args) {
        if (args && args.length &&
            registration.params.length) {
            const exception = new exceptions_1.ResolutionError('Could not instantiate type. Arguments and dependencies are not allowed for simultaneous resolution. Pick dependencies or arguments');
            exception.data = type;
            throw exception;
        }
        if (args && args.length) {
            return utils_1.Reflection.construct(type, args);
        }
        if (registration.params.length) {
            const params = registration.params
                .map(item => {
                const dependency = registration.dependenciesValue.filter(d => d.service === item)[0];
                const depName = dependency ? dependency.named : null;
                if (throwIfNotFound === true) {
                    return !!depName ? this._container.resolveNamed(item, depName) : this._container.resolve(item);
                }
                return !!depName ? this._container.tryResolveNamed(item, depName) : this._container.tryResolve(item);
            });
            return utils_1.Reflection.construct(type, params);
        }
        const dependencies = utils_1.Reflection.getMetadata(Reflect, type);
        const params = dependencies
            .map((dependency, index) => {
            let depParams = this._resolutionDetails ? this._resolutionDetails.tryGet(type) : null;
            let depParamsValue = depParams ? depParams[index] : null;
            if (!depParamsValue) {
                return this._container.resolve(dependency);
            }
            if (depParamsValue.value) {
                return depParamsValue.value;
            }
            let resolutionItem = depParamsValue.service || dependency;
            let resolution = this._container.resolveWith(resolutionItem);
            if (depParamsValue.args && depParamsValue.args.length)
                resolution.args(...depParamsValue.args);
            if (depParamsValue.name)
                resolution.name(depParamsValue.name);
            if (depParamsValue.attempt === true)
                resolution.attempt();
            if (depParamsValue.cache && depParamsValue.cache.use === true)
                resolution.cache(depParamsValue.cache.name);
            return resolution.exec();
        });
        return utils_1.Reflection.construct(type, params);
    }
}
exports.Invoker = Invoker;
//# sourceMappingURL=invoker.js.map