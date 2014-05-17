
'use strict';

var exec = require('gulp-exec');
var child_process = require('child_process');
var gulp = require('gulp');
var util = require('gulp-util');
var eventStream = require('event-stream');
var typescript = require('gulp-tsc');
var clean = require('gulp-clean');


var typescriptSources = '../src/**/*.ts';
var definitionSources = '../d.ts/typeioc*.d.ts';
var testSources = '../test/**/*.ts';
var libDestination = '../lib';
var libFiles = '../lib/*';
var typescriptCommand = 'tsc --target ES5  --module commonjs --sourcemap ';


gulp.task('tsc', ['tsc-lib', 'tsc-tests'], function() {


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
        pathFilter: function (path) { return path.replace(/^src/, 'lib') }
    }))
    .pipe(gulp.dest('../'));
});

gulp.task('clean-lib', function() {

    gulp.src(libFiles, {read: false})
        .pipe(clean({force: true}));
});

gulp.task('tsc-tests', function() {
    gulp.src(testSources, { read: false })
        .pipe(exec(typescriptCommand + ' <%= file.path %>'));
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

