/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.4
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import ArgumentError from './argumentError';

export default class ArgumentNullError extends ArgumentError {

    constructor (argumentName, message?: string) {
        super(argumentName, message);

        this.name = "ArgumentNullError";
    }
}


