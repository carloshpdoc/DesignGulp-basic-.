var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	pump = require('pump'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	jpegtran = require('imagemin-jpegtran'),
	htmlmin = require('gulp-htmlmin'),
	gls = require('gulp-live-server'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	less = require('gulp-less'),
	LessPluginCleanCSS = require('less-plugin-clean-css'),
	cleanCSSPlugin = new LessPluginCleanCSS({advanced: true});


gulp.task('default', ['sass','less','js','htmlmin','image','watch']);

gulp.task('sass', function () {
 return gulp.src('assets/src/sass/**/*.scss')
   .pipe(concat('style.min.css'))
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(gulp.dest('assets/css'));
});

gulp.task('js', function (cb) {
  pump([
        gulp.src('assets/src/js/*.js'),
		concat('script.min.js'),
        uglify(),
        gulp.dest('assets/js')
    ],
    cb
  );
});

gulp.task('htmlmin', function() {
  return gulp.src('_html/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('.'))
});

gulp.task('image', function () {
 return gulp.src('assets/src/img/*')
   .pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox:false}],
		use: [jpegtran()]
   }))
   .pipe(gulp.dest('assets/img'));
});

gulp.task('watch', function() {
	gulp.watch('assets/src/sass/**/*.scss',['sass']);
	gulp.watch('assets/src/js/*.js',['js']);
	gulp.watch('assets/src/img/*',['image']);
});

gulp.task('server', function() {
	var server = gls.static('./',8000);
	server.start();
	gulp.watch('./*.html', function(file){
		server.notify.apply(server,[file]);
	});
});

gulp.task('lint', function() {
  return gulp.src('assets/src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('less', function() {
  return gulp.src('assets/src/less/*.less')
	.pipe(less())
	.pipe(concat('styleLess.min.css'))
  .pipe(gulp.dest('assets/css'));
});
