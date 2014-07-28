
'use strict';

var path = require('path');
var exec = require('gulp-exec');
var child_process = require('child_process');
var gulp = require('gulp');
var util = require('gulp-util');
var eventStream = require('event-stream');
var typescript = require('gulp-tsc');
var clean = require('gulp-clean');
var remove = require('rimraf');

var typescriptSources = '../src/**/*.ts';
var definitionSources = '../d.ts/typeioc*.d.ts';
var testSources = '../test/**/*.ts';
var libDestination = 'lib';
var libJSDestination = 'lib-js';
var libFiles = '../lib';
var libJSFiles = '../lib-js';
var typescriptCommand = 'tsc --target ES5  --module commonjs ';
var typescriptCommandSM = typescriptCommand + ' --sourcemap ';



gulp.task('tsc', ['tsc-lib', 'tsc-lib-js', 'tsc-tests'], function() {

});

gulp.task('tsc-lib-all', ['tsc-lib', 'tsc-lib-js'], function() {

});


gulp.task('tsc-lib-js', ['clean-lib-js'], function() {

    var stream = eventStream.concat(
        gulp.src(definitionSources, { read: false }),
        gulp.src(typescriptSources, { read: false })
    )
        .pipe(typescript({
            tscSearch : ['shell'],
            module: 'commonjs',
            target: 'ES5',
            sourcemap : false,
            pathFilter: function (path) { return path.replace(/^src/, libJSDestination) }
        }))
        .pipe(gulp.dest('../'));
});

gulp.task('tsc-lib', ['clean-lib'], function() {

    var stream = eventStream.concat(
        gulp.src(definitionSources, { read: false }),
        gulp.src(typescriptSources, { read: false })
    )
    .pipe(typescript({
        tscSearch : ['shell'],
        module: 'commonjs',
        target: 'ES5',
        sourcemap : true,
        pathFilter: function (path) { return path.replace(/^src/, libDestination) }
    }))
    .pipe(gulp.dest('../'));
});

gulp.task('clean-lib', function(cb) {

    remove(libFiles, cb);

});

gulp.task('clean-lib-js', function(cb) {

    remove(libJSFiles, cb);
});

gulp.task('tsc-tests', function() {
    gulp.src(testSources, { read: false })
        .pipe(exec(typescriptCommandSM + ' <%= file.path %>'));
});



gulp.task('default', function() {

    gulp.watch([definitionSources, typescriptSources, testSources], function(event) {
        util.log(util.colors.blue(['File', event.path, 'was', event.type,', compiling...'].join(' ')));

        child_process.exec(typescriptCommand + event.path, function(error, stdout, stderr) {
            util.log(util.colors.blue('done'));

            if (error !== null) {
                util.log(util.colors.red('exec error: ' + error));
            }
        });
    });
});

