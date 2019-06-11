import { IDynamicDependency } from '../registration'
import { IResolveWith, IContainer, IInternalContainer } from './types'
import { checkNullArgument, checkDependency } from '../utils'
import { ResolutionError } from '../exceptions'
import { InternalContainer } from './internal-container'
import { ICache } from '../types'

export class Container implements IContainer {

    constructor(private _container: IInternalContainer) { }

    public get cache(): ICache {
        return this._container.cache
    }

    public createChild(): IContainer {
        return new Container(this._container.createChild() as InternalContainer)
    }

    public dispose(): void {
        this._container.dispose()
    }

    public async disposeAsync(): Promise<void> {
        return new Promise<void>(resolve => {
            this._container.dispose()
            resolve()
        })
    }

    public resolve<R>(service: {}, ...args: {}[]): R {

        checkNullArgument(service, 'service')

        if (!args.length) {
            return this._container.resolve(service)
        }

        return this._container.resolve(service, ...args)
    }

    public async resolveAsync<R>(service: {}, ...args: {}[]): Promise<R> {

        return new Promise<R>(resolve => {
            resolve(this.resolve<R>(service, ...args))
        })
    }

    public tryResolve<R>(service: {}, ...args: {}[]): R | undefined {

        checkNullArgument(service, 'service')

        if (!args.length) {
            return this._container.tryResolve(service) || undefined
        }

        return this._container.tryResolve(service, ...args)
    }

    public async tryResolveAsync<R>(service: {}, ...args: {}[]): Promise<R | undefined> {
        return new Promise<R>(resolve => {
            resolve(this.tryResolve<R>(service, ...args) || undefined)
        })
    }

    public resolveNamed<R>(service: {}, name: string, ...args: {}[]): R | never {

        checkNullArgument(service, 'service')
        checkNullArgument(name, 'name')

        if (!args.length) {
            return this._container.resolveNamed(service, name)
        }

        return this._container.resolveNamed(service, name, ...args)
    }

    public async resolveNamedAsync<R>(service: {}, name: string, ...args: {}[])
        : Promise<R> {

        return new Promise<R>(resolve => {
            resolve(this.resolveNamed<R>(service, name, ...args))
        })
    }

    public tryResolveNamed<R>(service: {}, name: string, ...args: {}[]): R | undefined {

        checkNullArgument(service, 'service')
        checkNullArgument(name, 'name')

        const result = args.length <= 0 ?
            this._container.tryResolveNamed<R>(service, name) :
            this._container.tryResolveNamed<R>(service, name, ...args)

        return result || undefined
    }

    public async tryResolveNamedAsync<R>(service: {}, name: string, ...args: {}[]):
        Promise<R | undefined> {

        return new Promise<R>(resolve => {
            resolve(this.tryResolveNamed<R>(service, name, ...args) || undefined)
        })
    }

    public resolveWithDependencies<R>(service: {}, dependencies: IDynamicDependency[]): R | never {

        checkNullArgument(service, 'service')

        if (!dependencies || dependencies.length <= 0) {
            throw new ResolutionError({ message: 'No dependencies provided' })
        }

        dependencies.forEach(checkDependency)

        return this._container.resolveWithDependencies<R>(service, dependencies)
    }

    public async resolveWithDependenciesAsync<R>(
        service: {}, dependencies: IDynamicDependency[]): Promise<R> {

        return new Promise<R>(resolve => {
            resolve(this.resolveWithDependencies<R>(service, dependencies))
        })
    }

    public resolveWith<R>(service: {}): IResolveWith<R> {

        checkNullArgument(service, 'service')

        return this._container.resolveWith<R>(service)
    }
}
