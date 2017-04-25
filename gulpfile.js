/**
 * Created by heavenduke on 17-4-26.
 */
var gulp = require('gulp');
minifycss = require('gulp-minify-css'),   //css压缩
    concat = require('gulp-concat'),   //合并文件
    uglify = require('gulp-uglify'),   //js压缩
    rename = require('gulp-rename'),   //文件重命名
    notify = require('gulp-notify');   //提示

gulp.task('default', [
    'shared',
    'journals',
    'diaries',
    'columns',
    'articles',
    'projects',
    'profiles',
    'writings',
    'photos'
], function () {
    console.log("finished building!");
});

gulp.task('shared', function () {
    gulp.src('public/bower_components/bootstrap/dist/css/bootstrap.min.css')
        .pipe(concat('public/vendors/AdminLTE/css/AdminLTE.min.css'))
        .pipe(concat('public/css/theme.css'))
        .pipe(gulp.dest('test'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('test'))
        .pipe(notify({message: 'finish building shared css'}));
});

gulp.task('journals', function () {

});

gulp.task('diaries', function () {

});

gulp.task('columns', function () {

});

gulp.task('articles', function () {

});

gulp.task('projects', function () {

});

gulp.task('profiles', function () {

});

gulp.task('writings', function () {

});

gulp.task('photos', function () {

});