'use strict';

const scaffold = require('./../../scaffold');
const testData = scaffold.TestModule;
let builder;

exports.api = {
    level17: {
        setUp: function (callback) {
            builder = scaffold.createBuilder();
            callback();
        },


        
    }
}