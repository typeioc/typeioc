/**
 * @public
 */
export const enum Owner {
    Container = 1,
    Externals = 2
}

/**
 * @public
 */
export type OwnerType = {
    readonly container: number
    readonly externals: number
}

/**
 * @public
 */
export const owner: OwnerType  = {
    get container() {
        return Owner.Container
    },

    get externals() {
        return Owner.Externals
    }
}
