var gulp = require('gulp');

/**********************************************
 * Compile Jade Templates
 */

var jade = require('gulp-jade');
gulp.task('jade', function() {

  gulp.src('./src/views/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./'));
});

/**********************************************
 * Stylus to CSS
 * 1. Generate Style Guide
 * 2. compile to /app/css
 */

var stylus = require('gulp-stylus');
var nib = require('nib');

gulp.task('stylus', function() {
  gulp.src('./src/stylus/app.styl')
    .pipe(stylus({
      use: [nib()]
    }))
    .pipe(gulp.dest('./css'));
});

/**********************************************
 * Javascript
 * 1. jshint modules
 * 2. jshint main.js
 * 3. bundle to /app/js using Browserify to handle dependencies
 */

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

gulp.task('lint_modules', function() {
  return gulp.src('./src/js/modules/**/*.js')
    .pipe(jshint('./src/js/.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('lint_main', function() {
  return gulp.src('./src/js/app.js')
    .pipe(jshint('./src/js/.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('browserify', ['lint_modules', 'lint_main'], function() {
  var bundleStream = browserify('./src/js/app.js').bundle().pipe(source('site.js'));
  return bundleStream.pipe(gulp.dest('./js'));
});

/**********************************************
 * Watch
 */

gulp.task('watch', function() {
  gulp.watch('./src/js/**/**/*.js', ['browserify']); // will jshint first
  gulp.watch('./src/stylus/**/*.styl', ['stylus']); // will generate styleguide first
  gulp.watch('./src/views/**/*.jade', ['jade']);
});

/**********************************************
 * Default and specific tasks
 */

gulp.task('default', ['jade', 'browserify', 'stylus']);
gulp.task('build-js', ['browserify']);
gulp.task('build-css', ['stylus']);
gulp.task('build-jade', ['jade']);