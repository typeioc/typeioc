
'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var eventStream = require('event-stream');
var typescript = require('./gulp-typescript');
var clean = require('gulp-clean');


var typescriptSources = '../src/**/*.ts';
var definitionSources = '../d.ts/typeioc*.d.ts';
var testSources = '../test/**/*.ts';
var libDestination = '../lib';
var libFiles = '../lib/*';

gulp.task('tsc', function() {

    var stream = eventStream.concat(
        gulp.src(definitionSources, { read: false }),
        gulp.src(typescriptSources, { read: false }),
        gulp.src(testSources, { read: false }))
    .pipe(typescript({
        module: 'commonjs',
        target: 'ES5',
        sourcemap : true
    })) .on('error', function(error) {
        stream.end();
        util.log(util.colors.red('Error compiling typescript file'));
    });
});



gulp.task('tsc-lib', ['clean-lib'], function() {

    gulp.src(typescriptSources, { read: false })
    .pipe(typescript({
        module: 'commonjs',
        target: 'ES5'
    }))
    .pipe(gulp.dest(libDestination));
});

gulp.task('clean-lib', function() {

    gulp.src(libFiles, {read: false})
        .pipe(clean({force: true}));
})


gulp.task('default', function() {

    gulp.watch([definitionSources, typescriptSources, testSources], function(event) {
        util.log(util.colors.blue(['File', event.path, 'was', event.type,', compiling...'].join(' ')));

        var stream = gulp.src(event.path, { read: false })
            .pipe(typescript({
                module: 'commonjs',
                target: 'ES5',
                sourcemap : true,
                verbose : undefined
            })) .on('error', function(error) {
                stream.end();
                util.log(util.colors.red('Error compiling typescript file'));
            });

    });
});

