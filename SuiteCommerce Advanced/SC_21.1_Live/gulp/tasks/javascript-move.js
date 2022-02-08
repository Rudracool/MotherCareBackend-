/* jshint node: true */
/* jshint esversion: 6 */

'use strict';

const gulp = require('gulp');
const gif = require('gulp-if');
const path = require('path');
const chmod = require('gulp-chmod');
const package_manager = require('../package-manager');

const dest = path.join(process.gulp_dest, 'javascript');
const destSS2 = path.join(process.gulp_dest_ss2, 'javascript');

gulp.task('javascript-move', function(cb) {
    const glob = package_manager.getGlobsFor('javascript-move');
    if (!glob || !glob.length) {
        return cb();
    }

    return gulp
        .src(glob, { allowEmpty: true })
        .pipe(chmod(0o666))
        .pipe(gulp.dest(dest, { mode: '0777' }))
        .pipe(gif(process.generateV2, gulp.dest(destSS2, { mode: '0777' })));
});
