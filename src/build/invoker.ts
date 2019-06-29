import { IContainer, IInvoker } from './types'
import { registrationType, IRegistrationBase } from '../registration'
import {
    IDecoratorResolutionParamsData,
    decoratorResolutionParameter
} from '../decorators'
import { ResolutionError } from '../exceptions'
import { construct, getMetadata, Invocable } from '../utils'

export class Invoker implements IInvoker {

    constructor(
        private _container: IContainer,
        private _resolutionDetails?: IDecoratorResolutionParamsData) { }

    public invoke<R>(registration: IRegistrationBase,
        throwIfNotFound: boolean,
        args?: {}[]) : R | (() => R) {

        if (registration.isLazy) {
            return () => this.invokeInternal(registration, throwIfNotFound, args)
        }

        return this.invokeInternal(registration, throwIfNotFound, args)
    }

    private invokeInternal<R>(registration: IRegistrationBase,
        throwIfNotFound : boolean,
        args?: {}[]): R {

        switch (registration.registrationType) {
            case registrationType.factoryType:
                return this.instantiate(
                    registration.factoryType!, registration, throwIfNotFound, args
                ) as R

            case registrationType.factoryValue:
                return registration.factoryValue! as R

            case registrationType.factory:
            default:
                return this.createByFactory(registration, args)
        }
    }

    private createByFactory<R>(
        registration: IRegistrationBase, args: {}[] = []) : R {

        return registration.factory!(registration.container!, ...args) as R
    }

    private instantiate(
        type: {},
        registration: IRegistrationBase,
        throwIfNotFound: boolean,
        args?: {}[]) {

        if (args && args.length &&
            registration.params.length) {
            throw new ResolutionError({
                message: [
                    'Could not instantiate type.',
                    'Arguments and dependencies are not allowed for simultaneous resolution.',
                    'Pick dependencies or arguments'
                ].join(' '),
                data: type
            })
        }

        if (args && args.length) {
            return construct(type as Invocable, args)
        }

        if (registration.params.length) {
            return this.instantiateByParams(type, registration, throwIfNotFound)
        }

        const dependencies = this.getDependencies(type)

        return this.instantiateByDependencies(type, dependencies)
    }

    private instantiateByParams(
        type: {}, registration: IRegistrationBase, throwIfNotFound: boolean) {

        const params = registration.params
        .map(item => {
            const dependency =
                registration.dependenciesValue.filter(d => d.service === item)[0]

            const dependencyName = dependency ? dependency.named : null

            if (throwIfNotFound) {
                return !!dependencyName ?
                    this._container.resolveNamed(item, dependencyName) :
                    this._container.resolve(item)
            }

            return !!dependencyName ?
                this._container.tryResolveNamed(item, dependencyName) :
                this._container.tryResolve(item)
        })
        .filter(item => item) as {}[]

        return construct(type as Invocable, params)
    }

    private instantiateByDependencies(type: {}, dependencies: {}[]) {
        const params = dependencies
        .map((dependency, index) => {

            const depParams =
                this._resolutionDetails ? this._resolutionDetails.tryGet(type) : null
            const depParamsValue = depParams ? depParams[index] : null

            if (!depParamsValue) {
                return this._container.resolve(dependency)
            }

            if (depParamsValue.type === decoratorResolutionParameter.value) {
                return depParamsValue.value
            }

            if (depParamsValue.type === decoratorResolutionParameter.functionValue) {
                return (depParamsValue.value! as Function)()
            }

            const resolutionItem = depParamsValue.service || dependency
            const resolution = this._container.resolveWith(resolutionItem)

            if (depParamsValue.args && depParamsValue.args.length) {
                resolution.args(...depParamsValue.args)
            }

            if (depParamsValue.name) {
                resolution.name(depParamsValue.name)
            }

            if (depParamsValue.attempt === true) {
                resolution.attempt()
            }

            if (depParamsValue.cache && depParamsValue.cache.use) {
                resolution.cache(depParamsValue.cache.name)
            }

            return resolution.exec()
        })

        return construct(type as Invocable, params)
    }

    private getDependencies(type: {}) {
        return getMetadata(type) as {}[]
    }
}
