import {
    IApiCache,
    IResolveWith,
    WithArgs, WithAttempt, WithName, WithCache,
    IContainerApi, ImportApi
} from './types'
import { IDynamicDependency } from '../registration'
import { checkDependency, checkNullArgument, isArray } from '../utils'
import { ApplicationError } from '../exceptions'

export class Api<T> implements IContainerApi<T> {
    private _service: {} | undefined = undefined
    private _name?: string

    private _cache: IApiCache = {
        use: false,
        name: undefined
    }

    private _dependencies: IDynamicDependency[] = []
    private _attempt = false
    private _args: {}[] = []

    public get serviceValue(): {} {
        if (this._service === null || this._service === undefined) {
            throw new ApplicationError({ message: 'Service was not initialized' })
        }

        return this._service!
    }

    public get nameValue(): string | undefined {
        return this._name
    }

    public get cacheValue(): IApiCache  {
        return this._cache
    }

    public get dependenciesValue(): IDynamicDependency[]  {
        return this._dependencies
    }

    public get isDependenciesResolvable(): boolean {
        return this._dependencies && this._dependencies.length > 0
    }

    public get attemptValue(): boolean  {
        return this._attempt
    }

    public get throwResolveError(): boolean {
        return !this.attemptValue
    }

    public get argsValue(): {}[] {
        return this._args
    }

    constructor(private _container: ImportApi<T>) {
        this.args = this.args.bind(this)
        this.attempt = this.attempt.bind(this)
        this.name = this.name.bind(this)
        this.dependencies = this.dependencies.bind(this)
        this.cache = this.cache.bind(this)
        this.exec = this.exec.bind(this)
        this.execAsync = this.execAsync.bind(this)
    }

    public service(value: {}): IResolveWith<T> {

        checkNullArgument(value, 'value')

        this._service = value

        return {
            args: this.args,
            attempt: this.attempt,
            name: this.name,
            dependencies: this.dependencies,
            cache: this.cache,
            exec: this.exec,
            execAsync: this.execAsync
        }
    }

    private args(...args: {}[]): WithArgs<T> {
        this._args = args

        return {
            attempt: this.attempt,
            name: this.name,
            dependencies: this.dependencies,
            cache: this.cache,
            exec: this.exec,
            execAsync: this.execAsync
        }
    }

    private attempt(): WithAttempt<T> {
        this._attempt = true

        return {
            name: this.name,
            dependencies: this.dependencies,
            cache: this.cache,
            exec: this.exec,
            execAsync: this.execAsync
        }
    }

    private name(value: string): WithName<T> {

        checkNullArgument(value, 'value')

        this._name = value

        return {
            dependencies: this.dependencies,
            cache: this.cache,
            exec: this.exec,
            execAsync: this.execAsync
        }
    }

    private dependencies(data: IDynamicDependency | IDynamicDependency[]): WithName<T> {
        checkNullArgument(data, 'data')

        if (isArray(data)) {
            (<IDynamicDependency[]>data)
            .forEach(item => checkDependency(item))

            this._dependencies.push.apply(this._dependencies, data as IDynamicDependency[])
        } else {
            checkDependency(data as IDynamicDependency)
            this._dependencies.push(data as IDynamicDependency)
        }

        return {
            dependencies: this.dependencies,
            cache: this.cache,
            exec: this.exec,
            execAsync: this.execAsync
        }
    }

    private cache(name?: string): WithCache<T> {
        this._cache.use = true
        this._cache.name = name

        return {
            exec: this.exec,
            execAsync: this.execAsync
        }
    }

    private exec(): T {
        return this._container.execute(this)
    }

    private async execAsync(): Promise<T> {
        return new Promise<T>(resolve => { resolve(this.exec()) })
    }
}
