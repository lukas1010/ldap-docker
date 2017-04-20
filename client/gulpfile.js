var gulp = require('gulp'),
    connect = require('gulp-connect'),
    bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    path = require('path'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css')
    angularFilesort = require('gulp-angular-filesort');

var paths = {
  sass: ['./assets/scss/*.scss']
};

gulp.task('connect', function () {
    connect.server({
        root: '.',
        port: 4000,
        livereload: true
    });
});

gulp.task('inject', function () {
    var target = gulp.src('./index.template.html'),
        srcBower = gulp.src(bowerFiles(), {read: false}),
        srcCss = gulp.src(['./app/**/*.css'], {read: false}),
        srcAngular = gulp.src(['./app/**/*.js']).pipe(angularFilesort());

    return target.pipe(inject(srcBower, {name: 'bower', relative: true}))
        .pipe(inject(srcCss, {relative: true}))
        .pipe(inject(srcAngular, {relative: true}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('.'))
});

gulp.task('sass-app', function (done) {
  gulp.src('./assets/scss/app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./assets/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./assets/css/'))
    .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass-app', 'inject']);
});

gulp.task('default', ['sass-app','inject', 'connect']);
gulp.task('build',['sass-app','inject']);