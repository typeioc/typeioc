
'use strict';

var gulp = require('gulp');
var del = require('del');
var header = require('gulp-header');
var replace = require('gulp-replace');
var pkg = require('../package.json');
var fs = require('fs');
var os = require('os');


(function() {

    var paths = {
        root :   '../',
        code :  {
            srcAll : '../src/**/*',
            src : '../src',
            definitionsAll : '../d.ts/typeioc*.d.ts',
            definitions : '../d.ts',
            index : '../index.js'
        },
        tests : {
            tsJs:  '../test/ts/*.js',
            map: '../test/ts/*.js.map'
        },
        lib: {
            all:  '../lib/**'
        },
        build : {
            sources : 'tsc @compile_lib.txt',
            tests :   'tsc @compile_tests.txt'
        },
        copyright :   '../COPYRIGHT'
    };

    var headerOptions = {
        banner:             [fs.readFileSync(paths.copyright), os.EOL, os.EOL].join(''),
        regex:              /^\/\*(.|[\n\r])+Copyright(.|[\n\r])+\*\/[\n\r]{2}/g,
        regexWithFooter:    /^\/\*(.|[\n\r])+Copyright(.|[\n\r])+\*\/[\n\r]{2}?/g
    }


    function addHeader(sources, destination){

        return gulp.src(sources)
            .pipe(replace(headerOptions.regex, ''))
            .pipe(header(headerOptions.banner, { pkg : pkg } ))
            .pipe(gulp.dest(destination));
    }

    function removeHeader(sources, destination){
        return gulp.src(sources)
            .pipe(replace(headerOptions.regexWithFooter, ''))
            .pipe(gulp.dest(destination));
    }


    function compileTasks() {

        gulp.task('default', ['build-tests']);

        gulp.task('build-tests', ['build-lib'], function(callBack) {

            var exec = require('child_process').exec;

            exec(paths.build.tests, function (err, stdout, stderr) {
                if(stdout) console.log(stdout);
                if(stderr) console.log(stderr);
                callBack(err);
            });
        });

        gulp.task('build-lib', ['clean'], function(callBack) {

            var exec = require('child_process').exec;

            exec(paths.build.sources, function (err, stdout, stderr) {
                if(stdout) console.log(stdout);
                if(stderr) console.log(stderr);
                callBack(err);
            });
        });
    }

    function cleanTasks() {
        gulp.task('clean', function(callBack) {

            del([
                paths.lib.all,
                paths.tests.tsJs,
                paths.tests.map
            ], {force : true}, callBack);
        });
    }

    function headerTasks() {
        gulp.task('header', ['add-source-header', 'add-definitions-header', 'add-index-header']);

        gulp.task('remove-header',
            ['remove-source-header', 'remove-definitions-header', 'remove-index-header']);

        gulp.task('add-source-header', function() {
            return addHeader(paths.code.srcAll, paths.code.src);
        });

        gulp.task('add-definitions-header', function() {
            return addHeader(paths.code.definitionsAll, paths.code.definitions);
        });

        gulp.task('add-index-header', function() {
            return addHeader(paths.code.index, paths.root);
        });

        gulp.task('remove-source-header', function() {
            return removeHeader(paths.code.srcAll, paths.code.src);
        });

        gulp.task('remove-definitions-header', function() {
            return removeHeader(paths.code.definitionsAll, paths.code.definitions);
        });

        gulp.task('remove-index-header', function() {
            return removeHeader(paths.code.index, paths.root);
        });
    }

    return {
        build: function() {
            compileTasks();
            cleanTasks();
            headerTasks();
        }
    }
})()
    .build();

