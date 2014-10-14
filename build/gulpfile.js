
'use strict';

var exec = require('gulp-exec');
var gulp = require('gulp');
var eventStream = require('event-stream');
var typescript = require('gulp-tsc');
var remove = require('rimraf');
var header = require('gulp-header');
var pkg = require('../package.json');
var fs = require('fs');

var typescriptSources = '../src/**/*.ts';
var definitionSources = '../d.ts/typeioc*.d.ts';
var testSources = '../test/**/*.ts';
var libDestination = 'lib';
var libFiles = '../lib';
var libFilesHeader = '../lib/**/*.js';
var copyrightPath = '../COPYRIGHT';
var typescriptCommand = 'tsc --target ES5  --module commonjs ';
var typescriptCommandSM = typescriptCommand + ' --sourcemap ';


gulp.task('build', ['build-lib', 'build-tests'], function() {

});

gulp.task('build-lib', ['clean-lib'], function() {

    eventStream.concat(
        gulp.src(definitionSources, { read: false }),
        gulp.src(typescriptSources, { read: false })
    )
    .pipe(typescript({
        tscSearch : ['shell'],
        module: 'commonjs',
        target: 'ES5',
        sourcemap : true,
        pathFilter: function (path) { return path.replace(/^src/, libDestination); }
    }))
    .pipe(gulp.dest('../'));
});

gulp.task('header', function() {

    var banner = fs.readFileSync(copyrightPath) + '\n\n';

    gulp.src(libFilesHeader)
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest(libFiles));

});

gulp.task('clean-lib', function(cb) {

    remove(libFiles, cb);

});

gulp.task('build-tests', function() {
    gulp.src(testSources, { read: false })
        .pipe(exec(typescriptCommandSM + ' <%= file.path %>'));
});
