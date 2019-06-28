export type ScopeType = 1 | 2 | 3

/**
 * Represents resolution life-cycle type definition
 * @public
 */
export const scope = Object.freeze({
    /**
     * Transient life-cycle, one instance per resolution
     */
    none: 1 as ScopeType,

    /**
     * Container life-cycle, one instance per resoluton per container instance
     */
    container: 2 as ScopeType,

    /**
     * Hierarchy life-cycle, same instance per all resolutions
     */
    hierarchy: 3 as ScopeType
})
