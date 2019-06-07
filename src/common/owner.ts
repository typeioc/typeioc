/**
 * Represents resolution instance ownership type
 * @public
 */
export const enum Owner {
    /**
     * Container ownership
     */
    Container = 1,

    /**
     * External ownership
     */
    Externals = 2
}

/**
 * Represents resolution instance ownership type metadata
 * @public
 */
export type OwnerType = {
    /**
     * Container ownership
     */
    readonly container: number

    /**
     * External ownership
     */
    readonly externals: number
}

/**
 * Represent runtime / JavaScript resolution instance ownership type
 * @public
 */
export const owner: OwnerType  = {
    /**
     * Container ownership
     */
    get container() {
        return Owner.Container
    },

    /**
     * External ownership
     */
    get externals() {
        return Owner.Externals
    }
}
