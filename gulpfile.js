var gulp = require('gulp'),
    files = require('./files.json');

/**
 *  Runs all JS file through JsHint tool.
 */
gulp.task('jshint', function () {
    "use strict";

    var jshint = require('gulp-jshint'),
        filter = require('gulp-filter');

    return gulp.src(files)
        .pipe(filter('src/**/*.js'))
        .pipe(jshint({
            lookup: true
        }))
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

/**
 * Start developmnet server with live reload
 */
gulp.task('dev', ['jshint'], function () {
    "use strict";

    var connect = require('gulp-connect'),
        respond = require('gulp-respond'),
        inject = require("gulp-inject");

    connect.server({
        root: ['web'],
        port: 8000,
        livereload: true,
        fallback: 'index.html',
        middleware: function () {
            return [function (req, rsp) {
                var url = req.url.split('?').shift();
                if((/bower_components/i).test(url) || (/src/i).test(url)) {
                    gulp.src('.' + url)
                        .pipe(gulp.dest('./web/' + url))
                        .pipe(respond(rsp));
                } else {
                    gulp.src('./src/index.html')
                        .pipe(inject(gulp.src(files, {read: false})/*, {relative: true}*/))
                        .pipe(gulp.dest('./web'))
                        .pipe(respond(rsp));
                }
            }];
        }
    });

});