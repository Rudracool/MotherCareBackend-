const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const map = require('map-stream');
const args = require('yargs').argv;
const chmod = require('gulp-chmod');
const ts = require('gulp-typescript');
const gif = require('gulp-if');
const fs = require('fs');

const package_manager = require('../package-manager');
!process.is_SCA_devTools && require('./templates');
require('./requireJSCopy');

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
let paths = [];
let jsModulesName = [];
let tplModulesName = [];
if (args.tsStrict) {
    typeScriptCompilerOptions.strictNullChecks = true;
    typeScriptCompilerOptions.strictBindCallApply = true;
    typeScriptCompilerOptions.strictFunctionTypes = true;
    typeScriptCompilerOptions.strictPropertyInitialization = true;
    typeScriptCompilerOptions.noImplicitThis = true;
}
function jsDestination() {
    return path.join(process.gulp_dest, 'javascript', 'compiled');
}

function getTemplatesGlobs() {
    return [path.join(process.gulp_dest, 'processed-templates', '*.js')];
}

function collectPath(file, cb) {
    paths.push(file.path);
    cb(null, file);
}

function getPathKeyValue(fileName, config) {
    let pathKeyValue = '';
    if (config.paths) {
        Object.keys(config.paths).forEach(pathKey => {
            if (config.paths[pathKey] === fileName && !pathKeyValue) {
                pathKeyValue = pathKey;
            }
        });
    }
    return pathKeyValue;
}

function shimTemplate(moduleDefine, content, config) {
    const dependencies = config.shim[moduleDefine].deps || [];
    const shimModuleName = config.shim[moduleDefine].exports || '';
    const dependenciesWithinQuotes = dependencies.map(dependency => `"${dependency}"`);
    const dependenciesValues =
        dependencies.length > 0 ? `${dependenciesWithinQuotes.join(',')}` : '';

    return `${'(function(root) {define("'}${moduleDefine}", [${dependenciesValues}], function() {
                return (function() {${content}
                ${shimModuleName ? `return root.${shimModuleName}=${shimModuleName};` : ''}})
                .apply(root, arguments);});}(this));`;
}

const DefineAndDependenciesRegex = /define\s*\((\s*("([^"]+)"|'([^']+)')\s*,)?\s*(\[([^\]]*)\])?/g;

function setAmdModuleName(content, newModuleName) {
    return content.replace(
        DefineAndDependenciesRegex,
        (original, a, moduleName, b, c, dependencies) => {
            if (!moduleName) {
                return dependencies
                    ? `define("${newModuleName}", ${dependencies}`
                    : `define("${newModuleName}", `;
            }
            return original;
        }
    );
}

function applyShim(file, config) {
    const fileName = path.basename(file.path);
    const pathKeyValue = getPathKeyValue(fileName, config);
    if (config.shim[pathKeyValue]) {
        file.contents = Buffer.from(shimTemplate(pathKeyValue, file.contents.toString(), config));
    } else {
        const fileWithoutExtension = fileName.substr(
            0,
            fileName.lastIndexOf(path.extname(fileName))
        );
        if (config.shim[fileWithoutExtension]) {
            const content = setAmdModuleName(file.contents.toString(), fileWithoutExtension);
            file.contents = Buffer.from(shimTemplate(fileWithoutExtension, content, config));
        }
    }
    return file;
}

function getModuleName(config, fileName) {
    const newModuleName = Object.keys(config.paths).find(
        moduleName => `${fileName}.js` === config.paths[moduleName]
    );
    return newModuleName || fileName;
}

let tsProject;
function processJavascriptLocal(cb, initializing) {
    if (!tsProject) {
        tsProject = ts.createProject(typeScriptCompilerOptions);
    }
    const globs = [
        ...package_manager.getGlobsFor('javascript'),
        ...package_manager.getGlobsFor('javascript-lib')
    ];
    const destination = jsDestination();
    const config = package_manager.getTaskConfig('javascript', {});
    return gulp
        .src(globs, { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(package_manager.handleOverrides('javascript'))
        .pipe(gif(initializing, map(collectPath)))
        .pipe(
            map((file, mapCb) => {
                const fileName = path.basename(file.path);
                file.base = file.path.replace(fileName, '');
                mapCb(null, file);
            })
        )
        .pipe(
            map((file, mapCb) => {
                let shimFile = file;
                const fileName = path.basename(file.path);
                const pathKeyValue = getPathKeyValue(fileName, config);
                let content = file.contents.toString();
                if (pathKeyValue) {
                    content = setAmdModuleName(file.contents.toString(), pathKeyValue);
                }
                file.contents = Buffer.from(content);
                if (config.shim) {
                    shimFile = applyShim(file, config);
                }
                mapCb(null, shimFile);
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(chmod(0o666))
        .pipe(
            gulp.dest(destination),
            { mode: '0777' }
        )
        .on('end', cb);
}

function initializeJavascriptLocal(cb) {
    processJavascriptLocal(cb, true);
}
function collectTemplatePaths(cb) {
    if (!process.is_SCA_devTools) {
        gulp.src(getTemplatesGlobs())
            .pipe(map(collectPath))
            .on('end', cb);
    } else {
        cb();
    }
}

function getBaseUrl() {
    let http_config = package_manager.getTaskConfig('local.https', false);
    let protocol = 'https';

    if (!http_config) {
        http_config = package_manager.getTaskConfig('local.http', false);
        protocol = 'http';
    }
    return `${protocol}://localhost:${http_config.port}`;
}

function getPathsPerModuleName(config) {
    const pathsPerModuleName = {};
    jsModulesName = [];
    tplModulesName = [];
    paths.forEach(filePath => {
        let normalizedPath = path.relative(process.gulp_dest, filePath);
        const moduleName = getModuleName(config, path.basename(normalizedPath, '.js'));
        const override_info = package_manager.getOverrideInfo(normalizedPath);

        if (override_info.isOverriden) {
            normalizedPath = override_info.overridePath;
        }

        let modulePath = normalizedPath.replace(/\\/g, '/').replace(/\.js$/, '');
        if (pathsPerModuleName[moduleName]) {
            throw new Error(
                `${moduleName} is defined twice:\n${
                    pathsPerModuleName[moduleName]
                }\n${modulePath}.\nDefine an override or remove one of the troubled modules`
            );
        }

        if (modulePath.indexOf('../../third_parties') === 0) {
            if (config && config.shim && config.shim[moduleName]) {
                const fileName = path.basename(modulePath);
                modulePath = path.join('javascript', 'compiled', fileName);
            } else {
                modulePath = modulePath.replace('../../third_parties', 'third_parties');
            }
            jsModulesName.push(moduleName);
        } else if (modulePath.indexOf('processed-templates/') === -1) {
            modulePath = path.join('javascript', 'compiled', moduleName);
            jsModulesName.push(moduleName);
        } else {
            tplModulesName.push(moduleName);
        }
        pathsPerModuleName[moduleName] = modulePath;
    });
    paths = [];
    return pathsPerModuleName;
}

function generateEntryPoints(cb) {
    const config = package_manager.getTaskConfig('javascript', {});
    const baseUrl = getBaseUrl();
    const requireConfig = {};
    requireConfig.baseUrl = baseUrl;
    requireConfig.shim = config.shim;
    requireConfig.paths = getPathsPerModuleName(config);
    const entryPointDestination = path.join(process.gulp_dest, 'javascript');
    const extLayerPatch = fs.readFileSync(
        path.join(process.gulp_init_cwd, 'gulp', 'library', 'extlaypatch.js')
    );
    config.entryPoints.forEach(val => {
        requireConfig.map = val.config && val.config.map ? val.config.map : {};
        const entryPointVarName = val.names[0].replace(/\.js$/g, '').replace(/\./g, '');
        const fileContent = `try {
                                    require.config(${JSON.stringify(requireConfig)});
                                    var ${entryPointVarName}= true;
                                } catch(e){};
                                SC.ENVIRONMENT.JS_MODULE_NAMES = ${JSON.stringify(jsModulesName)};
                                SC.ENVIRONMENT.TEMPLATES_MODULE_NAMES = ${JSON.stringify(
                                    tplModulesName
                                )};
                                ${extLayerPatch}`;
        fs.writeFileSync(path.join(entryPointDestination, val.exportFile), fileContent, null);
    });
    cb();
}

const javascriptLocalDependencies = ['requireJSCopy', initializeJavascriptLocal];
if (!process.is_SCA_devTools) {
    javascriptLocalDependencies.push(gulp.series('templates', collectTemplatePaths));
}

gulp.task(
    'javascript-local',
    gulp.series(gulp.parallel(javascriptLocalDependencies), generateEntryPoints)
);

gulp.task('watch-javascript', function() {
    const globs = package_manager.getGlobsFor('javascript');
    gulp.watch(globs, { interval: 1000, delay: 3000 }, processJavascriptLocal);
});
