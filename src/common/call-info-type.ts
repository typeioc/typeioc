/**
 * Represent original substituted subject member type
 * @public
 */
export const enum CallInfo {
    /**
     * Indicates method member type substitution
     */
    Method = 1,

    /**
     * Indicates getter member type substitution
     */
    Getter = 2,

    /**
     * Indicates setter member type substitution
     */
    Setter = 3,

    /**
     * Indicates substitution for both getter and setter member types
     */
    GetterSetter = 4,

    /**
     * Indicates substitution of any member type
     */
    Any = 5,

    /**
     * Indicates field substitution
     */
    Field = 6
}

/**
 * Represent original substituted subject member type metadata
 * @public
 */
export type CallInfoType = {
    /**
     * Indicates method member type substitution
     */
    readonly method: number,

    /**
     * Indicates getter member type substitution
     */
    readonly getter: number,

    /**
     * Indicates setter member type substitution
     */
    readonly setter: number,

    /**
     * Indicates substitution for both getter and setter member types
     */
    readonly getterSetter: number,

    /**
     * Indicates substitution of any member type
     */
    readonly any: number,

    /**
     * Indicates field substitution
     */
    readonly field: number
}

/**
 * Represent runtime / JavaScript original substituted subject member type
 * @public
 */
export const callInfo: CallInfoType = {
    /**
     * Indicates method member type substitution
     */
    get method() { return CallInfo.Method },

    /**
     * Indicates getter member type substitution
     */
    get getter() { return CallInfo.Getter },

    /**
     * Indicates setter member type substitution
     */
    get setter() { return CallInfo.Setter },

    /**
     * Indicates substitution for both getter and setter member types
     */
    get getterSetter() { return CallInfo.GetterSetter },

    /**
     * Indicates substitution of any member type
     */
    get any() { return CallInfo.Any },

    /**
     * Indicates field substitution
     */
    get field() { return CallInfo.Field }
}
