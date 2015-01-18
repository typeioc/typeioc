/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import DefaultsModule = require('./defaults');
import OwnerModule = require('./owner');
import ScopeModule = require('./scope');


export var Defaults = DefaultsModule.Defaults;
export var Owner = OwnerModule.Owner;
export var Scope = ScopeModule.Scope;
