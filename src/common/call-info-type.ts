export type CallInfoType = 1 | 2 | 3 | 4 | 5 | 6

/**
 * Represent original substituted subject member type
 * @public
 */
export const callInfo = Object.freeze({
    /**
     * Indicates method member type substitution
     */
    method: 1 as CallInfoType,

    /**
     * Indicates getter member type substitution
     */
    getter: 2 as CallInfoType,

    /**
     * Indicates setter member type substitution
     */
    setter: 3 as CallInfoType,

    /**
     * Indicates substitution for both getter and setter member types
     */
    getterSetter: 4 as CallInfoType,

    /**
     * Indicates substitution of any member type
     */
    any: 5 as CallInfoType,

    /**
     * Indicates field substitution
     */
    field: 6 as CallInfoType
})
