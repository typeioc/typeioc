/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () - 
 * --------------------------------------------------------------------------------------------------*/


var Builder =  require('./lib/scaffold');
var types = require('./lib/types/index');
var exceptions = require('./lib/exceptions/index');

var scaffold = new Builder.Scaffold();
var decorator;


module.exports = {
    Types: types,
    Exceptions : exceptions,
    Decorators : scaffold.createDecorator(),

    createBuilder: function() {
        return scaffold.createBuilder();
    },

    getDecorator: function() {

        if(!decorator)
            decorator = scaffold.createDecorator();

        return  decorator;
    }
};

