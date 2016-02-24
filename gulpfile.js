const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const spawn = require('child_process').spawn;
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const pngout = require('imagemin-pngout');
const advpng = require('imagemin-advpng');
const mozjpeg = require('imagemin-mozjpeg');
const jpegoptim = require('imagemin-jpegoptim');
const jpegtran = require('imagemin-jpegtran');
const svgo = require('imagemin-svgo');
const del = require('del');
const ghPages = require('gulp-gh-pages');

// Build Jekyll site

gulp.task('jekyll', done => {
    const jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});
    jekyll.on('exit', code => {
        const err = code === 0 ? null : `ERROR: Jekyll process exited with code: ${code}`;
        done(err);
    });
});

// Clean dist

gulp.task('clean-dist', () =>
    del('dist')
);

// Copy _site to dist

gulp.task('create-dist', ['jekyll', 'clean-dist'], () =>
    gulp.src('_site/**/*')
        .pipe(gulp.dest('dist'))
);

// Prefix CSS

gulp.task('prefix-css', ['create-dist'], () =>
    gulp.src('_site/css/**/*.css', {base: '_site'})
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie >= 8']
        }))
        .pipe(gulp.dest('dist'))
);

// Optimize images. The Pudong background images have been manually optimized.

gulp.task('optimize-img', ['create-dist'], () =>
    gulp.src(['_site/img/**/*.{png,jpg,svg}', '!_site/img/pudong/*', '!_site/img/opengraph/*'],
        {base: '_site'})
        // Running lossy optimizers first, then lossless second, usually gives the best results.
        .pipe(imagemin({use: [
            pngquant({quality: '50-70'}),
            pngout(),
            advpng(),
            mozjpeg({quality: 90}),
            jpegoptim({progressive: true}),
            jpegtran({progressive: true}),
            svgo()
        ]}))
        .pipe(gulp.dest('dist'))
);

// Build dist

// We currently rely on CloudFlare for minifying JS, CSS and HTML.
gulp.task('build', ['create-dist', 'prefix-css', 'optimize-img']);

// Deploy to Github Pages

gulp.task('deploy', ['build'], () =>
    gulp.src('dist/**/*')
        .pipe(ghPages())
);
