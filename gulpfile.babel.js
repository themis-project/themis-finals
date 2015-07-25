import gulp from 'gulp';
import del from 'del';
import babel from 'gulp-babel';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';


var paths = {
    html: [
        'www/src/index.html'
    ],
    scripts: [
        'www/src/scripts/app.jsx'
    ],
    vendor: {
        scripts: [
            'node_modules/material-design-lite/material.js'
        ],
        stylesheets: [
            'node_modules/material-design-lite/material.css'
        ]
    }
};


function isProduction() {
    return process.env['ENV'] === 'production';
}


gulp.task('clean_html', (callback) => {
    del(['www/build/html/*'], callback);
});


gulp.task('html', ['clean_html'], () => {
    return gulp.src(paths.html)
        .pipe(gulp.dest('www/build/html'));
});


gulp.task('clean_scripts', (callback) => {
    del(['www/build/assets/js/*.js'], callback);
});


gulp.task('scripts', ['clean_scripts'], () => {
    return browserify({
        entries: 'www/src/scripts/index.jsx',
        extensions: ['.jsx'],
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('www/build/assets/js'));
});


gulp.task('clean_vendor_stylesheets', (callback) => {
    del(['www/build/assets/css/vendor/*'], callback);
});


gulp.task('vendor_stylesheets', ['clean_vendor_stylesheets'], () => {
    return gulp.src(paths.vendor.stylesheets)
        .pipe(gulp.dest('www/build/assets/css/vendor'));
});


gulp.task('clean_vendor_scripts', (callback) => {
    del(['www/build/assets/js/vendor/*'], callback);
});


gulp.task('vendor_scripts', ['clean_vendor_scripts'], () => {
    return gulp.src(paths.vendor.scripts)
        .pipe(gulp.dest('www/build/assets/js/vendor'));
});


gulp.task('default', ['html', 'scripts', 'vendor_stylesheets', 'vendor_scripts']);
