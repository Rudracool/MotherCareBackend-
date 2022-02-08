/* jshint node: true */
/* jshint esversion: 6 */

const gulp = require('gulp');
const gif = require('gulp-if');
const path = require('path');

const c = require('ansi-colors');
const uglify = require('gulp-uglify');

const map = require('map-stream');
const _ = require('underscore');
const chmod = require('gulp-chmod');
const log = require('ns-logs');
const helpers = require('./helpers');
const package_manager = require('../package-manager');

const prefix_map = {
    ShoppingApplication: 'shopping_',
    MyAccountApplication: 'myaccount_',
    CheckoutApplication: 'checkout_',
    PosApplication: 'scis_'
};

const sspV2 = process.gulp_dest_ss2;

function parsePath(file_path) {
    const extname = path.extname(file_path);
    return {
        dirname: path.dirname(file_path),
        basename: path.basename(file_path, extname),
        extname: extname
    };
}

gulp.task('languages', function(cb) {
    const transform_keys = _.keys(prefix_map);

    const languages = package_manager.getGlobsFor('languages');
    if (!languages || !languages.length) {
        return cb();
    }

    return gulp
        .src(languages, { allowEmpty: true })
        .pipe(package_manager.handleOverrides())
        .pipe(helpers.notDev(uglify()))
        .pipe(
            map(function(file, cb) {
                const parsed_path = parsePath(file.relative);
                const prefix_key = _.find(transform_keys, function(key) {
                    return file.base.indexOf(key) >= 0;
                });
                const prefix = prefix_map[prefix_key];

                if (!prefix) {
                    log(`${c.magenta('Warning: No prefix found for ')} ${file.path}`);
                    cb();
                } else {
                    file.path = path.join(
                        file.base,
                        parsed_path.dirname,
                        prefix + parsed_path.basename + parsed_path.extname
                    );
                    cb(null, file);
                }
            })
        )
        .pipe(chmod(0o666))
        .pipe(gulp.dest(path.join(process.gulp_dest, 'languages'), { mode: '0777' }))
        .pipe(gif(process.generateV2, gulp.dest(path.join(sspV2, 'languages'), { mode: '0777' })));
});

gulp.task('watch-languages', function() {
    gulp.watch(
        package_manager.getGlobsFor('languages'),
        { interval: 500 },
        gulp.series('languages')
    );
});
