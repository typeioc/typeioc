
'use strict';

var gulp = require('gulp');
var del = require('del');
var header = require('gulp-header');
var replace = require('gulp-replace');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var pkg = require('../package.json');
var fs = require('fs');
var os = require('os');


(function() {

    var paths = {
        root :   '../',
        code :  {
            srcTs : '../src/**/*.ts',
            src : '../src',
            definitionsAll : '../d.ts/typeioc*.d.ts',
            definitions : '../d.ts',
            index : '../index.js',
            addonsAll: '../addons/**/*',
            addons: '../addons'
        },
        tests : {
            js : '../test/js/**/*.js',
            jsApi : '../test/js/api/**/*.js',
            jsInternal : '../test/js/internal/**/*.js',
            tsJs:  '../test/ts/*.js',
            ts: '../test/ts/*.ts',
            map: '../test/ts/*.js.map',
            coverage : '../test/coverage'
        },
        lib: {
            all:  '../lib/**',
            js:   '../lib/**/*.js'
        },
        build : {

            appveyor : 'C:\\Users\\appveyor\\AppData\\Roaming\\npm\\',

            get sources() {

                var path = 'tsc -p ../';

                if(gutil.env.env === paths.env.appveyor)
                    path = this.appveyor + path;

                return path;
            },
            get tests() {

                var path = 'tsc -p ../tsconfig.tests.json';

                if(gutil.env.env === paths.env.appveyor)
                    path = this.appveyor + path;

                return path;
            },
        },
        env : {
            appveyor : 'appveyor'
        },
        copyright :   '../COPYRIGHT'
    };

    var headerOptions = {
        banner:             [fs.readFileSync(paths.copyright), os.EOL, os.EOL].join(''),
        regex:              /^\/\*(.|[\n\r])+Copyright(.|[\n\r])+\*\/[\n\r]{2}/g,
        regexWithFooter:    /^\/\*(.|[\n\r])+Copyright(.|[\n\r])+\*\/[\n\r]{2}?/g
    };


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

        gulp.task('compile', function(callback) {
            runSequence('clean',
                [ 'build-lib', 'build-tests'],
                callback);
        });    

        gulp.task('build', function(callback) {
            runSequence('clean',
                [ 'build-lib', 'build-tests'],
                'remove-header',
                'header',
                callback);
        });

        gulp.task('build-tests', function(callBack) {

            var exec = require('child_process').exec;

            exec(paths.build.tests, function (err, stdout, stderr) {
                if(stdout) {
                    console.log(stdout);
                }

                if(stderr) {
                    console.log(stderr);
                }

                callBack(err);
            });
        });

        gulp.task('build-lib', function(callBack) {

            var exec = require('child_process').exec;

            exec(paths.build.sources, function (err, stdout, stderr) {
                if(stdout) {
                    console.log(stdout);
                }

                if(stderr) {
                    console.log(stderr);
                }

                callBack(err);
            });
        });
    }

    function cleanTasks() {
        gulp.task('clean', function(callBack) {

            return del([
               paths.lib.all,
               paths.tests.tsJs,
               paths.tests.map
            ], {force : true}, callBack);
        });
    }

    function headerTasks() {
        gulp.task('header', ['add-source-header', 'add-definitions-header', 'add-index-header', 'add-addons-header']);

        gulp.task('remove-header',
            ['remove-source-header', 'remove-definitions-header', 'remove-index-header', 'remove-addons-header']);

        gulp.task('add-source-header', function() {
            return addHeader(paths.code.srcTs, paths.code.src);
        });

        gulp.task('add-definitions-header', function() {
            return addHeader(paths.code.definitionsAll, paths.code.definitions);
        });

        gulp.task('add-index-header', function() {
            return addHeader(paths.code.index, paths.root);
        });

        gulp.task('add-addons-header', function() {
            return addHeader(paths.code.addonsAll, paths.code.addons);
        });

        gulp.task('remove-source-header', function() {
            return removeHeader(paths.code.srcTs, paths.code.src);
        });

        gulp.task('remove-definitions-header', function() {
            return removeHeader(paths.code.definitionsAll, paths.code.definitions);
        });

        gulp.task('remove-index-header', function() {
            return removeHeader(paths.code.index, paths.root);
        });

        gulp.task('remove-addons-header', function() {
            return removeHeader(paths.code.addonsAll, paths.code.addons);
        });
    }

    return {
        build: function() {
            compileTasks();
            cleanTasks();
            headerTasks();
        }
    };
})()
.build();