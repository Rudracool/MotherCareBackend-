const gulp = require('gulp');
const ts = require('gulp-typescript');

gulp.task('compile-ts-scripts', function() {
    const tsResult = gulp.src('**/Scripts/*.ts').pipe(
        ts({
            declaration: true
        })
    );
    return tsResult.js.pipe(gulp.dest('./'));
});
