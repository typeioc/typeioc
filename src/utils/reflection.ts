import { } from 'reflect-metadata'
import { SetPrototypeOf } from '../types'

export function getMetadata(type: {}) {
    return Reflect.getMetadata('design:paramtypes', type) || []
}

export type Invocable = { new (...args: {}[]): {}}

export function construct(constructor: Invocable, args: IArguments | {}[]) {
    return args && args.length ? new constructor(...args) : new constructor()
}

export function isArray(value: {}): boolean {
    return Array.isArray(value)
}

export function isFunction(f : {}) : boolean {
    return f instanceof Function
}

export function isPrototype(f: {}) : boolean {
    return toString.call(f) === '[object Function]'
}

export function isObject(o: {}) : boolean {
    return o === Object(o)
}

export function getPropertyDescriptor(object: {}, key: string) {
    let descriptor: PropertyDescriptor | undefined

    do {
        descriptor = Object.getOwnPropertyDescriptor(object, key)
    } while (!descriptor && (object = Object.getPrototypeOf(object)))

    return descriptor
}

export function getAllPropertyNames(obj: {}) {
    const props: string[] = []

    do {
        Object.getOwnPropertyNames(obj).forEach((prop) => {
            if (props.indexOf(prop) === -1) {
                props.push(prop)
            }
        })
    } while (obj = Object.getPrototypeOf(obj))

    return props
}

export function setPrototypeOf(instance: {}, prototype: {}) {
    if ((Object as SetPrototypeOf).setPrototypeOf) {
        (Object as SetPrototypeOf).setPrototypeOf(instance, prototype)
    }
}
