/**
 * Created by heavenduke on 17-4-26.
 */
var gulp = require('gulp');
minifycss = require('gulp-minify-css'),   //css压缩
    concat = require('gulp-concat'),   //合并文件
    uglify = require('gulp-uglify'),   //js压缩
    rename = require('gulp-rename'),   //文件重命名
    notify = require('gulp-notify');   //提示


var $ = require('gulp-load-plugins')();

gulp.task('default', [
    'shared',
    'home',
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
    gulp.src(['public/vendors/AdminLTE/css/skins/skin-blue.min.css',
              'public/vendors/AdminLTE/css/AdminLTE.min.css',
              'public/src/css/index.css',
              'public/src/css/theme.css'])
        .pipe(minifycss())
        .pipe(concat('theme.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({message: 'finish building shared css'}));

    gulp.src('public/src/js/shared.js')
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(concat('shared.min.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(notify({message: 'finish building shared js'}));
});

gulp.task('home', function () {
    gulp.src('public/src/css/journals.css')
        .pipe(minifycss())
        .pipe(concat('home.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({message: 'finish building stylesheets for homepage'}));
});

gulp.task('journals', function () {
    gulp.src(['public/bower_components/hshare/hshare.min.css',
        'public/vendors/OwO/OwO.min.css',
        'public/src/css/journals.css'])
        .pipe(minifycss())
        .pipe(concat('journals.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({message: 'finish building stylesheets for journal module'}));

    gulp.src(['public/vendors/OwO/OwO.min.js',
              'public/bower_components/hshare/hshare.min.js',
              'public/src/js/richtext.js',
              'public/src/js/journals.js'])
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(concat('journals.min.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(notify({message: 'finish building js for journal module'}));

    gulp.src('public/vendors/OwO/OwO.json')
        .pipe(concat('OwO.json'))
        .pipe(gulp.dest('public/dist/data'))
        .pipe(notify({message: 'finish building data for journal module'}));
});

gulp.task('diaries', function () {
    gulp.src('public/src/css/diaries.css')
        .pipe(minifycss())
        .pipe(concat('diaries.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({message: 'finish building stylesheets for diary module'}));

    gulp.src('public/src/js/diaries.js')
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(concat('diaries.min.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(notify({message: 'finish building js for diary module'}));
});

gulp.task('columns', function () {
    gulp.src(['public/bower_components/hshare/hshare.min.css',
        'public/vendors/OwO/OwO.min.css',
        'public/src/css/columns.css'])
        .pipe(minifycss())
        .pipe(concat('columns.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({message: 'finish building stylesheets for column module'}));

    gulp.src(['public/vendors/OwO/OwO.min.js',
        'public/bower_components/hshare/hshare.min.js',
        'public/src/js/richtext.js',
        'public/src/js/columns.js'])
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(concat('columns.min.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(notify({message: 'finish building js for column module'}));
});

gulp.task('articles', function () {
    gulp.src(['public/bower_components/hshare/hshare.min.css',
        'public/vendors/OwO/OwO.min.css',
        'public/src/css/articles.css'])
        .pipe(minifycss())
        .pipe(concat('articles.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({message: 'finish building stylesheets for article module'}));

    gulp.src(['public/vendors/OwO/OwO.min.js',
        'public/bower_components/hshare/hshare.min.js',
        'public/src/js/richtext.js',
        'public/src/js/articles.js'])
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(concat('articles.min.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(notify({message: 'finish building js for article module'}));

    gulp.src('public/vendors/OwO/OwO.json')
        .pipe(concat('OwO.json'))
        .pipe(gulp.dest('public/dist/data'))
        .pipe(notify({message: 'finish building data for article module'}));
});

gulp.task('projects', function () {
    gulp.src('public/src/css/projects.css')
        .pipe(minifycss())
        .pipe(concat('projects.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({message: 'finish building stylesheets for project module'}));

    gulp.src('public/src/js/projects.js')
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(concat('projects.min.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(notify({message: 'finish building js for project module'}));
});

gulp.task('profiles', function () {
    gulp.src(['public/bower_components/hshare/hshare.min.css',
              'public/src/css/profile.css'])
        .pipe(minifycss())
        .pipe(concat('profile.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({message: 'finish building stylesheets for photo module'}));

    gulp.src(['public/bower_components/hshare/hshare.min.js',
              'public/src/js/richtext.js',
              'public/src/js/profile.js'])
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(concat('profile.min.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(notify({message: 'finish building js for photo module'}));
});

gulp.task('writings', function () {
    gulp.src('public/src/css/writings.css')
        .pipe(minifycss())
        .pipe(concat('writings.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({message: 'finish building stylesheets for project module'}));

    gulp.src('public/src/js/writings.js')
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(concat('writings.min.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(notify({message: 'finish building js for project module'}));
});

gulp.task('photos', function () {
    gulp.src('public/src/css/photos.css')
        .pipe(minifycss())
        .pipe(concat('photos.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({message: 'finish building stylesheets for project module'}));

    gulp.src('public/src/js/photos.js')
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(concat('photos.min.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(notify({message: 'finish building js for project module'}));
});

gulp.watch(['public/src/**/*.*', 'public/vendors/..'], ['default']);