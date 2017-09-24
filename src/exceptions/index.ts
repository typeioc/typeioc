/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.2
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

 'use strict';

import { default as AppError} from './applicationError';
import { default as ArgError } from './argumentError';
import { default as ArgNulError} from './argumentNullError';
import { default as ResolError } from './resolutionError';
import { default as StoreKeyNotFoundError } from './storageKeyNotFoundError';
import { default as PrxError } from './proxyError';
import { default as DecorError } from './decoratorError';

export var ApplicationError = AppError;
export var ArgumentError = ArgError;
export var ArgumentNullError = ArgNulError;
export var ResolutionError = ResolError;
export var StorageKeyNotFoundError = StoreKeyNotFoundError;
export var ProxyError = PrxError;
export var DecoratorError = DecorError;

