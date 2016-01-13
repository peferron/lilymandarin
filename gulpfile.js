const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const spawn = require('child_process').spawn;

// Build Jekyll site

gulp.task('jekyll', callback => {
    const jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});
    jekyll.on('exit', code => {
        const err = code === 0 ? null : `ERROR: Jekyll process exited with code: ${code}`;
        callback(err);
    });
});

// Prefix css

gulp.task('autoprefix', ['jekyll'], () =>
    gulp.src('_site/css/main.css')
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie >= 8']
        }))
        .pipe(gulp.dest('dist/css'))
);

// Build dist

gulp.task('build', ['jekyll', 'autoprefix']);
