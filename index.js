/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2014 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/


var builder =  require('./lib/scaffold');
var types = require('./lib/types/index');
var exceptions = require('./lib/exceptions/index');


module.exports = {
    Types: types,
    Exceptions : exceptions,

    createBuilder: function() {
        return new builder.Scaffold().createBuilder();
    }
};

