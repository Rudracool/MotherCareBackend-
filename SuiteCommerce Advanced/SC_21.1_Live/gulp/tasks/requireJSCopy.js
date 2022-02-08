const gulp = require('gulp');
const gif = require('gulp-if');
const path = require('path');
const chmod = require('gulp-chmod');
const package_manager = require('../package-manager');

gulp.task('requireJSCopy', function() {
    const dest = path.join(process.gulp_dest, 'javascript');
    const destSS2 = path.join(process.gulp_dest_ss2, 'javascript');
    return gulp
        .src(package_manager.getGlobsForModule('module-loader', 'javascript'), {
            allowEmpty: true
        })
        .pipe(chmod(0o666))
        .pipe(gulp.dest(dest, { mode: '0777' }))
        .pipe(gif(process.generateV2, gulp.dest(destSS2, { mode: '0777' })));
});
