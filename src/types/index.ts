/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import { default as OwnerType } from './owner';
import { default as ScopeType } from './scope';

export var Owner = OwnerType;
export var Scope = ScopeType;

export var Defaults : Typeioc.Types.IDefaults = {
    get Scope() : Typeioc.Types.Scope {
        return Typeioc.Types.Scope.None;
    },

    get Owner() : Typeioc.Types.Owner {
        return Typeioc.Types.Owner.Container;
    }
};