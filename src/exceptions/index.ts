/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

 'use strict';

import ApplicationErrorModule = require('./applicationError');
import ArgumentErrorModule = require('./argumentError');
import ArgumentNullErrorModule = require('./argumentNullError');
import ResolutionErrorModule = require('./resolutionError');
import ConfigRegistrationErrorModule = require('./configRegistrationError');
import StorageKeyNotFoundErrorModule = require('./storageKeyNotFoundError');
import NullReferenceErrorModule = require('./nullReferenceError');
import ProxyErrorModule = require('./proxyError');
import DecoratorErrorModule = require('./decoratorError');

export var ApplicationError = ApplicationErrorModule.ApplicationError;
export var ArgumentError = ArgumentErrorModule.ArgumentError;
export var ArgumentNullError = ArgumentNullErrorModule.ArgumentNullError;
export var ResolutionError = ResolutionErrorModule.ResolutionError;
export var StorageKeyNotFoundError = StorageKeyNotFoundErrorModule.StorageKeyNotFoundError;
export var ConfigurationError = ConfigRegistrationErrorModule.ConfigurationError;
export var NullReferenceError = NullReferenceErrorModule.NullReferenceError;
export var ProxyError = ProxyErrorModule.ProxyError;
export var DecoratorError = DecoratorErrorModule.DecoratorError;

