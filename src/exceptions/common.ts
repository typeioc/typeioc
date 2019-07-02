export type SetPrototypeOf = {
    setPrototypeOf: Function
}

export function setPrototypeOf(instance: {}, prototype: {}) {
    if ((Object as SetPrototypeOf).setPrototypeOf) {
        (Object as SetPrototypeOf).setPrototypeOf(instance, prototype)
    }
}
