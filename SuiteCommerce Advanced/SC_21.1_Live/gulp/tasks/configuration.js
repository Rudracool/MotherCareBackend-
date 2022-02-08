/* jshint node: true */
/* jshint esversion: 6 */

/*
@module gulp.configuration
#gulp configuration

This gulp task will compile all the module's configuration
to generate the file LocalDistribution/configurationManifest.json.

Each module can declare configuration properties by using the 'configuration'
property in ns.package.json. For example:

	{
		"gulp": {
			"configuration": [
				"Configuration/*.json"
			]
		}
	}

*/

const gulp = require('gulp');
const gif = require('gulp-if');
const map = require('map-stream');
const _ = require('underscore');
const path = require('path');
const fs = require('fs');
const args = require('yargs').argv;
const chmod = require('gulp-chmod');
const Vinyl = require('vinyl');
const through = require('through2');

const fileConcat = require('files-concat');
const package_manager = require('../package-manager');
const Tool = require('../config');

const validationErrors = {};

let tool;
let configurationManifest;
const collectedConfig = {};

const sspV2 = path.join(process.gulp_dest_ss2, process.gulp_dest_suitescript);

function creteVinylFile(fileObject) {
    const vinylFile = new Vinyl({
        cwd: '',
        base: undefined,
        path: fileObject.name,
        contents: Buffer.from(fileObject.sourceFunction)
    });

    const fileStream = through.obj(function(file, encoding, callback) {
        this.push(file);

        return callback();
    });
    fileStream.write(vinylFile);

    fileStream.end();
    return fileStream;
}

gulp.task('configuration', function(cb2) {
    const manifestFileName = 'configurationManifest.json';

    if (
        package_manager.getTaskConfig('configuration.ignore', false) ||
        !_.isEmpty(collectedConfig)
    ) {
        cb2(null);
        return;
    }
    const doValidate = package_manager.getTaskConfig('configuration.validate', true);
    tool = new Tool();
    configurationManifest = [];

    const stream = gulp
        .src(package_manager.getGlobsFor('configuration'), { allowEmpty: true })
        .pipe(package_manager.handleOverrides())
        .pipe(gif(doValidate, map(validateJSONSchema)))
        .pipe(
            gif(
                areConfigsValid,
                map(function(file, cb) {
                    const configuration_content = JSON.parse(file.contents.toString());
                    configurationManifest.push(configuration_content);
                    cb(null, file);
                })
            )
        )
        .pipe(fileConcat(manifestFileName))
        .pipe(map(configurationTasks))
        .pipe(
            map(function(file, cb) {
                file.contents = Buffer.from(JSON.stringify(configurationManifest, '\t', 4));
                cb(null, file);
            })
        )
        .pipe(
            gif(
                args.jsdoc,
                map(function(file, cb) {
                    tool.generateJsDocs({ manifest: file, output: 'configuration-jsdocs.js' });
                    cb(null, file);
                })
            )
        )
        .pipe(chmod({ write: true }))
        .pipe(gulp.dest(process.gulp_dest, { mode: '0777' }))
        .pipe(gulp.dest(`${sspV2}`, { mode: '0777' })); // We also want it in the SSPv2 app

    stream.on('end', function(err) {
        _.each(configurationManifest, function(entry) {
            _.each(entry.properties, function(value, key) {
                if (value.default !== undefined) {
                    setPathFromObject(collectedConfig, key, value.default);
                }
            });
        });
        // FOR SS1:
        fs.writeFileSync(
            path.join(process.gulp_dest, 'configurationManifestDefaults.json'),
            JSON.stringify(collectedConfig, 0, '\t')
        );
        // FOR SS2:
        // TODO move tsconfig to a file so we can import the ts compiler here and
        // use `export function configurationManifest(){}`
        creteVinylFile({
            name: 'configurationManifest.js',
            sourceFunction: `define(["exports"], function (exports) {
			"use strict";
			Object.defineProperty(exports, "__esModule", { value: true });
			function configurationManifest() {
				return ${JSON.stringify(collectedConfig, 0, '\t')};
			}
			exports.configurationManifest = configurationManifest;
		});`
        })
            .pipe(gulp.dest(path.join(`${sspV2}`, 'SC', 'Libraries', 'Configuration')))
            .on('end', cb2);
    });
});

// @method setPathFromObject @param {Object} object @param {String} path a path
// with values separated by dots @param {Any} value the value to set
const setPathFromObject = function(object, path, value) {
    if (!path) {
        return;
    }
    if (!object) {
        return;
    }

    const tokens = path.split('.');

    let prev = object;

    for (let token_idx = 0; token_idx < tokens.length - 1; ++token_idx) {
        const current_token = tokens[token_idx];

        if (_.isUndefined(prev[current_token])) {
            prev[current_token] = {};
        }
        prev = prev[current_token];
    }

    prev[_.last(tokens)] = value;
};

const configurationTasks = function(file, cb) {
    const errors = tool.modifications(configurationManifest);
    const doValidate = package_manager.getTaskConfig('configuration.validate', true);
    if (errors.length) {
        cb(`Modifications errors: \n${errors.join('\n')}`, file);
    } else if (doValidate) {
        const groupingErrors = tool.validateReferences(configurationManifest);
        if (groupingErrors.length) {
            cb(`Grouping errors: \n${groupingErrors.join('\n')}`, file);
        } else {
            cb(null, file);
        }
    } else {
        cb(null, file);
    }
};

const validateJSONSchema = function(config_file, cb) {
    let configJson;
    try {
        configJson = JSON.parse(config_file.contents.toString());
    } catch (ex) {
        console.log('Configuration error. Invalid configuration json file: ', config_file.path);
    }
    const errors = tool.validateJSONSchema(configJson);
    if (errors) {
        console.log('Configuration error. Invalid json schema file: ', config_file.path);
        validationErrors[config_file.path] = errors;
    }

    cb(null, config_file);
};

const areConfigsValid = function() {
    if (_.keys(validationErrors).length > 0) {
        console.log('Configuration not JSON Schema v4 compliant. Errors: \n');

        _.each(validationErrors, function(error, file) {
            console.log(`At: ${file}`, '\n', error, '\n');
        });

        process.exit(1);
    }

    return true;
};
