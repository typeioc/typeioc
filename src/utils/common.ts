import { ArgumentError, ApplicationError } from '../exceptions/index.js'
import { IDynamicDependency } from '../registration'

// TODO: remove this when API extractor Omit exception is fixed
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export const factoryValueKey = 'factoryValue'

export function checkNullArgument(
    value: {} | null | undefined, argument: string,  message?: string) {

    if (value == null || value === undefined) {
        throw new ArgumentError(argument, { message })
    }
}

export function checkDependency(dependency: IDynamicDependency) : void {

    if ((dependency.factory && dependency.factoryType) ||
        (dependency.factory && factoryValueKey in dependency) ||
        (dependency.factoryType && factoryValueKey in dependency)) {
        throw new ApplicationError({ message: 'Unknown registration type' })
    }
}

export function uuid() {

    const replace = (c: {}) => {
        // tslint:disable-next-line: one-variable-per-declaration
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, replace)
}
