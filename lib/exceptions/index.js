/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.8
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
'use strict';
var ApplicationErrorModule = require('./applicationError');
var ArgumentErrorModule = require('./argumentError');
var ArgumentNullErrorModule = require('./argumentNullError');
var ResolutionErrorModule = require('./resolutionError');
var ConfigRegistrationErrorModule = require('./configRegistrationError');
var StorageKeyNotFoundErrorModule = require('./storageKeyNotFoundError');
var NullReferenceErrorModule = require('./nullReferenceError');
var ProxyErrorModule = require('./proxyError');
exports.ApplicationError = ApplicationErrorModule.ApplicationError;
exports.ArgumentError = ArgumentErrorModule.ArgumentError;
exports.ArgumentNullError = ArgumentNullErrorModule.ArgumentNullError;
exports.ResolutionError = ResolutionErrorModule.ResolutionError;
exports.StorageKeyNotFoundError = StorageKeyNotFoundErrorModule.StorageKeyNotFoundError;
exports.ConfigurationError = ConfigRegistrationErrorModule.ConfigurationError;
exports.NullReferenceError = NullReferenceErrorModule.NullReferenceError;
exports.ProxyError = ProxyErrorModule.ProxyError;
//# sourceMappingURL=index.js.map