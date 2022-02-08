/* jshint node: true */
/* jshint esversion: 6 */

/*
@module gulp.javascript
#gulp javascript

This gulp task will compile the project's javascript output.
It support two different kind of compilation:

## Compiling for production

For generating production code we use the amd-optimizer build
tool that will generate all the required
JavaScript code dependencies from a application's Starter.js
file that is declared in distro.json file
property javascript->entryPoint. Then, some extra tools like
minification thorough uglify and/or sourcemap.
Also for performance reasons the final output is transformed
using the tool amdclean.
can be done as well. Examples:

	gulp javascript
	gulp javascript --js require
	gulp javascript --nouglify

Notice that generating sourcemaps or running uglify can take longer.

##Compiling for development

We support compilation type suited for development using the argument '--js require'.
This will generate a requirejs config file pointing to the real files in Modules/.
This way you don't need to do any compilation on your JavaScript files,
just save them and reload your browser.
This task is called indirectly when running our development environment using:

	gulp local --js require

##Declaring javascript in ns.package.json

The javascript files that are able to be compiled are those referenced by
the property gulp.javascript in module's ns.package.json file.
Also the compiled templates (using gulp templates). Example:

	{
		"gulp": {
			...
		,	"javascript": [
				"JavaScript/*"
			]
		}
	}

*/

const path = require('path');
const gulp = require('gulp');
const _ = require('underscore');
const fs = require('fs');
const guglify = require('gulp-uglify');
const map = require('map-stream');
const gif = require('gulp-if');
const args = require('yargs').argv;
const glob = require('glob').sync;
const chmod = require('gulp-chmod');
const ts = require('gulp-typescript');
const fileConcat = require('files-concat');
const { bundler } = require('bundler');
const through2 = require('through2');
const package_manager = require('../package-manager');
require('./requireJSCopy');
!process.is_SCA_devTools && require('./templates');

const dest = path.join(process.gulp_dest, 'javascript');
const destSS2 = path.join(process.gulp_dest_ss2, 'javascript');

const typeScriptCompilerOptions = {
    module: 'amd',
    target: 'es5',
    allowJs: true,
    experimentalDecorators: true,
    baseUrl: './node_modules/',
    paths: {
        'schema-dts': ['schema-dts/schema']
    },
    types: [],
    lib: ['DOM', 'ES5']
};
if (args.tsStrict) {
    typeScriptCompilerOptions.strictNullChecks = true;
    typeScriptCompilerOptions.strictBindCallApply = true;
    typeScriptCompilerOptions.strictFunctionTypes = true;
    typeScriptCompilerOptions.strictPropertyInitialization = true;
    typeScriptCompilerOptions.noImplicitThis = true;
}
const moduleLoaderLibrary = 'module-loader';
const moduleLoaderNSPackageSection = 'javascript';

function getGlobs() {
    return _.union(
        [path.join(process.gulp_dest, 'processed-templates', '*.js')],
        package_manager.getGlobsFor('javascript'),
        package_manager.getGlobsFor('unit-test-files')
    );
}

const { instrumentVinylFile } = require('./istanbul-instrument');

function getLicensesContent() {
    let licensesContent = '';
    const { distro } = package_manager;
    const third_paties = distro.modules.map(library => {
        if (library.indexOf(distro.folders.thirdPartyModules) !== 0) {
            return [];
        }
        return glob(path.join(package_manager.env.srcDir, library, '**', '*.license'));
    });

    const licensePaths = _.flatten(third_paties);
    _.each(licensePaths, function(licensePath) {
        licensesContent += `${fs.readFileSync(licensePath, {
            encoding: 'utf8'
        })}\n`;
    });
    return licensesContent;
}
function attachAdditionalDataToFiles() {
    const files = [];
    return through2(
        { objectMode: true },
        (file, type, cb) => {
            files.push(file);
            cb();
        },
        function(cb) {
            // Attach exported js modules to main js file
            const jsManifestFiles = files.filter(
                file => file.basename.indexOf('js-manifest') === 0
            );
            const mainFiles = files.filter(
                file =>
                    file.basename.indexOf('manifest') === -1 &&
                    file.basename.indexOf('template') === -1
            );
            mainFiles.forEach(file => {
                const appName = file.basename.substring(0, file.basename.length - 3);
                const relatedManifest = jsManifestFiles.find(
                    manifestFile => manifestFile.basename.indexOf(appName) > 0
                );
                const exposedModules = `SC.ENVIRONMENT.JS_MODULE_NAMES = ${relatedManifest.contents.toString()};`;
                let newContent = file.contents.toString() + exposedModules;
                newContent += getLicensesContent();
                file.contents = Buffer.from(newContent);
            });
            // Attach exported templates to templates file
            const templateManifestFiles = files.filter(
                file => file.basename.indexOf('templates-manifest') === 0
            );
            const templateFiles = files.filter(file => file.basename.indexOf('templates') > 0);
            templateFiles.forEach(file => {
                const appName = file.basename.substring(0, file.basename.indexOf('-'));
                const relatedManifest = templateManifestFiles.find(
                    manifestFile => manifestFile.basename.indexOf(appName) > 0
                );
                const exposedModules = `SC.ENVIRONMENT.TEMPLATES_MODULE_NAMES = ${relatedManifest.contents.toString()};`;
                file.contents = Buffer.from(file.contents.toString() + exposedModules);
            });
            // Update templates manifest content to have each template with .js extension
            templateManifestFiles.forEach(file => {
                const exportedTemplates = JSON.parse(file.contents.toString());
                file.contents = Buffer.from(JSON.stringify(exportedTemplates.map(t => `${t}.js`)));
            });

            files.forEach(file => {
                if (file.basename.indexOf('js-manifest') === -1) {
                    this.push(file);
                }
            });
            cb();
        }
    );
}
function addExtLayerPatch() {
    return gulp.src(path.join(process.gulp_init_cwd, 'gulp', 'library', 'extlaypatch.js'));
}

// because javascript-libs contains several amd modules names
// there could be duplicates amd module name
// bundler library validation only considers the first amd module definition per file
function addJavaScriptLibs() {
    return gulp.src(path.join(process.gulp_dest, 'javascript-libs.js'));
}

/**
 * execute uglify except for templates-manifest files
 * @param uglify
 */
function doUglify(uglify) {
    return gif(
        uglify,
        gif(function(file) {
            return file.basename.indexOf('templates-manifest-') === -1;
        }, guglify({ output: { comments: 'some' } }))
    );
}

function compileSCA(config, cb) {
    const uglify = !args.nouglify && !package_manager.isGulpLocal;
    config.entryPoints.forEach(entryPoint => {
        entryPoint.names.push('extlaypatch.js');
        if (!process.is_SCA_devTools) {
            entryPoint.names.unshift('javascript-libs.js');
        }
    });
    let stream = gulp
        .src(getGlobs(), { allowEmpty: true })
        .pipe(ts(typeScriptCompilerOptions))
        .pipe(package_manager.handleOverrides('javascript'))
        .pipe(addExtLayerPatch())
        .pipe(addJavaScriptLibs())
        .pipe(
            gif(
                args.instrumentFrontend,
                instrumentVinylFile({
                    coverageServer: args.coverageServer
                })
            )
        )
        .pipe(bundler(config))
        .pipe(attachAdditionalDataToFiles())
        .pipe(doUglify(uglify))
        .pipe(chmod(0o666))
        .pipe(gulp.dest(dest, { mode: '0777' }));
    if (process.generateV2) {
        stream = stream.pipe(gulp.dest(destSS2, { mode: '0777' }));
    }
    stream.on('error', package_manager.pipeErrorHandler).on('end', cb);
}

function processJavascript(cb) {
    // TODO: "findNestedDependencies": true we need to find a solution
    //  for that configuration, the bundler doesn't support it yet
    // TODO: find out what amdclean config in the distro is for
    const configs = package_manager.getTaskConfig('javascript', {});
    const bundlerConfig = {};
    bundlerConfig.paths = configs.paths;
    bundlerConfig.shim = configs.shim;
    bundlerConfig.entryPoints = [];
    configs.entryPoints.forEach(config => {
        const applications = package_manager.distro.app_manifest.application || [];
        const exportFile = config.exportFile.replace(/\.js$/, '');
        const isExtensible = _.contains(applications, exportFile);
        /* eslint-disable */
        const entryPoint = {
            names: config.names,
            output: [
                {
                    name: `${exportFile}.js`,
                    order: 2,
                    includeConfig: true,
                    patterns: ['\.js$'],
                    exportManifest: `../../js-manifest-${exportFile}.json`
                }
            ],
            skipDependencies: [],
            skipManifestDependencies: []
        };
        if (config.config) {
            entryPoint.config = config.config;
        }

        if (isExtensible) {
            if (process.is_SCA_devTools) {
                entryPoint.skipDependencies.push('\.tpl');
            } else {
                const name = path.relative(
                    dest,
                    path.join(package_manager.getNonManageResourcesPath(), `${exportFile}-templates.js`));

                const templateOutput = {
                    name: name,
                    patterns: ['\.tpl\.js$', 'javascript-libs\.js$'],
                    order: 1,
                    exportManifest: `../../templates-manifest-${exportFile}.json`
                };
                entryPoint.output.push(templateOutput);
                entryPoint.skipManifestDependencies.push('^Handlebars$');
            }
            entryPoint.output[0].patterns = ['^((?!Handlebars\\.CompilerNameLookup\\.js)(?!javascript-libs\\.js).)*$'];
        } else {
            entryPoint.names.unshift('javascript-libs.js');
            entryPoint.output[0].patterns = ['^((?!Handlebars\\.CompilerNameLookup\\.js).)*$'];
        }

        bundlerConfig.entryPoints.push(entryPoint);
        /* eslint-enable */
    });
    compileSCA(bundlerConfig, cb);
}

gulp.task('backward-compatibility-amd-unclean', function() {
    const outputFile = 'backward-compatibility-amd-unclean.js';
    const uglify = !args.nouglify && !package_manager.isGulpLocal;
    const files = _.union(
        _.flatten(
            _.map(
                package_manager.getGlobsForModule(
                    moduleLoaderLibrary,
                    moduleLoaderNSPackageSection
                ),
                function(g) {
                    return glob(g);
                }
            )
        ),
        _.flatten(
            _.map(package_manager.getGlobsFor('javascript-ext'), function(g) {
                return glob(g);
            })
        )
    );

    return gulp
        .src(files, { allowEmpty: true })
        .pipe(
            map(function(file, cb) {
                if (path.basename(file.path, '.js') === 'module-loader') {
                    let file_content = '';
                    file_content += "var was_undefined = (typeof define === 'undefined');\n";
                    file_content += 'if(was_undefined)\n{\n';
                    file_content += file.contents.toString();
                    file_content += '\n}\n';
                    file.contents = Buffer.from(file_content);
                }
                cb(null, file);
            })
        )
        .pipe(fileConcat(outputFile))
        .pipe(gif(uglify, guglify({ output: { comments: 'some' } })))
        .on('error', package_manager.pipeErrorHandler)
        .pipe(chmod(0o666))
        .pipe(gulp.dest(path.join(process.gulp_dest), { mode: '0777' }))
        .pipe(
            gif(process.generateV2, gulp.dest(path.join(process.gulp_dest_ss2), { mode: '0777' }))
        );
});

gulp.task('libs', function libs() {
    function getPathFile(moduleName, folderName, fileName) {
        const file =
            _.flatten(
                _.map(package_manager.getGlobsForModule(moduleName, folderName), function(g) {
                    if (fileName) {
                        return [
                            _.find(glob(g), function(f) {
                                return f.indexOf(fileName) !== -1;
                            })
                        ];
                    }
                    return glob(g);
                })
            )[0] || '';

        return file.replace(/\.[jt]s$/, '');
    }

    const outputFile = 'javascript-libs.js';
    const uglify = !args.nouglify && !package_manager.isGulpLocal;
    const files = {
        'module-loader': getPathFile(moduleLoaderLibrary, moduleLoaderNSPackageSection),
        Handlebars: getPathFile('handlebars', 'javascript-lib'),
        'Handlebars.CompilerNameLookup': getPathFile(
            'HandlebarsExtras',
            'javascript',
            'Handlebars.CompilerNameLookup'
        )
    };

    const globs = _.map(_.values(files), file => {
        return `${file}.[jt]s`;
    });
    /* eslint-disable */
    const names = _.map(_.values(files), file => {
        return `${path.basename(file)}.js`;
    });
    const bundlerConfig = {
        entryPoints: [
            {
                names,
                output: [
                    {
                        name: outputFile,
                        order: 1,
                        patterns: ['\.[js$]']
                    }
                ]
            }
        ],
        paths: { Handlebars: 'handlebars.runtime-v4.5.3.js' }
    };
    /* eslint-enable */
    return gulp
        .src(globs, { allowEmpty: true })
        .pipe(ts(typeScriptCompilerOptions))
        .pipe(bundler(bundlerConfig))
        .on('error', package_manager.pipeErrorHandler)
        .pipe(gif(uglify, guglify({ output: { comments: 'some' } })))
        .on('error', package_manager.pipeErrorHandler)
        .pipe(chmod(0o666))
        .pipe(gulp.dest(path.join(process.gulp_dest), { mode: '0777' }))
        .pipe(
            gif(process.generateV2, gulp.dest(path.join(process.gulp_dest_ss2), { mode: '0777' }))
        );
});

let js_deps = ['requireJSCopy'];

!process.is_SCA_devTools && js_deps.splice(0, 0, 'templates');

js_deps.push(gulp.series('backward-compatibility-amd-unclean', 'libs'));
js_deps = gulp.parallel(js_deps);

gulp.task('javascript', gulp.series(js_deps, processJavascript));
