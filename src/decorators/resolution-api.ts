import { IDecoratorResolutionApi } from './types'
import {
    IDecoratorResolution,
    WithArgs,
    WithAttempt,
    WithName,
    WithResolver
} from './types/resolution'
import { IApiCache } from '../build'

export class ResolutionApi implements IDecoratorResolutionApi {
    private _name?: string
    private _attempt: boolean = false
    private _service?: {}
    private _args: {}[] = []

    private _cache: IApiCache = {
        use: false,
        name: undefined
    }

    public get service(): {} | undefined {
        return this._service
    }

    public set service(value: {} | undefined) {
        this._service = value
    }

    public get args(): {}[] {
        return this._args
    }

    public get name(): string | undefined {
        return this._name
    }

    public get attempt(): boolean {
        return this._attempt
    }

    public get cache(): IApiCache {
        return this._cache
    }

    constructor(private _resolve: (api: IDecoratorResolutionApi) => ParameterDecorator) { }

    public by(service?: {}): IDecoratorResolution {

        this._service = service

        return {
            args: this.argsAction.bind(this),
            attempt : this.attemptAction.bind(this),
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        }
    }

    private argsAction(...value: {}[]): WithArgs {
        this._args = value

        return {
            attempt : this.attemptAction.bind(this),
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        }
    }

    private attemptAction(): WithAttempt {

        this._attempt = true

        return {
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        }
    }

    private nameAction(value : string): WithName {

        this._name = value

        return {
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        }
    }

    private cacheAction(name? : string): WithResolver {
        this._cache = {
            use: true,
            name
        }

        return {
            resolve : this.resolveAction.bind(this)
        }
    }

    private resolveAction() : ParameterDecorator {
        return this._resolve(this)
    }
}
