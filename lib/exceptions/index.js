/*---------------------------------------------------------------------------------------------------
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.5
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE,
 * --------------------------------------------------------------------------------------------------*/

'use strict';
var ApplicationErrorModule = require('./applicationError');
var ArgumentNullErrorModule = require('./argumentNullError');
var ResolutionErrorModule = require('./resolutionError');
var ConfigRegistrationErrorModule = require('./configRegistrationError');
var StorageKeyNotFoundErrorModule = require('./storageKeyNotFoundError');
exports.ApplicationError = ApplicationErrorModule.ApplicationError;
exports.ArgumentNullError = ArgumentNullErrorModule.ArgumentNullError;
exports.ResolutionError = ResolutionErrorModule.ResolutionError;
exports.StorageKeyNotFoundError = StorageKeyNotFoundErrorModule.StorageKeyNotFoundError;
exports.ConfigurationError = ConfigRegistrationErrorModule.ConfigRegistrationError;
//# sourceMappingURL=index.js.map