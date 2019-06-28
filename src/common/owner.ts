
export type OwnerType = 1 | 2

export const owner = Object.freeze({
    /**
     * Container ownership
     */
    container: 1 as OwnerType,

    /**
     * External ownership
     */
    externals: 2 as OwnerType
})
