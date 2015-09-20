/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

'use strict';

export class BaseError implements Error {

    private nativeError;

    public get stack() {
        return this.nativeError.stack;
    }

    public get message() : string {
        return this.nativeError.message;
    }

    public set message(value: string) {
        this.nativeError.message = value;
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



