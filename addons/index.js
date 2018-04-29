
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