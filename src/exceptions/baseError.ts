/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

export default class BaseError implements Error {

    private nativeError;

    public get stack() {
        return this.nativeError.stack;
    }

    public get message() : string {
        return this.nativeError.message;
    }

    public get name() : string {
        return this.nativeError.name;
    }

    public set name(value: string) {
        this.nativeError.name = value;
    }

    public data : any;
    public innerError : BaseError = null;

    constructor(message?: string) {
        this.nativeError = new Error(message);

        this.name = "BaseError";
    }
}



