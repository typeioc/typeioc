/**
 * @public
 */
export const enum Scope  {
    None = 1,
    Container = 2,
    Hierarchy = 3
}

/**
 * @public
 */
export type ScopeType = {
    readonly none: number
    readonly container: number,
    readonly hierarchy: number
}

/**
 * @public
 */
export const scope: ScopeType = {
    get none() {
        return Scope.None
    },

    get container() {
        return Scope.Container
    },

    get hierarchy() {
        return Scope.Hierarchy
    }
}
