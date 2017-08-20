'use strict';

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    eslint = require('gulp-eslint'),
    gulpExit = require('gulp-exit');


// create a default task and just log a message
gulp.task('default', ['default2'], function() {
    return gutil.log('Gulp is running!');
});

gulp.task('default2', function() {
    return gutil.log('Gulp task2 is running!');
});

gulp.task('jsLint', function() {
    return gulp.src(['*.js','**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format("table"))
});

gulp.task('watch', function() {
    gulp.watch('./*.js', ['default2'])
        .pipe(eslint());
});

gulp.task('mochaTest', function() {
    var app = require('./libs/app');
    app.start(function() {
        gulp.src('./modules/**/test/*.js',  {read: false})
            .pipe(mocha({
                reporter: 'mochawesome',
                reporterOptions: {
                    reportDir: 'mocha-test-results',
                    reportFilename: 'results',
                    enableCharts: true,
                    inlineAssets: true
                }
            }))
            .on('error', function() {
                gulpExit();
            })
            .pipe(gulpExit());
    });
});

gulp.task('istanbul-pre-test', function () {
    return gulp.src(['./modules/**/test/*.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('istcov', ['istanbul-pre-test'], function () {
    return gulp.src(['./modules/**/test/*.js'])
        .pipe(mocha())
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports())
        // Enforce a coverage of at least 90%
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});