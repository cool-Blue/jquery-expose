/**
 * Created by Admin on 18/07/2016.
 */
var gulp        = require("gulp"),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    prettify    = require('gulp-js-prettify');


var browserify = require('browserify');

gulp.task('build', function() {
    return browserify('./app.cb.js')
        .exclude('jsdom')
        .bundle()
        .pipe(source('app.cb.bundle.js'))
        .pipe(buffer())
        .pipe(prettify())
        .pipe(gulp.dest('./'));
});

