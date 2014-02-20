'use strict';

export class BaseError implements Error {
    public name: string;
    public message: string;
    public data : any;
    public innerError : BaseError = null;

    constructor(message?: string) {
        this.message = message;
    }
}



