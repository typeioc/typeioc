/**
 * Represents resolution life-cycle type definition
 * @public
 */
export const enum Scope  {
    /**
     * Transient life-cycle, one instance per resolution
     */
    None = 1,

    /**
     * Container life-cycle, one instance per resoluton per container instance
     */
    Container = 2,

    /**
     * Hierarchy life-cycle, same instance per all resolutions
     */
    Hierarchy = 3
}

/**
 * Represents resolution life-cycle type definition metadata
 * @public
 */
export type ScopeType = {
    /**
     * Transient life-cycle, one instance per resolution
     */
    readonly none: number

    /**
     * Container life-cycle, one instance per resoluton per container instance
     */
    readonly container: number,

    /**
     * Hierarchy life-cycle, same instance per all resolutions
     */
    readonly hierarchy: number
}

/**
 * Represent runtime / JavaScript resolution instance scope
 * @public
 */
export const scope: ScopeType = {
    /**
     * Transient life-cycle, one instance per resolution
     */
    get none() {
        return Scope.None
    },

    /**
     * Container life-cycle, one instance per resoluton per container instance
     */
    get container() {
        return Scope.Container
    },

    /**
     * Hierarchy life-cycle, same instance per all resolutions
     */
    get hierarchy() {
        return Scope.Hierarchy
    }
}
