/// <reference path="../d.ts/typeioc.d.ts" />


'use strict';

export class ErrorClass implements Error {
    public name: string;
    public message: string;
    public data : any;
    public innerError : ErrorClass = null;

    constructor(message?: string) {
        this.message = message;
    }
}

export class ApplicationError extends ErrorClass {
    public name = "ApplicationError";

    constructor (public message?: string) {
        super(message);
    }
}


export class ArgumentNullError extends ApplicationError {
    public name = "ArgumentNullError";
    constructor (public message?: string) {
        super(message);
    }
}

export class ResolutionError extends ApplicationError {
    public name = "ResolutionError";
    constructor (public message?: string) {
        super(message);
    }
}

export class ConfigError extends ApplicationError {
    public name = "ConfigError";
    constructor (public message?: string) {
        super(message);
    }
}