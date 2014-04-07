var path = require('path');
var fs = require('fs');


try  {
    var reporter = require('nodeunit').reporters.default;
} catch (e) {
    console.log("Cannot find nodeunit module.");
    process.exit();
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

        reporter.run(result);
    });
});



/*
reporter.run([
    'utils.js',
    'owner.js',
    ]);

/*
process.chdir(path.join(__dirname, 'js', 'api'));



reporter.run([
    'level1.js',
    'level2.js',
    'level3.js',
    'level4.js',
    'level5.js',
    'level6.js',
    'level7.js',
    'level8.js']);


/*


process.chdir(path.join(__dirname, 'js'));



reporter.run([
    'internal/utils.js',
    'internal/owner.js',
    'api/level1.js',
    'api/level2.js',
    'api/level3.js',
    'api/level4.js',
    'api/level5.js',
    'api/level6.js',
    'api/level7.js',
    'api/level8.js']);

*/