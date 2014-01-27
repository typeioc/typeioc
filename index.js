
var builder = require('./lib/builder');
var types = require('./lib/types');
var exceptions = require('./lib/exceptions');


module.exports = {
    Types: types,
    Exceptions : exceptions,

    createBuilder: function() {
        return new builder.ContainerBuilder();
    }
};

