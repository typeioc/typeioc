/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2014 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

 'use strict';

 import ApplicationErrorModule = require('./applicationError');
 import ArgumentNullErrorModule = require('./argumentNullError');
 import ResolutionErrorModule = require('./resolutionError');
 import ConfigRegistrationErrorModule = require('./configRegistrationError');
 import StorageKeyNotFoundErrorModule = require('./storageKeyNotFoundError');


 export var ApplicationError = ApplicationErrorModule.ApplicationError;
 export var ArgumentNullError = ArgumentNullErrorModule.ArgumentNullError;
 export var ResolutionError = ResolutionErrorModule.ResolutionError;
 export var StorageKeyNotFoundError = StorageKeyNotFoundErrorModule.StorageKeyNotFoundError;
 export var ConfigurationError = ConfigRegistrationErrorModule.ConfigurationError;



