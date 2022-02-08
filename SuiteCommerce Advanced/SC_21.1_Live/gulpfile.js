/* jshint node: true */
/* jshint esversion: 6 */

process.gulp_init_cwd = process.env.INIT_CWD || process.cwd();
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const args = require('yargs').argv;
const package_manager = require('./gulp/package-manager');

process.generateV2 = false;

process.gulp_dest_distro = path.join(
    process.gulp_init_cwd,
    package_manager.distro.folders.distribution
);
process.gulp_dest_deploy = path.join(process.gulp_init_cwd, package_manager.distro.folders.deploy);
process.gulp_dest = process.gulp_dest_distro;

process.generateAllJavaScript = args.generateAllJavaScript;

process.gulp_dest_suitescript = '_suitescript';
process.gulp_dest_ss2 = `${process.gulp_dest}SS2`;

// Only if we are invoking deploy from the command line.
if (_.intersection(args._, ['deploy', 'backend_ss2']).length && !args.skipCompilation) {
    var del = require('del');

    process.gulp_dest = process.gulp_dest_deploy;
    process.gulp_dest_ss2 = `${process.gulp_dest}SS2`;
    try {
        del.sync([process.gulp_dest, process.gulp_dest_ss2], { force: true });
        fs.mkdirSync(process.gulp_dest, { recursive: true });
        fs.mkdirSync(process.gulp_dest_ss2, { recursive: true });
    } catch (e) {}
}

// Store the relations between templates in SCL
process.dataTemplateDependencies = {};

process.is_SCA_devTools = true;

// Delete the LocalDistribution folder in SCL, required by the "template" task
if (package_manager.distro.isSCLite) {
    var del = require('del');
    del.sync([path.join(process.gulp_dest_distro, '**')]);
}

const load_last = ['deploy.js', 'watch.js', 'local.js'];

const baseTaskDir = path.resolve(__dirname, './gulp/tasks');
fs.readdirSync(baseTaskDir).forEach(function(task_name) {
    if (/\.js$/.test(task_name) && !_.contains(load_last, task_name)) {
        require(path.join(baseTaskDir, task_name.replace('.js', '')));
    }
});

const frontendDependencies = ['javascript', 'javascript-move', 'copy'];
let defaultDependencies = ['javascript', 'javascript-move', 'copy'];
let backendDependencies = [];
if (!package_manager.distro.isSCLite || process.generateAllJavaScript) {
    frontendDependencies.push('languages');
    backendDependencies = [
        'scripts',
        'services',
        gulp.series('ssp-libraries', 'backend_ss2-no-dep'),
        'ssp-files'
    ];
    defaultDependencies = [...defaultDependencies, ...backendDependencies];
}

gulp.task('frontend', gulp.parallel(frontendDependencies));

gulp.task('backend', gulp.parallel(backendDependencies));

gulp.task(
    'default',
    gulp.series(gulp.parallel(defaultDependencies), function generate_manifests(cb) {
        generateManifest();
        generateAppManifest();
        cb();
    })
);

_.each(load_last, function(to_load) {
    require(path.join(baseTaskDir, to_load.replace(/\.js$/, '')));
});

function generateAppManifest() {
    const isDeploy = folderExists(package_manager.distro.folders.deploy);
    const targetFolder = isDeploy
        ? package_manager.distro.folders.deploy
        : package_manager.distro.folders.distribution;

    fs.writeFileSync(
        path.join(targetFolder, 'app_manifest.json'),
        JSON.stringify(package_manager.distro.app_manifest || {}, null, '\t')
    );

    fs.writeFileSync(
        path.join(`${targetFolder}SS2`, 'app_manifest.json'),
        JSON.stringify(package_manager.distro.app_manifest || {}, null, '\t')
    );
}

function generateManifest() {
    const isDeploy = folderExists(package_manager.distro.folders.deploy);
    const targetFolder = isDeploy
        ? package_manager.distro.folders.deploy
        : package_manager.distro.folders.distribution;

    const Uploader = require('ns-uploader');
    Uploader.prototype
        .buildLocalManifest(targetFolder)
        .then(function(localManifest) {
            if (!isDeploy) {
                const regex = new RegExp(`^${package_manager.distro.folders.distribution}`);
                _.each(localManifest, function(entry) {
                    entry.path = entry.path.replace(regex, package_manager.distro.folders.deploy);
                });
            }
            fs.writeFileSync(
                path.join(targetFolder, Uploader.prototype.MANIFEST_FILE_NAME),
                JSON.stringify(localManifest)
            );
        })
        .catch(function() {
            // ignore errors - we can still proceed without a manifest
        });
}

function folderExists(folder) {
    try {
        return fs.lstatSync(folder).isDirectory();
    } catch (ex) {
        return false;
    }
}
