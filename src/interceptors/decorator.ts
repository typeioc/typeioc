import { ImmutableArray, isArray } from '../utils'
import { callInfo } from '../common'
import {
    IDecorator, IStrategy, IStrategyInfo,
    PropertyType, ICallInfo, ISubstitute,
    ICallChainParams
} from './types'

export class Decorator implements IDecorator {

    public wrap(strategyInfo:  IStrategyInfo): void {
        strategyInfo = this.copyStrategy(strategyInfo)

        const strategyStore = strategyInfo.substitute ?
            this.defineWrapStrategies() :
            this.defineNonWrapStrategies()

        const strategy = strategyStore[strategyInfo.type]
        strategy(strategyInfo)
    }

    private defineNonWrapStrategies(): IStrategy {
        const result = <IStrategy>{}

        result[PropertyType.Method] = (strategyInfo: IStrategyInfo) => {

            const value = strategyInfo.source[strategyInfo.name] as Function

            strategyInfo.destination[strategyInfo.name] = function () {
                const args = Array.prototype.slice.call(arguments, 0)
                return value.apply(this, args)
            }
        }

        result[PropertyType.Getter] = (strategyInfo : IStrategyInfo) => {

            const { configurable, enumerable } = strategyInfo.descriptor ?
                strategyInfo.descriptor : { configurable: true, enumerable: true }

            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                get: this.defineGetter(strategyInfo),
                configurable,
                enumerable
            })
        }

        result[PropertyType.Setter] = (strategyInfo : IStrategyInfo) => {

            const { configurable, enumerable } = strategyInfo.descriptor ?
                strategyInfo.descriptor : { configurable: true, enumerable: true }

            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                set: this.defineSetter(strategyInfo),
                configurable,
                enumerable
            })
        }

        result[PropertyType.FullProperty] = (strategyInfo : IStrategyInfo) => {

            const { configurable, enumerable } = strategyInfo.descriptor ?
                strategyInfo.descriptor : { configurable: true, enumerable: true }

            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                get: this.defineGetter(strategyInfo),
                set: this.defineSetter(strategyInfo),
                configurable,
                enumerable
            })
        }

        result[PropertyType.Field] = result[PropertyType.FullProperty]

        return result
    }

    private defineWrapStrategies(): IStrategy {
        const result = <IStrategy>{}
        const createCallChainFromList = this.createCallChainFromList.bind(this)
        const defineWrapGetter = this.defineWrapGetter.bind(this)
        const defineWrapSetter = this.defineWrapSetter.bind(this)
        const defineGetter = this.defineGetter.bind(this)
        const defineSetter = this.defineSetter.bind(this)

        result[PropertyType.Method] = (strategyInfo: IStrategyInfo) => {

            const value = strategyInfo.source[strategyInfo.name] as Function

            strategyInfo.destination[strategyInfo.name] = function () {

                const args  = Array.prototype.slice.call(arguments, 0)

                const delegate = (args?: any[]) => {
                    if (!args || !isArray(args)) {
                        args = [args]
                    }

                    return value.apply(this, args)
                }

                return createCallChainFromList({
                    delegate,
                    strategyInfo,
                    args: ImmutableArray.createImmutable(args),
                    wrapperContext: this,
                })
            }
        }

        result[PropertyType.Getter] = (strategyInfo: IStrategyInfo) => {

            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                get: defineWrapGetter(strategyInfo),
                configurable: true,
                enumerable: strategyInfo.descriptor ? strategyInfo.descriptor.enumerable : true
            })
        }

        result[PropertyType.Setter] = (strategyInfo: IStrategyInfo) => {

            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                set: defineWrapSetter(strategyInfo),
                configurable: true,
                enumerable: strategyInfo.descriptor ? strategyInfo.descriptor.enumerable : true
            })
        }

        result[PropertyType.FullProperty] = (strategyInfo: IStrategyInfo) => {

            const getter = strategyInfo.substitute!.type === callInfo.any ||
                        strategyInfo.substitute!.type === callInfo.getterSetter ||
                        strategyInfo.substitute!.type === callInfo.getter  ||
                        strategyInfo.substitute!.type === callInfo.field ?
                        defineWrapGetter(strategyInfo) : defineGetter(strategyInfo)

            const setter = strategyInfo.substitute!.type === callInfo.any ||
                        strategyInfo.substitute!.type === callInfo.getterSetter ||
                        strategyInfo.substitute!.type === callInfo.setter ||
                        strategyInfo.substitute!.type === callInfo.field ?
                        defineWrapSetter(strategyInfo) : defineSetter(strategyInfo)

            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                get: getter,
                set: setter,
                configurable: true,
                enumerable: strategyInfo.descriptor ? strategyInfo.descriptor.enumerable : true
            })
        }

        result[PropertyType.Field] = result[PropertyType.FullProperty]

        return result
    }

    private defineWrapSetter(strategyInfo : IStrategyInfo) {

        const createCallChainFromList = this.createCallChainFromList.bind(this)
        const defineSetter = this.defineSetter.bind(this)

        return function (value: {}) {

            const delegate = defineSetter(strategyInfo).bind(this)

            return createCallChainFromList({
                delegate,
                strategyInfo,
                args: ImmutableArray.createImmutable([value]),
                wrapperContext: this,
                callType: callInfo.setter,
            })
        }
    }

    private defineWrapGetter(strategyInfo : IStrategyInfo) {

        const createCallChainFromList = this.createCallChainFromList.bind(this)
        const defineGetter = this.defineGetter.bind(this)

        return function () {

            const delegate = defineGetter(strategyInfo).bind(this)

            return createCallChainFromList({
                delegate,
                strategyInfo,
                args: ImmutableArray.createImmutable([]),
                wrapperContext: this,
                callType : callInfo.getter,
            })
        }
    }

    private defineGetter(strategyInfo : IStrategyInfo) {
        return function () {
            return strategyInfo.contextName ? this[strategyInfo.contextName][strategyInfo.name]
               : strategyInfo.source[strategyInfo.name]
        }
    }

    private defineSetter(strategyInfo : IStrategyInfo) {
        return function (argValue: any) {
            if (strategyInfo.contextName) {
                this[strategyInfo.contextName][strategyInfo.name] = argValue
            } else {
                strategyInfo.source[strategyInfo.name] = argValue
            }
        }
    }

    private createCallChainFromList(info : ICallChainParams) {

        const mainCallInfo = this.createCallInfo(info)
        this.createCallAction(mainCallInfo, info, info.strategyInfo.substitute!.next)

        return info.strategyInfo.substitute!.wrapper.call(info.wrapperContext, mainCallInfo)
    }

    private createCallAction(
        callInfo: ICallInfo, info: ICallChainParams, substitute?: ISubstitute) {
        if (!substitute) {
            return
        }

        const createCallAction = this.createCallAction.bind(this)
        const childCallInfo = this.createCallInfo(info)
        const wrapper = substitute.wrapper.bind(info.wrapperContext)

        callInfo.next = result => {
            childCallInfo.result = result
            createCallAction(childCallInfo, info, substitute.next)
            return wrapper(childCallInfo) as {}
        }
    }

    private createCallInfo(info: ICallChainParams): ICallInfo {

        const getter = <() => {}>info.delegate
        const setter = <(value: any) => void>info.delegate

        return {
            source: info.strategyInfo.source,
            name : info.strategyInfo.name,
            args : info.args.value,
            type : info.callType || info.strategyInfo.substitute!.type,
            invoke: info.delegate,
            get: info.callType === callInfo.getter ?  getter : undefined,
            set: info.callType === callInfo.setter ?  setter : undefined
        }
    }

    private copyStrategy(strategyInfo: IStrategyInfo): IStrategyInfo {
        return {
            type: strategyInfo.type,
            descriptor: strategyInfo.descriptor,
            substitute: strategyInfo.substitute,
            name: strategyInfo.name,
            source: strategyInfo.source,
            destination: strategyInfo.destination,
            contextName: strategyInfo.contextName
        }
    }
}
