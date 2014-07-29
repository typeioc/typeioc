

var libFolder = process.env.TYPEIOC_COV ? 'lib-cov' : 'lib';

var builder =  require(['.', libFolder, 'scaffold'].join('/'));
var types = require(['.', libFolder, 'types/index'].join('/'));
var exceptions = require(['.', libFolder, 'exceptions/index'].join('/'));


module.exports = {
    Types: types,
    Exceptions : exceptions,

    createBuilder: function() {
        return new builder.Scaffold().createBuilder();
    }
};

