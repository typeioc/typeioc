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
 export var ConfigurationError = ConfigRegistrationErrorModule.ConfigRegistrationError;



