import { CallInfo } from '../../common'
import { IndexedCollection } from '../../types'

/**
 * @public
 */
export interface ICallInfo {
    source: {}
    name: string
    args: any[]
    invoke: (args?: any | any[]) => any | void
    type: CallInfo
    get?: () => any
    set?: ({}) => void
    next?: (result?: any) => any
    result?: any
}

/**
 * @public
 */
export interface ISubstituteInfo {
    method? : string
    type? : CallInfo
    wrapper: (callInfo: ICallInfo) => any | void
}

export interface ISubstitute extends ISubstituteInfo {
    method?: string
    type: CallInfo
    next?: ISubstitute
}

export interface IList<T> {
    head: T | null
    tail: T | null
}

export const enum PropertyType {
    Method = 1,                 // method
    Getter = 2,                 // get
    Setter = 3,                 // set
    FullProperty = 4,           // get and set
    Field = 5                   // field
}

export interface IStrategyInfo {
    type: PropertyType
    descriptor?: PropertyDescriptor
    substitute?: ISubstitute
    name: string
    source: IndexedCollection<Function | {}>
    destination: IndexedCollection<Function | {}>
    contextName?: string
}

export interface IStorage {
    add(value: ISubstitute): void
    getSubstitutes(name: string, types: CallInfo[]): ISubstitute | null
}
