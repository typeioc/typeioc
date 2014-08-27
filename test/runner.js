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

fs.readdir(path.join(mainPath, internalSubPAth), function(error, files) {

    var result = files.map(function(file) {
        return path.join(internalSubPAth, file);
    });

    fs.readdir(path.join(mainPath, apiSubPAth), function(error, files) {
        var paths = files.map(function(file) {
            return path.join(apiSubPAth, file);
        });

        result.push.apply(result, paths);

        reporter.run(result, null, function(data) {

            if(data &&
               data instanceof Error) {
                process.exit(1);
            }
        });

    });
});