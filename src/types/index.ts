/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import OwnerModule = require('./owner');
import ScopeModule = require('./scope');

export var Owner = OwnerModule.Owner;
export var Scope = ScopeModule.Scope;

export var Defaults : Typeioc.Types.IDefaults = {
    get Scope() : Typeioc.Types.Scope {
        return Typeioc.Types.Scope.None;
    },

    get Owner() : Typeioc.Types.Owner {
        return Typeioc.Types.Owner.Container;
    }
};