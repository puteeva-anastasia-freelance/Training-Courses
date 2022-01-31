var gmWatch = false; // ON/OFF GraphicsMagick watching "img/_src" folder (true/false). Linux install gm: sudo apt update; sudo apt install graphicsmagick

var gulp = require('gulp'),
	ghPages = require('gulp-gh-pages'),
	sass = require('gulp-sass')(require('sass')),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify-es').default,
	cleancss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require('gulp-notify'),
	rsync = require('gulp-rsync'),
	imageResize = require('gulp-image-resize'),
	del = require('del'),
	imagecomp = require("compress-images");

// Local Server
gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

// Sass|Scss Styles
gulp.task('styles', function () {
	return gulp.src('app/scss/main.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer({
			// grid: true, // Optional. Enable CSS Grid
			overrideBrowserslist: ['last 10 versions']
		}))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream())
});

// JS
gulp.task('scripts', function () {
	return gulp.src([
			'app/libs/jquery/dist/jquery.min.js',
			'app/libs/select2/dist/js/select2.full.js',
			'app/js/common.js', // Always at the end
		])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify({
			output: {
				comments: false
			}
		}))
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.stream())
});

gulp.task('imagemin', async function () {
	imagecomp(
		"app/img/**/*",
		"dist/img/", {
			compress_force: false,
			statistic: true,
			autoupdate: true
		}, false, {
			jpg: {
				engine: "mozjpeg",
				command: ["-quality", "75"]
			}
		}, {
			png: {
				engine: "pngquant",
				command: ["--quality=75-100", "-o"]
			}
		}, {
			svg: {
				engine: "svgo",
				command: "--multipass"
			}
		}, {
			gif: {
				engine: "gifsicle",
				command: ["--colors", "64", "--use-col=web"]
			}
		},
		function (err, completed) {
			if (completed === true) {
				// browserSync.reload()
			}
		}
	)
});

// HTML Live Reload
gulp.task('code', function () {
	return gulp.src('app/*.html')
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Deploy
gulp.task('rsync', function () {
	return gulp.src('app/**')
		.pipe(rsync({
			root: 'app/',
			hostname: 'username@yousite.com',
			destination: 'yousite/public_html/',
			// include: ['*.htaccess'], // Includes files to deploy
			exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
});

gulp.task('watch', function () {
	gulp.watch('app/scss/main.scss', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'));
	gmWatch && gulp.watch('app/img/_src/**/*', gulp.parallel('imagemin')); // GraphicsMagick watching image sources if allowed.
});
gmWatch ? gulp.task('default', gulp.parallel('imagemin', 'styles', 'scripts', 'browser-sync', 'watch')) : gulp.task('default', gulp.parallel('styles', 'scripts', 'browser-sync', 'watch'));

gulp.task('removedist', function () {
	return del(['dist'], {
		force: true
	})
});

gulp.task('buildFiles', function () {
	return gulp.src(['app/*.html', 'app/.htaccess']).pipe(gulp.dest('dist'))
});
gulp.task('buildCss', function () {
	return gulp.src(['app/css/main.min.css']).pipe(gulp.dest('dist/css'))
});
gulp.task('buildJs', function () {
	return gulp.src(['app/js/scripts.min.js']).pipe(gulp.dest('dist/js'))
});
gulp.task('buildFonts', function () {
	return gulp.src(['app/fonts/**/*']).pipe(gulp.dest('dist/fonts'))
});

gulp.task('build', gulp.series('removedist', 'imagemin', 'styles', 'scripts', 'buildFiles', 'buildCss', 'buildJs', 'buildFonts'));

gulp.task('deploy', function () {

	return gulp.src('./dist/**/*')
		.pipe(ghPages());

});