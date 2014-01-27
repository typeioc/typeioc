var fs = require('fs');
var exec = require('gulp-exec');
var gutil = require('gulp-util');
var map = require('map-stream');
var q = require('q');
var path = require('path');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-typescript';

function parseOptions(options) {
    var args = [];
    Object.keys(options).forEach(function (key) {
        var value = options[key];
        if (!value) {
            return;
        }
        if (key === '@') {
            args.push(key + value);
            return;
        }
        var dashes = '-';
        if (key.length !== 1) {
            dashes += '-';
        }
        args.push(dashes + key);
        if (typeof value !== 'boolean') {
            args.push(value);
        }
    });
    return args.join(' ');
}

function gulpTypeScript(options) {

    var params;
    var isVerbose = options.hasOwnProperty('verbose');

    switch (typeof options) {
        case 'object':
            params = parseOptions(options);
            break;
        case 'string':
        case 'undefined':
            break;
        default:
            throw new PluginError(PLUGIN_NAME, 'Options must be an object or a string!');
    }

    return map(function(file, cb) {

        var outputFile = new gutil.File(file);

        if(isVerbose) {
            gutil.log(gutil.colors.blue(['Compiling file :', outputFile.path].join(' ')));
        }

        var stream = exec('"tsc" <%= options.options %> <%= file.path %>', {
            options: params || ''
        }).on('error', function(error) {
             cb(file, error);
        });

        var filePath = outputFile.path;
        var isDefinitionFile = filePath.search(/\.d.ts$/) >= 0;

        outputFile.path = filePath.replace(/\.ts$/, '.js');

        var fileExists;
        var markForDeletion;
        fs.exists(outputFile.path, function(exists) {
            fileExists = exists;
            markForDeletion = !exists && !isDefinitionFile;

            stream.write(file);
            stream.end();
        });

        stream.once('end', function() {
            if(!fileExists) return;

            q.nfcall(fs.readFile, outputFile.path).then(function(outputSource) {
                outputFile.contents = outputSource;

                if (markForDeletion) {
                    cleanupOutput().then(onSuccess, onFail);
                } else {
                    onSuccess();
                }
            }, onFail);
        });

        function cleanupOutput() {
            var cleaning = new q.defer();

            fs.unlink(outputFile.path, function(err) {
                if (err) {
                    cleaning.reject(err);
                } else {
                    cleaning.resolve();
                }
            });
            return cleaning.promise;
        }

        function onSuccess() {

            if(isVerbose) {
                gutil.log(gutil.colors.blue('done'));
            }

            cb(null, outputFile);
        }

        function onFail(err) {
            cb(new PluginError(PLUGIN_NAME, err.message), file);
        }

    });
}

module.exports = gulpTypeScript;