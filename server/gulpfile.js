var gulp = require('gulp'),
    apidoc = require('gulp-apidoc'),
    jasmine = require('gulp-jasmine'),
    exit = require('gulp-exit');

gulp.task('apidoc', function (done) {
    apidoc({
        src: '.',
        dest: 'documents/',
        debug: true,
        includeFilters: [".*\\.js$"],
        excludeFilters: ["node_modules/"]
    }, done);
});

gulp.task('servertest', function () {
    return gulp.src([
        '**/*.spec.js',
    ])
        // gulp-jasmine works on filepaths so you can't have any plugins before it
        .pipe(jasmine())
        .pipe(exit());
});

gulp.task('default', ['apidoc']);