const gulp = require('gulp');
const ts = require('gulp-typescript');

gulp.task('compile-emv-plugin', function() {
    const tsResult = gulp.src('**/EMV Plugin/*.ts').pipe(
        ts({
            declaration: true
        })
    );
    return tsResult.js.pipe(gulp.dest('EMV Plugin'));
});
