import { IDynamicDependency } from '../registration'
import { IResolveWith, IContainer, IInternalContainer } from './types'
import { checkNullArgument, checkDependency } from '../utils/index.js'
import { ResolutionError } from '../exceptions/index.js'
import { InternalContainer } from './internal-container'
import { ICache } from '../types'

export const container = (_container: IInternalContainer) => {
    const result: IContainer = {
        get cache(): ICache {
            return _container.cache
        },

        createChild(): IContainer {
            return container(_container.createChild() as InternalContainer)
        },

        dispose(): void {
            _container.dispose()
        },

        async disposeAsync(): Promise<void> {
            return new Promise<void>(resolve => {
                _container.dispose()
                resolve()
            })
        },

        resolve<R>(service: {}, ...args: {}[]): R {

            checkNullArgument(service, 'service')

            if (!args.length) {
                return _container.resolve(service)
            }

            return _container.resolve(service, ...args)
        },

        async resolveAsync<R>(service: {}, ...args: {}[]): Promise<R> {

            return new Promise<R>(resolve => {
                resolve(result.resolve<R>(service, ...args))
            })
        },

        tryResolve<R>(service: {}, ...args: {}[]): R | undefined {

            checkNullArgument(service, 'service')

            if (!args.length) {
                return _container.tryResolve(service) || undefined
            }

            return _container.tryResolve(service, ...args)
        },

        async tryResolveAsync<R>(service: {}, ...args: {}[]): Promise<R | undefined> {
            return new Promise<R>(resolve => {
                resolve(result.tryResolve<R>(service, ...args) || undefined)
            })
        },

        resolveNamed<R>(service: {}, name: string, ...args: {}[]): R | never {

            checkNullArgument(service, 'service')
            checkNullArgument(name, 'name')

            if (!args.length) {
                return _container.resolveNamed(service, name)
            }

            return _container.resolveNamed(service, name, ...args)
        },

        async resolveNamedAsync<R>(service: {}, name: string, ...args: {}[])
            : Promise<R> {

            return new Promise<R>(resolve => {
                resolve(result.resolveNamed<R>(service, name, ...args))
            })
        },

        tryResolveNamed<R>(service: {}, name: string, ...args: {}[]): R | undefined {

            checkNullArgument(service, 'service')
            checkNullArgument(name, 'name')

            const result = args.length <= 0 ?
                _container.tryResolveNamed<R>(service, name) :
                _container.tryResolveNamed<R>(service, name, ...args)

            return result || undefined
        },

        async tryResolveNamedAsync<R>(service: {}, name: string, ...args: {}[]):
            Promise<R | undefined> {

            return new Promise<R>(resolve => {
                resolve(result.tryResolveNamed<R>(service, name, ...args) || undefined)
            })
        },

        resolveWithDependencies<R>(service: {}, dependencies: IDynamicDependency[]): R | never {

            checkNullArgument(service, 'service')

            if (!dependencies || dependencies.length <= 0) {
                throw new ResolutionError({ message: 'No dependencies provided' })
            }

            dependencies.forEach(checkDependency)

            return _container.resolveWithDependencies<R>(service, dependencies)
        },

        async resolveWithDependenciesAsync<R>(
            service: {}, dependencies: IDynamicDependency[]): Promise<R> {

            return new Promise<R>(resolve => {
                resolve(result.resolveWithDependencies<R>(service, dependencies))
            })
        },

        resolveWith<R>(service: {}): IResolveWith<R> {

            checkNullArgument(service, 'service')

            return _container.resolveWith<R>(service)
        }
    }

    return result
}
