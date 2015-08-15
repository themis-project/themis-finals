import gulp from 'gulp'
import del from 'del'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import gulpIf from 'gulp-if'
import uglify from 'gulp-uglify'
import minifyHTML from 'gulp-minify-html'
import minifyCSS from 'gulp-minify-css'


var paths = {
    html: [
        'www/src/index.html'
    ],
    scripts: [
        'www/src/scripts/app.jsx'
    ],
    styles: [
        'www/src/styles/app.css'
    ]
}


function isProduction() {
    return process.env['NODE_ENV'] === 'production';
}


gulp.task('clean_html', (callback) => {
    del(['www/build/html/*'], callback)
})


gulp.task('html', ['clean_html'], () => {
    return gulp.src(paths.html)
        .pipe(gulpIf(isProduction, minifyHTML()))
        .pipe(gulp.dest('www/build/html'))
})


gulp.task('clean_scripts', (callback) => {
    del(['www/build/assets/js/*.js'], callback)
})


gulp.task('scripts', ['clean_scripts'], () => {
    return browserify({
        entries: paths.scripts,
        extensions: ['.jsx'],
        debug: !isProduction()
    })
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpIf(isProduction, uglify()))
    .pipe(gulp.dest('www/build/assets/js'))
})


gulp.task('clean_styles', (callback) => {
    del(['www/build/assets/css/*.css'], callback)
})


gulp.task('styles', ['clean_styles'], () => {
    return gulp.src(paths.styles)
        .pipe(gulpIf(isProduction, minifyCSS()))
        .pipe(gulp.dest('www/build/assets/css'))
})


gulp.task('default', ['html', 'scripts', 'styles'])
