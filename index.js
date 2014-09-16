
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

