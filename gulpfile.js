var
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  connect = require('gulp-connect'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  browserify = require('gulp-browserify'),
  uglyfly = require('gulp-uglyfly'),
  minifyHTML = require('gulp-minify-html');


gulp.task('connect', function () {
  return connect.server({
    port: 8080,
    livereload: true,
    root: './dist'
  });
});

gulp.task('style', function () {
  return gulp.src('src/style/*.styl')
    .pipe(concat('index.styl'))
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(csso())
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  return gulp.src(['src/*/*.js'])
    .pipe(browserify())
    .pipe(uglyfly())
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('html', function () {
  var opts = {
    conditionals: true,
    spare: true
  };

  return gulp.src('src/index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./dist'));
});


gulp.task('watch_js', function () {
  return gulp.watch(['src/script/*.js'], ['js']);
});

gulp.task('watch_styl', function () {
  return gulp.watch(['src/style/*.styl'], ['style']);
});

gulp.task('watch_html', function () {
  return gulp.watch(['src/index.html'], ['html']);
});

gulp.task('json_copy', function () {
  return gulp.src(['src/products.json'])
    .pipe(gulp.dest('./dist'))
});

gulp.task('watch', ['watch_js', 'watch_styl', 'watch_html']);
gulp.task('build', ['style', 'js', 'html', 'json_copy']);
gulp.task('default', ['build', 'connect', 'watch']);