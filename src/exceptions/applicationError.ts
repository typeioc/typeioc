/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import BaseError from './baseError';

export default class ApplicationError extends BaseError {

    constructor (message?: string) {
        super(message);

        this.name = "ApplicationError";
    }
}
