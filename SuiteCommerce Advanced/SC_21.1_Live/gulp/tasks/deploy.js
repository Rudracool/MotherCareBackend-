/* jshint node: true */
/* jshint esversion: 6 */

/*
@module gulp.deploy

This gulp task will build the project for production and push it into a netsuite's account. ASks the user about the
target netsuite account, user credentials, and the file cabinet folder they wish to deploy to.

By default it will use the folder ```DeployDistribution``` and it will delete it and re-generate it time you call it.

##User requirements:

 * By default, the 'deployer' script is required to be deployed in the target account (located in folder ns-deploy/Restlet). This script is automatically installed with the bundle and its ids are defined in distro.json > deploy.
 * The user must have web services (suitetalk) privileges.
 * An SSP application must exist into which to deploy.

##Usage

For compiling and deploying the full distribution from scratch:

	gulp deploy

By default, gulp deploy is intelligent enought to only upload the files that had changed. If you want to force all files upload, then
use

	gulp deploy --clean-manifest

Also the second time you execute the command the previous credentials, account and folder will be remember but the password.
So, if you want to re-deploy in another account/folder then you need first to remove the file .nsdeploy and you will be asked
again for credentials in the prompt:

	rm .nsdeploy
	gulp deploy

Passing ```--source``` argument the user can indicate to compile and deploy just certain gulp tasks. This
increases the deployment speed when you need to deploy just certain parts of the application when developing:

	gulp --source ssp-libraries
	gulp --source ssp-files
	gulp --source services
	gulp --source sass

If the deploy script/deploy id are not the defaults (customscript_sca_deployer / customdeploy_sca_deployer)
you can always pass these ids as arguments:

	gulp deploy --deploy-id=customdeploy_sca_deployer_2 --script-id=customscript_sca_deployer_2

The deploy will also upload all the sources in a zip file so anybody can download the distribution. Nevertheless this
is not mandatory to the deployed site to work, so it can be disabled by using the --no-backup argument.

If you have your sources already compiled you can pass --skip-compilation argument. Use this only if you know what you are doing!

*/

const args = require('yargs').argv;
const gulp = require('gulp');
const gif = require('gulp-if');
const path = require('path');
const async = require('async');
const shell = require('shelljs');
const _ = require('underscore');
const inquirer = require('inquirer');
const fs = require('fs');
const { execSync } = require('child_process');
const package_manager = require('../package-manager');
const mapFunctions = require('../library/map-functions');
const ns = require('../ns-deploy');

function deploy(cb) {
    shell.rm('-rf', `${process.gulp_dest}/processed-templates`);
    shell.rm('-rf', `${process.gulp_dest}/sass`);

    let options = {};

    if (args.interactive) {
        options = {
            interactive: true
        };
    } else if (args.tag || args.description) {
        options = {
            tag: args.tag,
            description: args.description
        };
    }
    if (args.to) {
        options.newDeploy = true;
    }
    if (args.m) {
        options.molecule = args.m;
    }

    let files = [path.join(process.gulp_init_cwd, '.nsdeploy')];

    if (args.f) {
        files = args.f.split(',');
    }

    if (!options.user_agent) {
        const package_json = JSON.parse(fs.readFileSync('./package.json'));
        const isSCIS = !package_manager.distro.isSCA && !package_manager.distro.isSCLite;

        if (isSCIS) {
            package_json.name = package_json.name.replace('sc-', 'scis-');
        }

        const user_agent = `${package_json.name}/${package_json.version}`;

        options.user_agent = user_agent;
    }

        runDeploy(files, options, cb);
    }

function runDeploy(files, options, cb) {
    const tasks = _.map(files, function(file) {
        return function(cb) {
            const configs = package_manager.getTaskConfig('deploy', []);
            options.distroName = package_manager.distro.name;
            options.file = file;
            options.scriptId = configs.scriptId;
            options.deployId = configs.deployId;
            options.publicList = configs.publicList;
            options.backup = configs.backup;

            const license_text = package_manager.distro.license.text;

            return gulp
                .src(`${process.gulp_dest}*/**`, { allowEmpty: true })
                .pipe(mapFunctions.mapAddLicense(license_text))
                .pipe(ns.deploy(options))
                .on('end', function() {
                    cb();
                });
        };
    });

    async.series(tasks, function(err) {
        cb(err);
        process.exit();
    });
}

function deployVersion() {
    function copy_version() {
        return gulp
            .src('./version.txt', { allowEmpty: true })
            .pipe(gulp.dest(process.gulp_dest, { mode: '0777' }))
            .pipe(gif(process.generateV2, gulp.dest(process.gulp_dest_ss2, { mode: '0777' })));
    }

    if (fs.existsSync('version.txt')) {
        return copy_version();
    }

    let version;
    try {
        version = execSync(
            `p4 changes -m 1 ${path.join(process.gulp_init_cwd, '/../../../src')}/...#have`
        );
    } catch (e) {
        version = new Date().toISOString();
    }

    fs.writeFileSync('version.txt', version);
    return copy_version();
}

let source = ['default'];

if (args.source) {
    source = args.source.split(',');
} else if (args.skipCompilation) {
    source = [];
} else if (args.dev) {
    source = ['services', 'ssp-libraries', 'ssp-files', 'scripts'];
}
source.push('deploy-version');

gulp.task('deploy-version', deployVersion);
gulp.task('deploy', gulp.series(gulp.parallel(source), deploy));
gulp.task('deploy-no-deps', deploy);

gulp.task('rollback', function(cb) {
    ns.rollback(cb);
});
