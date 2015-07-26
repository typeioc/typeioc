/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/


var Builder =  require('./lib/scaffold');
var Decorators = require('./lib/decorators/index');
var types = require('./lib/types/index');
var exceptions = require('./lib/exceptions/index');

var scaffold = new Builder.Scaffold();
Decorators.getDecorator = function(){ return scaffold.createDecorator(); };

module.exports = {
    Types: types,
    Exceptions : exceptions,
    Decorators : Decorators.Instance,

    createBuilder: function() {
        return scaffold.createBuilder();
    }
};

