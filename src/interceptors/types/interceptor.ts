import { ISubstituteInfo } from '.'

/**
 * Represents fluent cascading API interface for substitutes specification
 * @public
 */
export interface IWithSubstituteResult {
    /**
     * Adds a new substitute to the substitute chain
     * @param substitute - an instance of {@link ISubstituteInfo} interface
     * @returns self representative to be used for future substitutes
     * specification
     */
    withSubstitute: (substitute: ISubstituteInfo) => IWithSubstituteResult

    /**
     * Creates intercepted instance representative
     * @param subject - an instance of a type
     * @returns - a decorated instance
     */
    interceptInstance: <R extends Object>(subject: R) => R

    /**
     * Creates intercepted prototype representative
     * @param subject - function/class prototype (prototypical/constructible function)
     * @returns - a decorated prototype.
     */
    interceptPrototype: <R extends Function>(subject: R) => R

    /**
     * Create a subject with members substituted by given parameters.
     * For the instances of an object - interceptInstance method is used,
     * for prototypical/constructible functions - interceptPrototype is used
     *
     * @param subject - prototypical/constructable function or an instance of an abject
     * @returns - decorated subject
     */
    intercept: <R extends (Function | Object)>(subject: R) => R
}

/**
 * Represents interceptor specification interface
 *
 * @remarks
 * Interceptors are used to intercept calls to methods/getters/setters/fields of provided component
 *
 * @public
 */
export interface IInterceptor {
    /**
     * Creates intercepted prototype representative
     * @param subject - function/class prototype (prototypical/constructible function)
     * @param substitutes - instance(s) of {@link ISubstituteInfo} interface.
     * If substitutes are applied to the same member, they are chained
     * @returns - a decorated prototype. If no substitutes provided
     * returns same input subject parameter
     */
    interceptPrototype<R extends Function>(
        subject: R, substitutes?: ISubstituteInfo | ISubstituteInfo[]): R

    /**
     * Creates intercepted instance representative
     * @param subject - an instance of a type
     * @param substitutes - instance(s) of {@link ISubstituteInfo} interface.
     * If substitutes are applied to the same member, they are chained
     * @returns - a decorated instance. If no substitutes provided
     * returns same input subject parameter
     */
    interceptInstance<R extends Object>(
        subject: R, substitutes?: ISubstituteInfo | ISubstituteInfo[]): R

    /**
     * Create a subject with members substituted by given parameters.
     * For the instances of an object - interceptInstance method is used,
     * for prototypical/constructible functions - interceptPrototype is used
     *
     * @param subject - prototypical/constructable function or an instance of an abject
     * @param substitutes - instance(s) of {@link ISubstituteInfo} interface
     * @returns - decorated subject. If no substitutes provided returns same input
     * subject parameter
     */
    intercept<R extends Function | Object>(
        subject: R, substitutes?: ISubstituteInfo | ISubstituteInfo[]) : R

    /**
     * Represents an entry point in fluent cascading API substitutes specification
     * @param substitute - an instance of {@link ISubstituteInfo} interface
     * @returns - an instance of {@link IWithSubstituteResult} interface
     */
    withSubstitute(substitute: ISubstituteInfo): IWithSubstituteResult
}
