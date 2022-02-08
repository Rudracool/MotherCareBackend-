/* jshint node: true */

/*
@module gulp.ssp-files

The task 'gulp ssp-files' will copy the .ssp files declared in property "ssp-files" of module's ns.package.json.

It supports handlebars templates which context contains the timestamp property - a timestamp generated at build time
that can be used to timstamp references to .js and .css files. It also supports a {{js}} Handlebars template to minify
embedded JavaScript Code.
*/

const gulp = require('gulp');
const fs = require('fs');
const map = require('map-stream');
const Handlebars = require('handlebars');
const chmod = require('gulp-chmod');
const args = require('yargs').argv;
const uglifyJS = require('uglify-js');
const helpers = require('./helpers');
const package_manager = require('../package-manager');

gulp.task('ssp-files', function(cb) {
    const files_map = package_manager.getFilesMapFor('ssp-files');

    installHandlebarsHelpers();

    const ssp_files = Object.keys(files_map);
    if (!ssp_files || !ssp_files.length) {
        return cb();
    }

    return gulp
        .src(ssp_files, { allowEmpty: true })
        .pipe(package_manager.handleOverrides())
        .pipe(helpers.map_renamer(files_map))
        .pipe(ssp_template())
        .pipe(chmod(0o666))
        .pipe(gulp.dest(process.gulp_dest, { mode: '0777' }));
});

let lastFile;

function ssp_template() {
    return map(function(file, cb) {
        lastFile = file;
        const template = Handlebars.compile(file.contents.toString());
        const template_context = buildTemplateContextFor(file);
        const result = template(template_context);

        file.contents = Buffer.from(result);

        cb(null, file);
    });
}

function buildTemplateContextFor(file) {
    const starterFile = fs
        .readFileSync('./gulp/templates/ssp-files-applicationStarter.tpl', { encoding: 'utf8' })
        .toString();

    const starterTemplate = Handlebars.compile(starterFile);

    const dependencies = fs
        .readFileSync('./gulp/templates/ssp-files-dependencies.tpl', { encoding: 'utf8' })
        .toString();
    const template = Handlebars.compile(dependencies);

    const context = {
        timestamp: require('./helpers').getTimestamp(),
        distro: package_manager.distro,
        arguments: args
    };

    context.dependencies = template();
    shoppingStarter = 'SC.Shopping.Starter';
    myAccountStarter = 'SC.MyAccount.Starter';
    checkoutStarter = 'SC.Checkout.Starter';

    const appStarterMap = {
        'shopping.ssp': shoppingStarter,
        'shopping-local.ssp': shoppingStarter,
        'my_account.ssp': myAccountStarter,
        'my_account-local.ssp': myAccountStarter,
        'checkout.ssp': checkoutStarter,
        'checkout-local.ssp': checkoutStarter
    };

    if (file.relative.replace('-local', '') === 'checkout.ssp') {
        const afterApplicationStarts = fs
            .readFileSync(
                './gulp/templates/ssp-files-checkoutAfterApplicationStartsParameters.tpl',
                { encoding: 'utf8' }
            )
            .toString();
        const afterApplicationStartsTemplate = Handlebars.compile(afterApplicationStarts);
        context.applicationStarter = starterTemplate({
            starterName: appStarterMap[file.relative],
            afterApplicationStarts: afterApplicationStartsTemplate()
        });
    } else {
        context.applicationStarter = starterTemplate({
            starterName: appStarterMap[file.relative],
            is_shopping: appStarterMap[file.relative] === shoppingStarter
        });
    }

    return context;
}

function installHandlebarsHelpers() {
    Handlebars.registerHelper('js', function(options) {
        const s = options.fn(this);
        return doUglify(s);
    });
}

function doUglify(s) {
    try {
        s = uglifyJS.minify(s).code;
    } catch (ex) {
        console.log(
            `WARNING: Error trying to uglify JavaScript code in ssp-file ${
                lastFile.path
            }. Not uglified. `
        );
        console.log('Reason:', ex);
    }
    return s;
}
