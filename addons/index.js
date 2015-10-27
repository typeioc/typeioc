/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () - 
 * --------------------------------------------------------------------------------------------------*/


'use strict';

var AddonsBuilder = require('../lib/scaffoldAddons');

var scaffold = new AddonsBuilder.ScaffoldAddons();

module.exports = {

    Interceptors : {
        create : function() {
            return scaffold.interceptor();
        },

        CallInfoType : {
            Method: 1,
            Getter: 2,
            Setter: 3,
            GetterSetter: 4,
            Any: 5,
            Field: 6
        }
    }
};