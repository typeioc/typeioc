import { ISubstituteInfo } from '.'

/**
 * @public
 */
export interface IWithSubstituteResult {
    withSubstitute: (substitute: ISubstituteInfo) => IWithSubstituteResult
    interceptInstance: <R extends Object>(subject: R) => R
    interceptPrototype: <R extends Function>(subject: R) => R
    intercept: <R extends (Function | Object)>(subject: R) => R
}

/**
 * @public
 */
export interface IInterceptor {
    interceptPrototype<R extends Function>(
        subject: R, substitutes?: ISubstituteInfo | ISubstituteInfo[]): R
    interceptInstance<R extends Object>(
        subject: R, substitutes?: ISubstituteInfo | ISubstituteInfo[]): R
    intercept<R extends Function | Object>(
        subject: R, substitutes?: ISubstituteInfo | ISubstituteInfo[]) : R
    withSubstitute: (substitute: ISubstituteInfo) => IWithSubstituteResult
}
