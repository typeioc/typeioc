import { IImmutableArray } from '../../utils'
import { CallInfo } from '../../common'
import { Index } from '../../types'
import { IStrategyInfo } from './common'

export interface IDecorator {
    wrap(strategyInfo: IStrategyInfo): void
}

export interface ICallChainParams {
    args: IImmutableArray<any>
    delegate: (args?: any[]) => void
    wrapperContext: {}
    callType?: CallInfo
    strategyInfo: IStrategyInfo
}

export interface IStrategy extends Index<(item: IStrategyInfo) => void> {}
