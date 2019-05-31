/**
 * @public
 */
export const enum CallInfo {
    Method = 1,
    Getter = 2,
    Setter = 3,
    GetterSetter = 4,
    Any = 5,
    Field = 6
}

/**
 * @public
 */
export type CallInfoType = {
    readonly method: number,
    readonly getter: number,
    readonly setter: number,
    readonly getterSetter: number,
    readonly any: number,
    readonly field: number
}

/**
 * @public
 */
export const callInfo: CallInfoType = {
    get method() { return CallInfo.Method },
    get getter() { return CallInfo.Getter },
    get setter() { return CallInfo.Setter },
    get getterSetter() { return CallInfo.GetterSetter },
    get any() { return CallInfo.Any },
    get field() { return CallInfo.Field }
}
