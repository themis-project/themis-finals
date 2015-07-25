import gulp from 'gulp';
import del from 'del';


var paths = {
    html: [
        'www/src/index.html'
    ]
};


function isProduction() {
    return process.env['ENV'] === 'production';
}


gulp.task('clean_html', (callback) => {
    del(['www/build/*.html'], callback);
});


gulp.task('html', ['clean_html'], () => {
    gulp.src(paths.html)
        .pipe(gulp.dest('www/build'));
});


gulp.task('default', ['html']);
