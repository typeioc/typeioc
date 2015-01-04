
'use strict';

var path = require('path');
var fs = require('fs');

var nodeunit;

try  {
    nodeunit = require('nodeunit');
    var reporter = nodeunit.reporters.default;
} catch (e) {
    console.log("Cannot find nodeunit module.");
    process.exit(1);
}

var mainPath = path.join(__dirname, 'js');
var internalSubPAth = 'internal';
var apiSubPAth = 'api';

process.chdir(mainPath);

var internalFiles = fs.readdirSync(path.join(mainPath, internalSubPAth))
.map(function(file) {
    return path.join(internalSubPAth, file);
});

var apiFiles = fs.readdirSync(path.join(mainPath, apiSubPAth))
.map(function(file) {
    return path.join(apiSubPAth, file);
});

reporter.run(internalFiles.concat(apiFiles), null, function(data) {

    if(data &&
        data instanceof Error) {
        process.exit(1);
    }
});